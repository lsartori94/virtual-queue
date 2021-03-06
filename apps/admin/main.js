const socket = io('http://localhost:6969');
const STATUS = {
  FREE: 'FREE',
  PARKED: 'PARKED',
  PREPARING: 'PREPARING',
  READY_FOR_DELIVERY: 'READY_FOR_DELIVERY',
  DELIVERING: 'DELIVERING',
  DELIVERED: 'DELIVERED',
}

const orderElem = ({id, order, status, elapsedTime}) => `
<div class="order-container" data-id="${id}">
  <div class="order-spot">
    ${id}
  </div>
  <div class="order-id">
    ${order}
  </div>
  <div class="order-status">
    ${status}
  </div>
  <div class="order-time">
    ${elapsedTime}
  </div>
</div>
`;

const createElementFromHTML = (htmlString) => {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild; 
}

const ordersContainer = document.getElementById('queue-items');

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('log', (message) => console.log(message));

socket.on('update', (message) => {
  while (ordersContainer.firstChild) {
    ordersContainer.removeChild(ordersContainer.lastChild);
  }
  const items = message.map(orderElem);
  items.forEach((el) => {
    ordersContainer.appendChild(createElementFromHTML(el));
  });

  updateOrdersHandlers();
});

const prepare = (spot) => {
  const payload = {
    id: spot
  };

  socket.emit('prepare', payload);
};

const toDeliver = (spot) => {
  const payload = {
    id: spot
  };

  socket.emit('ready for delivery', payload);
}

let selectedOrder;
const calculateIDValue = (el) => +el.getAttribute('data-id');

const prepareButton = document.getElementById('prepare');
const toDeliveryButton = document.getElementById('to-deliver');

const prepareClick = (_) => {
  console.log('update :>>');
  prepare(calculateIDValue(selectedOrder));
};

const toDeliveryClick = (_) => {
  console.log('update :>>');
  toDeliver(calculateIDValue(selectedOrder));
};

prepareButton.addEventListener('click', prepareClick);
toDeliveryButton.addEventListener('click', toDeliveryClick);

function updateOrdersHandlers() {
  const orderContainers = document.querySelectorAll('.order-container');
  const orderContainerClick = (e) => {
    const selected = document.querySelector('.order-container.selected');

    if (selected) {
      selected.classList.toggle('selected');
    }
    e.target.classList.toggle('selected');
    selectedOrder = e.target;
  };
  
  orderContainers.forEach(el => el.addEventListener('click', orderContainerClick));
}
