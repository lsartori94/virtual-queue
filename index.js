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
  },
  {
    id: 2,
    status: STATUS.FREE,
    elapsedTime: 0,
  },
  {
    id: 3,
    status: STATUS.FREE,
    elapsedTime: 0,
  },
  {
    id: 4,
    status: STATUS.FREE,
    elapsedTime: 0,
  },
  {
    id: 5,
    status: STATUS.FREE,
    elapsedTime: 0,
  },
  {
    id: 6,
    status: STATUS.FREE,
    elapsedTime: 0,
  },
  {
    id: 7,
    status: STATUS.FREE,
    elapsedTime: 0,
  },
];

io.on('connection', (socket) => {
  console.log('Someone Joined');

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
    log('Received request to park ' + message);
    const {id} = message;
    const {PARKED} = STATUS;
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

    update({
      id,
      status: PREPARING
    })

    // Simulate prepare
    prepare(id);
  });

  socket.on('ready for delivery', (message) => {
    log('Received request to prepare ' + message);
    const {id} = message;
    const {PREPARING} = STATUS;

    update({
      id,
      status: PREPARING
    })

    // Simulate prepare
    prepare(id);
  });

  socket.on('delivering', (message) => {
    log('Received request to deliver ' + message);
    const {id} = message;
    const {DELIVERING} = STATUS;

    update({
      id,
      status: DELIVERING
    })
  });

  socket.on('delivered', (message) => {
    log('Received request to delivered ' + message);
    const {id} = message;
    const {DELIVERED} = STATUS;

    update({
      id,
      status: DELIVERED
    })
  });

  socket.on('leave', (message) => {
    log('Received request to leave ' + message);
    const {id} = message;
    const {FREE} = STATUS;

    update({
      id,
      status: FREE
    })
  });

});