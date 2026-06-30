/**
 * API client service module for OpenChat backend REST integrations
 */

const BASE_URL = ''; // Same origin requests

/**
 * Fetch all available chat rooms from database
 * @returns {Promise<Array>}
 */
export async function fetchRooms() {
  const res = await fetch(`${BASE_URL}/api/rooms`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch rooms');
  }
  return res.json();
}

/**
 * Create a new chat room in the database
 * @param {string} roomName 
 * @returns {Promise<Object>}
 */
export async function createRoom(roomName) {
  const res = await fetch(`${BASE_URL}/api/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomName })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create room');
  }
  return res.json();
}

/**
 * Fetch message logs history of a specific room
 * @param {string} roomId 
 * @returns {Promise<Array>}
 */
export async function fetchMessages(roomId) {
  const res = await fetch(`${BASE_URL}/api/messages/${roomId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch messages');
  }
  return res.json();
}

/**
 * Save/post a chat message to the room database
 * @param {string} roomId 
 * @param {string} username 
 * @param {string} message 
 * @returns {Promise<Object>}
 */
export async function postMessage(roomId, username, message) {
  const res = await fetch(`${BASE_URL}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId, username, message })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to send message');
  }
  return res.json();
}
