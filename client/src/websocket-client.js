

// websocket-client.js
const socket = new WebSocket('ws://localhost:3000');

socket.onopen = function () {
  console.log('WebSocket connected');
};

export default socket;
