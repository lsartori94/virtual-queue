const static = require('node-static');
const http = require('http');
const file = new(static.Server)();
const PORT = 6969;

const app = http.createServer((req, res) => {
  file.serve(req, res);
}).listen(PORT, ()=> {
  console.log(`listening on port ${PORT}`);
});

const io = require('socket.io').listen(app);

const STATUS = {
  FREE: 'FREE',
  PARKED: 'PARKED',
  PREPARING: 'PREPARING',
  READY_FOR_DELIVERY: 'READY_FOR_DELIVERY',
  DELIVERING: 'DELIVERING',
  DELIVERED: 'DELIVERED',
}

const spots = [
  {
    id: 1,
    status: STATUS.FREE,
    elapsedTime: 0,
    order: 1234,
  },
  {
    id: 2,
    status: STATUS.FREE,
    elapsedTime: 0,
    order: 1234,
  },
  {
    id: 3,
    status: STATUS.FREE,
    elapsedTime: 0,
    order: 1234,
  },
  {
    id: 4,
    status: STATUS.FREE,
    elapsedTime: 0,
    order: 1234,
  },
  {
    id: 5,
    status: STATUS.FREE,
    elapsedTime: 0,
    order: 1234,
  },
  {
    id: 6,
    status: STATUS.FREE,
    elapsedTime: 0,
    order: 1234,
  },
  {
    id: 7,
    status: STATUS.FREE,
    elapsedTime: 0,
    order: 1234,
  },
];

io.on('connection', (socket) => {
  console.log('Someone Joined');
  socket.broadcast.emit('update', spots);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // convenience function to log server messages to the client
  function log() {
    var array = ['Message from client:'];
    array.push.apply(array, arguments);
    console.log(array);
  }

  function prepare(id){
    setTimeout(() => {
      console.log(`Preparing Something`);
      socket.broadcast.emit('deliver', id);
    }, 5000)
  }

  function update({id, status}){
    log('Received request to update ' + status);
    // Update spot status
    spots.forEach((el, i) => {
      if (el.id === id) {
        spots[i].status = status;
      }
    });

    // Update clients
    socket.broadcast.emit('update', spots);
  }

  socket.on('park', (message) => {
    const {id} = message;
    const {PARKED} = STATUS;
    log('Received request to park ' + id + ' to ' + PARKED);
    update({
      id,
      status: PARKED
    })
  });

  socket.on('order', (message) => {

  });

  socket.on('prepare', (message) => {
    log('Received request to prepare ' + message);
    const {id} = message;
    const {PREPARING} = STATUS;
    log('Received request to prepare ' + id + ' to ' + PREPARING);
    update({
      id,
      status: PREPARING
    })

    // Simulate prepare
    prepare(id);
  });

  socket.on('ready for delivery', (message) => {
    const {id} = message;
    const {READY_FOR_DELIVERY} = STATUS;
    log('Received request to prepare for delivery ' + id + ' to ' + READY_FOR_DELIVERY);
    update({
      id,
      status: READY_FOR_DELIVERY
    })
  });

  socket.on('delivering', (message) => {
    const {id} = message;
    const {DELIVERING} = STATUS;
    log('Received request to deliver ' + id + ' to ' + DELIVERING);

    update({
      id,
      status: DELIVERING
    })
  });

  socket.on('delivered', (message) => {
    const {id} = message;
    const {DELIVERED} = STATUS;
    log('Received request to delivered ' + id + ' to ' + DELIVERED);
    update({
      id,
      status: DELIVERED
    })
  });

  socket.on('leave', (message) => {
    const {id} = message;
    const {FREE} = STATUS;
    log('Received request to leave ' + id + ' to ' + FREE);
    update({
      id,
      status: FREE
    })
  });

});