const socket = io('http://localhost:6969');

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('log', (message) => console.log(message));

const park = (spot) => {
  const payload = {
    id: spot
  };

  socket.emit('park', payload);
};

const leave = (spot) => {
  const payload = {
    id: spot
  };

  socket.emit('leave', payload);
}

const calculateSpotValue = (el) => +el.getAttribute('data-spot');

let selectedSpotPark = document.querySelector('#parking .selected');
let selectedSpotLeave = document.querySelector('#leaving .selected');

const parkButton = document.getElementById('park');
const leaveButton = document.getElementById('leave');

const parkClick = (_) => {
  console.log('update :>>');
  socket.emit('log', 'PARK');
  park(calculateSpotValue(selectedSpotPark));
};

const leaveClick = (_) => {
  console.log('update :>>');
  leave(calculateSpotValue(selectedSpotLeave));
};

parkButton.addEventListener('click', parkClick);
leaveButton.addEventListener('click', leaveClick);

const parkOptions = document.querySelectorAll('#parking .parking-spot');
const leaveOptions = document.querySelectorAll('#leaving .parking-spot');

const parkOptionClick = (e) => {
  selectedSpotPark.classList.toggle('selected');
  e.target.classList.toggle('selected');
  selectedSpotPark = e.target;
};
const leaveOptionClick = (e) => {
  selectedSpotLeave.classList.toggle('selected');
  e.target.classList.toggle('selected');
  selectedSpotLeave = e.target;
};

parkOptions.forEach(option => option.addEventListener('click', parkOptionClick));
leaveOptions.forEach(option => option.addEventListener('click', leaveOptionClick));
