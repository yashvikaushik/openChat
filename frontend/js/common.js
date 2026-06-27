/**
 * Common Reusable Utilities for OpenChat
 */

// Toast notification container setup
const ensureToastContainer = () => {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
};

/**
 * Display a premium, slide-in toast notification.
 * @param {string} title 
 * @param {string} message 
 * @param {'success'|'error'} type 
 */
export function showToast(title, message, type = 'success') {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✅' : '⚠️';
  
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Force a reflow to trigger CSS transition
  toast.offsetHeight;
  toast.classList.add('show');
  
  // Auto remove toast
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, 4000);
}

/**
 * Validate username/display name (3 to 20 characters)
 * @param {string} name 
 * @returns {boolean}
 */
export function validateDisplayName(name) {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= 3 && trimmed.length <= 20;
}

/**
 * Validate room names (3 to 30 characters, no leading/trailing spaces)
 * @param {string} name 
 * @returns {boolean}
 */
export function validateRoomName(name) {
  if (!name) return false;
  // Must match exactly: no start/end spaces, 3-30 length
  const startsOrEndsWithSpace = name.startsWith(' ') || name.endsWith(' ');
  return !startsOrEndsWithSpace && name.length >= 3 && name.length <= 30;
}

/**
 * Format timestamp to hh:mm AM/PM format
 * @param {Date|string|number} dateVal 
 * @returns {string}
 */
export function formatTime(dateVal) {
  const date = new Date(dateVal);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Get item from Session Storage
 */
export function getSessionItem(key, defaultValue = null) {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('SessionStorage read error', e);
    return defaultValue;
  }
}

/**
 * Set item in Session Storage
 */
export function setSessionItem(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('SessionStorage write error', e);
  }
}

/**
 * Clear Session Storage
 */
export function clearSession() {
  try {
    sessionStorage.clear();
  } catch (e) {
    console.error('SessionStorage clear error', e);
  }
}
