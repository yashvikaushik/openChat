import { 
  validateDisplayName, 
  validateRoomName, 
  showToast, 
  setSessionItem 
} from './common.js';
import { fetchRooms, createRoom } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const joinForm = document.getElementById('join-form');
  const displayNameInput = document.getElementById('display-name');
  const newRoomInput = document.getElementById('new-room-name');
  const roomsRadioGroup = document.querySelector('.rooms-radio-group');

  let dbRooms = [];

  // Load rooms dynamically from API
  async function loadRoomsList() {
    try {
      roomsRadioGroup.innerHTML = '<p style="font-size:0.85rem;color:var(--text-secondary);text-align:center;">Loading rooms...</p>';
      dbRooms = await fetchRooms();
      
      if (dbRooms.length === 0) {
        roomsRadioGroup.innerHTML = '<p style="font-size:0.85rem;color:var(--text-muted);text-align:center;">No rooms available. Create a new one below!</p>';
        return;
      }

      roomsRadioGroup.innerHTML = '';
      dbRooms.forEach((room, index) => {
        const optionLabel = document.createElement('label');
        optionLabel.className = 'room-radio-option';
        
        // Mock online counts since Socket.io isn't integrated yet
        const mockOnline = {
          'General': 12,
          'JavaScript': 8,
          'Movies': 5,
          'Sports': 7
        };
        const count = mockOnline[room.roomName] || 1;

        optionLabel.innerHTML = `
          <input type="radio" name="roomSelect" value="${room._id}" data-name="${room.roomName}" ${index === 0 ? 'checked' : ''}>
          <div class="room-radio-content">
            <span class="room-name"># ${room.roomName}</span>
            <span class="online-tag green-tag">${count} online</span>
          </div>
        `;
        roomsRadioGroup.appendChild(optionLabel);
      });

      setupRadioEvents();
    } catch (err) {
      console.error(err);
      roomsRadioGroup.innerHTML = '<p style="font-size:0.85rem;color:var(--color-error);text-align:center;">Failed to load rooms.</p>';
      showToast('API Error', 'Failed to retrieve available rooms.', 'error');
    }
  }

  // Setup visual toggles between existing selection & custom creation input
  function setupRadioEvents() {
    const radioLabels = document.querySelectorAll('.room-radio-option');
    const roomRadioButtons = document.querySelectorAll('input[name="roomSelect"]');

    newRoomInput.addEventListener('input', () => {
      if (newRoomInput.value.trim().length > 0) {
        radioLabels.forEach(label => {
          label.style.opacity = '0.5';
          label.style.pointerEvents = 'none';
          const radio = label.querySelector('input');
          if (radio) radio.checked = false;
        });
      } else {
        radioLabels.forEach(label => {
          label.style.opacity = '1';
          label.style.pointerEvents = 'auto';
        });
        // Restore check to first item
        const checkedRadio = document.querySelector('input[name="roomSelect"]:checked');
        if (!checkedRadio && roomRadioButtons.length > 0) {
          roomRadioButtons[0].checked = true;
        }
      }
    });

    roomRadioButtons.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          newRoomInput.value = '';
          radioLabels.forEach(label => {
            label.style.opacity = '1';
            label.style.pointerEvents = 'auto';
          });
        }
      });
    });
  }

  // Handle Submit Join
  joinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const displayName = displayNameInput.value.trim();
    const newRoomName = newRoomInput.value.trim();
    
    let targetRoomId = '';
    let targetRoomName = '';
    let isNewRoom = false;

    if (newRoomName.length > 0) {
      targetRoomName = newRoomName;
      isNewRoom = true;
    } else {
      const checkedRadio = document.querySelector('input[name="roomSelect"]:checked');
      if (checkedRadio) {
        targetRoomId = checkedRadio.value;
        targetRoomName = checkedRadio.getAttribute('data-name');
      }
    }

    // Validation
    if (!validateDisplayName(displayName)) {
      showToast('Validation Error', 'Display name must be between 3 and 20 characters.', 'error');
      displayNameInput.focus();
      return;
    }

    if (isNewRoom && !validateRoomName(newRoomName)) {
      showToast('Validation Error', 'Room name must be 3-30 characters with no spaces at the start or end.', 'error');
      newRoomInput.focus();
      return;
    }

    if (!isNewRoom && !targetRoomId) {
      showToast('Validation Error', 'Please select a room or create a new one.', 'error');
      return;
    }

    try {
      // If user creates a new room, POST to API first
      if (isNewRoom) {
        // Double check local collision
        const duplicate = dbRooms.find(r => r.roomName.toLowerCase() === targetRoomName.toLowerCase());
        if (duplicate) {
          targetRoomId = duplicate._id;
          targetRoomName = duplicate.roomName;
        } else {
          showToast('Creating...', 'Creating room in database...', 'success');
          const created = await createRoom(targetRoomName);
          targetRoomId = created._id;
          targetRoomName = created.roomName;
        }
      }

      // Save user profile details
      setSessionItem('username', displayName);
      setSessionItem('roomId', targetRoomId);
      setSessionItem('roomName', targetRoomName);

      showToast('Success!', `Joining room #${targetRoomName}...`, 'success');
      
      setTimeout(() => {
        window.location.href = 'chat.html';
      }, 800);

    } catch (err) {
      console.error(err);
      showToast('Error', err.message || 'Failed to connect/join room.', 'error');
    }
  });

  // Load initial list
  loadRoomsList();
});
