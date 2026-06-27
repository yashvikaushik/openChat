import {
  validateDisplayName,
  validateRoomName,
  showToast,
  setSessionItem
} from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const joinForm = document.getElementById('join-form');
  const displayNameInput = document.getElementById('display-name');
  const newRoomInput = document.getElementById('new-room-name');
  const roomRadioButtons = document.querySelectorAll('input[name="roomSelect"]');
  const radioLabels = document.querySelectorAll('.room-radio-option');

  // Interactive Behavior: Mute radio buttons when user is typing a new room name
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
      // Re-check the first option if none is selected
      const checkedRadio = document.querySelector('input[name="roomSelect"]:checked');
      if (!checkedRadio && roomRadioButtons.length > 0) {
        roomRadioButtons[0].checked = true;
      } s
    }
  });

  // Re-enable/focus behavior when clicking radio options
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

  // Handle Join Form Submission
  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const displayName = displayNameInput.value.trim();
    const newRoomName = newRoomInput.value.trim();

    // 1. Determine Room Name
    let selectedRoom = '';
    let isNewRoom = false;

    if (newRoomName.length > 0) {
      selectedRoom = newRoomName;
      isNewRoom = true;
    } else {
      const checkedRadio = document.querySelector('input[name="roomSelect"]:checked');
      if (checkedRadio) {
        selectedRoom = checkedRadio.value;
      }
    }

    // 2. Validation
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

    if (!selectedRoom) {
      showToast('Validation Error', 'Please select an existing room or create a new one.', 'error');
      return;
    }

    // 3. Save to sessionStorage
    setSessionItem('username', displayName);
    setSessionItem('room', selectedRoom);

    // 4. Redirect
    showToast('Success!', `Joining room #${selectedRoom}...`, 'success');

    setTimeout(() => {
      window.location.href = 'chat.html';
    }, 800);
  });
});
