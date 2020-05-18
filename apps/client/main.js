const socket = io('http://localhost:6969');

const getParameterByName = (name) => {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const infoBox = document.getElementById('info');
const orderButton = document.getElementById('order');
const container = document.getElementById('container');
const parkingSpot = Number(getParameterByName('spot'));

const load = () => {
  if (!isNaN(parkingSpot) && parkingSpot >= 1 && parkingSpot <= 9) {
    infoBox.innerHTML = `You are on the spot ${parkingSpot}`;
    container.classList = '';
  } else {
    infoBox.innerHTML = 'You are on the wrong spot...';
    console.log(parkingSpot);
  }
};

const order = () => {
  console.log('update :>>');
  socket.emit('log', 'PARK');

  const payload = {
    id: parkingSpot,
  };

  socket.emit('park', payload);
  infoBox.innerHTML = 'Ordering...';
  container.classList = 'loading';
};

const leave = () => {
  const payload = {
    id: parkingSpot,
  };

  socket.emit('leave', payload);
};

socket.on('connect', () => {
  console.log('Connected');
  load();
});

socket.on('update', (message) => {
  const pk = message.find((el) => el.id === parkingSpot);
  console.log(pk);
  switch (pk.status) {
    case 'FREE':
      load();
      break;
    case 'DELIVERED':
      infoBox.innerHTML = 'Your order has been delivered!';
      container.classList = 'loading';
      setTimeout(() => {
        leave();
      }, 5000);
      break;
    default:
      infoBox.innerHTML = `Status: ${pk.status}`;
      container.classList = 'loading';
      break;
  }
});

orderButton.addEventListener('click', order);
