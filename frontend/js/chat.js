import {
  getSessionItem,
  setSessionItem,
  formatTime,
  showToast,
  validateRoomName
} from './common.js';
import { fetchRooms, createRoom, fetchMessages } from './api.js';
import {
  connectSocket,
  disconnectSocket,
  joinRoom,
  sendMessage,
  listenForMessages,
  listenForUserJoined,
  listenForUserLeft,
  listenForOnlineUsers
} from './socket.js';

// 1. Session check
const username = getSessionItem('username');
let currentRoomId = getSessionItem('roomId');
let currentRoomName = getSessionItem('roomName');

if (!username || !currentRoomId || !currentRoomName) {
  showToast('Unauthorized', 'Please join a room from the home screen.', 'error');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
  // Return out of module execution by throwing or simply not executing further code
  throw new Error('Unauthorized access redirecting to index.html');
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

  // Global app state
  let dbRooms = [];

  // Initials parser
  function getInitials(name) {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  // Load Rooms list dynamically
  async function loadRoomsSidebar() {
    try {
      dbRooms = await fetchRooms();
      roomsListContainer.innerHTML = '';

      dbRooms.forEach(room => {
        const btn = document.createElement('button');
        const isActive = room._id === currentRoomId;
        btn.className = `room-nav-item ${isActive ? 'active' : ''}`;
        btn.setAttribute('data-id', room._id);
        btn.setAttribute('data-name', room.roomName);

        // Predefined mockup mock numbers fallback, will update dynamically on active room
        const mockOnline = {
          'General': 12,
          'JavaScript': 8,
          'Movies': 5,
          'Sports': 7
        };
        const count = mockOnline[room.roomName] || 1;

        btn.innerHTML = `
          <span class="room-prefix">#</span>
          <div class="room-details">
            <span class="room-nav-name">${room.roomName}</span>
            <span class="room-member-count" id="sidebar-count-${room._id}">${count} online</span>
          </div>
        `;
        roomsListContainer.appendChild(btn);
      });
    } catch (err) {
      console.error(err);
      showToast('Error', 'Failed to refresh room list sidebar.', 'error');
    }
  }

  // Load chat messages from Database (HTTP REST History fallback)
  async function loadActiveMessages() {
    try {
      messagesPanel.innerHTML = '<p style="font-size:0.85rem;color:var(--text-muted);text-align:center;padding:20px 0;">Loading messages...</p>';

      // Update Header Info
      activeRoomTitle.textContent = `# ${currentRoomName}`;

      const messages = await fetchMessages(currentRoomId);
      messagesPanel.innerHTML = '';

      if (messages.length === 0) {
        // Welcome notification
        renderNotification(`Welcome to #${currentRoomName}! Start the conversation.`, 'notification-purple');
      } else {
        messages.forEach(msg => {
          const isOwn = msg.username === username;
          renderMessage(msg.username, msg.message, formatTime(msg.createdAt), isOwn);
        });
      }

      scrollToBottom();
    } catch (err) {
      console.error(err);
      messagesPanel.innerHTML = '<p style="font-size:0.85rem;color:var(--color-error);text-align:center;padding:20px 0;">Failed to load chat history.</p>';
      showToast('Database Error', 'Failed to retrieve message logs.', 'error');
    }
  }

  // Render text notification
  function renderNotification(text, cssClass = '') {
    const notifyDiv = document.createElement('div');
    notifyDiv.className = `system-notification ${cssClass}`;
    notifyDiv.innerHTML = `<span>${text}</span>`;
    messagesPanel.appendChild(notifyDiv);
  }

  // Render message bubble
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

  // Scroll messages wrapper
  function scrollToBottom() {
    messagesPanel.scrollTop = messagesPanel.scrollHeight;
  }

  // Switch Room action
  function selectRoom(roomId, roomName) {
    // 1. Leave the old socket room
    disconnectSocket();

    currentRoomId = roomId;
    currentRoomName = roomName;
    setSessionItem('roomId', roomId);
    setSessionItem('roomName', roomName);

    // Apply active class in sidebar UI
    const buttons = roomsListContainer.querySelectorAll('.room-nav-item');
    buttons.forEach(btn => {
      if (btn.getAttribute('data-id') === roomId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 2. Load old history logs
    loadActiveMessages();

    // 3. Connect and Join the new socket room
    connectSocket();
    joinRoom(currentRoomId, username);
  }

  // Listen to sidebar room selection
  roomsListContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.room-nav-item');
    if (btn) {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      if (id !== currentRoomId) {
        selectRoom(id, name);
      }
    }
  });

  // Handle message submission (Socket.IO event dispatch)
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    // Send via socket connection
    sendMessage(currentRoomId, username, text);

    // Clear input text field and restore height
    messageInput.value = '';
    messageInput.style.height = 'auto';
  });

  // Auto-grow textarea
  messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = (messageInput.scrollHeight - 16) + 'px';
  });

  // Enter triggers send (no shift key)
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });

  // Dialog triggers
  createRoomTrigger.addEventListener('click', () => {
    roomDialog.showModal();
  });

  btnDialogCancel.addEventListener('click', () => {
    roomDialog.close();
    dialogRoomNameInput.value = '';
  });

  // Create room modal submission
  dialogCreateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = dialogRoomNameInput.value.trim();

    if (!validateRoomName(name)) {
      showToast('Validation Error', 'Room name must be 3-30 characters with no spaces at the start or end.', 'error');
      return;
    }

    try {
      showToast('Creating...', 'Registering new room...', 'success');
      const room = await createRoom(name);

      // Reload sidebar
      await loadRoomsSidebar();

      roomDialog.close();
      dialogRoomNameInput.value = '';

      // Select new room
      selectRoom(room._id, room.roomName);
      showToast('Success!', `Room #${room.roomName} created!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error', err.message || 'Failed to create room.', 'error');
    }
  });

  // Leave action
  btnLeave.addEventListener('click', () => {
    if (confirm('Are you sure you want to leave the chat?')) {
      disconnectSocket();
      showToast('Leaving...', 'Redirecting back to home.', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    }
  });

  // Mute notification trigger
  let isMuted = false;
  btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    btnMute.classList.toggle('muted', isMuted);
    btnMute.style.color = isMuted ? 'var(--color-error)' : 'var(--text-secondary)';
    showToast(isMuted ? 'Muted' : 'Unmuted', isMuted ? 'Notifications are muted' : 'Notifications are enabled', 'success');
  });

  // Initialize Socket.IO connection and attach event listeners
  function setupSocketListeners() {
    connectSocket();

    // Listen for incoming messages in the room
    listenForMessages((msg) => {
      if (msg.roomId === currentRoomId) {
        const isOwn = msg.username === username;
        renderMessage(msg.username, msg.message, formatTime(msg.createdAt), isOwn);
        scrollToBottom();

        // Play subtle sound if not own message and not muted
        if (!isOwn && !isMuted) {
          try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2357/2357-84.wav');
            audio.volume = 0.4;
            audio.play().catch(() => {});
          } catch (e) {}
        }
      }
    });

    // Listen for new user joins
    listenForUserJoined((data) => {
      renderNotification(data.message, 'notification-green');
      scrollToBottom();
    });

    // Listen for user disconnects/leaves
    listenForUserLeft((data) => {
      renderNotification(data.message, 'notification-purple');
      scrollToBottom();
    });

    // Listen for online users lists updates
    listenForOnlineUsers((usernames) => {
      activeRoomSubtitle.textContent = `${usernames.length} members online`;
      headerMemberCount.textContent = usernames.length;
      
      const sidebarCount = document.getElementById(`sidebar-count-${currentRoomId}`);
      if (sidebarCount) {
        sidebarCount.textContent = `${usernames.length} online`;
      }
    });

    // Join initial active room
    joinRoom(currentRoomId, username);
  }

  // Initialize App Flow
  async function initializeApp() {
    await loadRoomsSidebar();
    await loadActiveMessages();
    setupSocketListeners();
  }

  initializeApp();
