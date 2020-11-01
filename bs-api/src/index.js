const PORT = process.env.PORT || 8001;
const ENV = require("./environment");

const app = require("./application")();
const server = require("http").Server(app);

const clients = [];
const WebSocket = require("ws");


const wss = new WebSocket.Server({ server });
let count = 0;
wss.on("connection", socket => {
  let AI = {}
  const computer = require('./computer')(AI);
  socket.id = count++;
  socket.winner = false;
  clients.push(socket);
  socket.onmessage = event => {
    const opponentID = (clients.indexOf(socket) + 1) % 2;
    console.log(`Message Received: ${event.data} and has type of ${typeof event.data}`);
    const data = JSON.parse(event.data)
    if (data === 'SET_AI') {
      AI = computer.setBoard();
      return
    }
    else if (Array.isArray(data))
      socket.board = data;
    else if (typeof data === 'string') {
      const coord = [Number(data[0]), Number(data[1])];
      let res = '';
      if (clients.length >= 10) {
        res = clients[opponentID].board[coord[0]][coord[1]];
        return socket.send(JSON.stringify({ [data]: res }));
      } else {
        res = AI.board[coord[0]][coord[1]];
        socket.send(JSON.stringify({ [data]: res, shot: true }))
        if(AI.board) {
          setTimeout(() => {
            socket.send(JSON.stringify({...computer.takeShotAI(socket.board), oppo:true}));
          }, 500)
        }
      }
    }
  };

  socket.on('close', () => {
    console.log(`client died`);
    // wss.splice(clients.indexOf(socket), 1);
    clients.splice(clients.indexOf(socket), 1);
  })
});

function greetClients() {
  wss.clients.forEach(function eachClient(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify('Hi')
      );
    }
  });
}

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in ${ENV} mode.`);
});
