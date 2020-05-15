const socket = io('http://localhost');

socket.on('update', (payload) => {
  console.log(payload);
});
