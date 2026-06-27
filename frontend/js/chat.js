import {
  getSessionItem,
  setSessionItem,
  formatTime,
  showToast,
  validateRoomName
} from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Session check
  const username = getSessionItem('username');
  let activeRoom = getSessionItem('room', 'General');

  if (!username) {
    showToast('Unauthorized', 'Please enter a display name to join the chat.', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
    return;
  }

  // DOM Elements
  const currentUserAvatar = document.getElementById('current-user-avatar');
  const currentUserName = document.getElementById('current-user-name');
  const activeRoomTitle = document.getElementById('active-room-title');
  const activeRoomSubtitle = document.getElementById('active-room-subtitle');
  const headerMemberCount = document.getElementById('header-member-count');
  const roomsListContainer = document.getElementById('rooms-list-container');
  const messagesPanel = document.getElementById('messages-panel');
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');

  // Dialog Elements
  const createRoomTrigger = document.getElementById('btn-create-room-trigger');
  const roomDialog = document.getElementById('room-dialog');
  const dialogCreateForm = document.getElementById('dialog-create-form');
  const dialogRoomNameInput = document.getElementById('dialog-room-name');
  const btnDialogCancel = document.getElementById('btn-dialog-cancel');

  const btnLeave = document.getElementById('btn-leave');
  const btnMute = document.getElementById('btn-mute');

  // Set Profile Footer Info
  currentUserName.textContent = username;
  currentUserAvatar.textContent = getInitials(username);

  // Mock initial rooms with online counts
  const roomOnlineCounts = {
    'General': 12,
    'JavaScript': 8,
    'Movies': 5,
    'Sports': 7
  };

  // Mock message log database in-memory
  const chatHistory = {
    'General': [
      { type: 'notification', text: 'Alice joined the room', class: 'notification-green', time: '10:32 AM' },
      { type: 'notification', text: 'Bob joined the room', class: 'notification-purple', time: '10:33 AM' },
      { type: 'message', sender: 'Alice', text: 'Hello everyone! 👋', time: '10:34 AM', own: false },
      { type: 'message', sender: 'Bob', text: 'Hi Alice! Welcome to the room.', time: '10:35 AM', own: false },
      { type: 'message', sender: 'Charlie', text: 'Good morning all ☀️', time: '10:36 AM', own: false },
      { type: 'message', sender: 'Diana', text: 'Nice to see you all here!', time: '10:37 AM', own: false },
      { type: 'notification', text: 'Charlie joined the room', class: '', time: '10:36 AM' }
    ],
    'JavaScript': [
      { type: 'notification', text: 'DevBot joined the room', class: 'notification-green', time: '11:00 AM' },
      { type: 'message', sender: 'DevBot', text: 'Welcome to the JS discussion room! 🚀', time: '11:01 AM', own: false }
    ],
    'Movies': [
      { type: 'notification', text: 'Cinephile joined the room', class: 'notification-purple', time: '12:15 PM' },
      { type: 'message', sender: 'Cinephile', text: 'Seen any good movies lately?', time: '12:16 PM', own: false }
    ],
    'Sports': [
      { type: 'notification', text: 'Coach joined the room', class: 'notification-green', time: '09:00 AM' },
      { type: 'message', sender: 'Coach', text: 'Ready for the game tonight? ⚽', time: '09:02 AM', own: false }
    ]
  };

  // Helper to extract initials
  function getInitials(name) {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  // Load chat room message history
  function loadRoomHistory(roomName) {
    messagesPanel.innerHTML = '';

    // Set Header titles
    activeRoomTitle.textContent = `# ${roomName}`;
    const onlineCount = roomOnlineCounts[roomName] || 1;
    activeRoomSubtitle.textContent = `${onlineCount} members online`;
    headerMemberCount.textContent = onlineCount;

    // Load messages
    const history = chatHistory[roomName] || [];
    history.forEach(item => {
      if (item.type === 'notification') {
        renderNotification(item.text, item.class, item.time);
      } else {
        renderMessage(item.sender, item.text, item.time, item.sender === username);
      }
    });

    scrollToBottom();
  }

  // Render a join/leave/system notification
  function renderNotification(text, cssClass = '', time = '') {
    const notifyDiv = document.createElement('div');
    notifyDiv.className = `system-notification ${cssClass}`;
    notifyDiv.innerHTML = `
      <span>${text}</span>
      ${time ? `<span class="notification-time">${time}</span>` : ''}
    `;
    messagesPanel.appendChild(notifyDiv);
  }

  // Render a chat message bubble
  function renderMessage(sender, text, time, isOwn = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-item ${isOwn ? 'own-message' : ''}`;

    const initials = getInitials(sender);

    msgDiv.innerHTML = `
      <div class="message-avatar">${initials}</div>
      <div class="message-content-wrapper">
        <div class="message-meta">
          <span class="message-sender">${sender}</span>
          <span class="message-time">${time}</span>
        </div>
        <div class="message-body">${text}</div>
      </div>
    `;

    messagesPanel.appendChild(msgDiv);
  }

  // Auto-scroll utility
  function scrollToBottom() {
    messagesPanel.scrollTop = messagesPanel.scrollHeight;
  }

  // Set Active Room Style and Switch
  function selectRoom(roomName) {
    activeRoom = roomName;
    setSessionItem('room', roomName);

    // Highlight sidebar list
    const items = roomsListContainer.querySelectorAll('.room-nav-item');
    items.forEach(btn => {
      const btnRoom = btn.getAttribute('data-room');
      if (btnRoom === roomName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    loadRoomHistory(roomName);
  }

  // Bind Switch Room events
  roomsListContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.room-nav-item');
    if (btn) {
      const targetRoomName = btn.getAttribute('data-room');
      selectRoom(targetRoomName);
    }
  });

  // Handle Send Message Submission
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const timeString = formatTime(new Date());

    // 1. Render immediately
    renderMessage(username, text, timeString, true);

    // 2. Add to active room history log
    if (!chatHistory[activeRoom]) {
      chatHistory[activeRoom] = [];
    }
    chatHistory[activeRoom].push({
      type: 'message',
      sender: username,
      text: text,
      time: timeString,
      own: true
    });

    // 3. Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto'; // Reset text area height
    scrollToBottom();
  });

  // Auto grow textarea as typing
  messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = (messageInput.scrollHeight - 16) + 'px';
  });

  // Submit on Enter key (unless Shift key is pressed)
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });

  // Sidebar Dialog Open/Close (Create Room Modal)
  createRoomTrigger.addEventListener('click', () => {
    roomDialog.showModal();
  });

  btnDialogCancel.addEventListener('click', () => {
    roomDialog.close();
    dialogRoomNameInput.value = '';
  });

  dialogCreateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = dialogRoomNameInput.value.trim();

    if (!validateRoomName(newName)) {
      showToast('Validation Error', 'Room name must be 3-30 characters with no spaces at the start or end.', 'error');
      return;
    }

    // Check if room exists
    if (chatHistory[newName] || roomOnlineCounts[newName]) {
      showToast('Error', 'Room already exists!', 'error');
      return;
    }

    // Create Room in database
    roomOnlineCounts[newName] = 1;
    chatHistory[newName] = [
      { type: 'notification', text: `Room #${newName} was created`, class: 'notification-purple', time: formatTime(new Date()) }
    ];

    // Append to sidebar
    const btn = document.createElement('button');
    btn.className = 'room-nav-item';
    btn.setAttribute('data-room', newName);
    btn.innerHTML = `
      <span class="room-prefix">#</span>
      <div class="room-details">
        <span class="room-nav-name">${newName}</span>
        <span class="room-member-count">1 online</span>
      </div>
    `;
    roomsListContainer.appendChild(btn);

    // Close Dialog
    roomDialog.close();
    dialogRoomNameInput.value = '';

    // Select new room
    selectRoom(newName);
    showToast('Room Created', `Joined room #${newName}!`, 'success');
  });

  // Active actions: Exit
  btnLeave.addEventListener('click', () => {
    if (confirm('Are you sure you want to leave the chat?')) {
      showToast('Leaving...', 'Redirecting back to home.', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }
  });

  // Mute action trigger
  let isMuted = false;
  btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    btnMute.classList.toggle('muted', isMuted);
    btnMute.style.color = isMuted ? 'var(--color-error)' : 'var(--text-secondary)';
    showToast(isMuted ? 'Muted' : 'Unmuted', isMuted ? 'Notifications are muted' : 'Notifications are enabled', 'success');
  });

  // Initial load
  // If the room in sessionStorage doesn't exist in our sidebar, add it
  if (activeRoom && !chatHistory[activeRoom]) {
    roomOnlineCounts[activeRoom] = 1;
    chatHistory[activeRoom] = [
      { type: 'notification', text: `Room #${activeRoom} was created`, class: 'notification-purple', time: formatTime(new Date()) }
    ];

    const btn = document.createElement('button');
    btn.className = 'room-nav-item';
    btn.setAttribute('data-room', activeRoom);
    btn.innerHTML = `
      <span class="room-prefix">#</span>
      <div class="room-details">
        <span class="room-nav-name">${activeRoom}</span>
        <span class="room-member-count">1 online</span>
      </div>
    `;
    roomsListContainer.appendChild(btn);
  }

  // Load the initial room
  selectRoom(activeRoom);
});
