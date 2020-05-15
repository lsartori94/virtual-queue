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
  const filteredItems = message.filter((el) => {
    return el.status === STATUS.READY_FOR_DELIVERY ||
      el.status === STATUS.DELIVERING;
  });
  const items = filteredItems.map(orderElem);
  items.forEach((el) => {
    ordersContainer.appendChild(createElementFromHTML(el));
  });

  updateOrdersHandlers();
});

const deliver = (spot) => {
  const payload = {
    id: spot
  };

  socket.emit('delivering', payload);
};

const delivered = (spot) => {
  const payload = {
    id: spot
  };

  socket.emit('delivered', payload);
}

let selectedOrder;
const calculateIDValue = (el) => +el.getAttribute('data-id');

const deliverButton = document.getElementById('deliver');
const deliveredButton = document.getElementById('delivered');

const deliverClick = (_) => {
  console.log('update :>>');
  selectedOrder.querySelector('.order-status').textContent = 'DELIVERING';
  deliver(calculateIDValue(selectedOrder));
};

const deliveredClick = (_) => {
  console.log('update :>>');
  selectedOrder.querySelector('.order-status').textContent = 'DELIVERED';
  delivered(calculateIDValue(selectedOrder));
};

deliverButton.addEventListener('click', deliverClick);
deliveredButton.addEventListener('click', deliveredClick);

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
