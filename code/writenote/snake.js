//thanks random youtube tutorial on socket.io
//i need to learn that shit

headeratags[0].addEventListener("click", function(e){
    if(e.detail>3){
        loadSnake()
    }
})

var snakewindow = document.createElement("snake")
var snakemodal
var snakesocket
app.appendChild(snakewindow)
function loadSnake(){
    snakemodal = ShowModal(unloadSnake)
    snakewindow.classList.add("snakeactive")
    snakewindow.innerHTML = "<h1><i class='m-i'>group</i> Snake</h1><x class='m-i'>close</x><p><i class='m-i'>dns</i> Trying to connect...</p>"
    ButtonEvent(snakewindow.getElementsByTagName('x')[0], unloadSnake)
    loadScript(
        "code/libraries/socket.io.js",
        "socketio",
        function(){
            const SnakeServerIP = 'http://192.168.1.11:3000'
            const BG_COLOUR = '#231f20';
            const SNAKE_COLOUR = '#c2c2c2';
            const FOOD_COLOUR = '#e66916';

            snakesocket = io(SnakeServerIP);

            snakesocket.on('connect', function() {
                snakewindow.getElementsByTagName("p")[0].innerHTML = "<i class='m-i'>dns</i> Connected to game server <b>"+SnakeServerIP+"</b>"
                var PreGameWindow = document.createElement("pregamewindow")
                PreGameWindow.innerHTML = "<input placeholder='Enter game code'><button>Join Game</button><hr><button>Create Game</button>"
                snakewindow.appendChild(PreGameWindow)

                var buttons = PreGameWindow.getElementsByTagName("button")
                var gamecode = PreGameWindow.getElementsByTagName("input")[0]

                var GameWindow = document.createElement("gamewindow")
                GameWindow.innerHTML = "<h1>Your game code is: <span></span></h1>"+
                '<canvas id="canvas"></canvas>'
                snakewindow.appendChild(GameWindow)

                snakesocket.on('init', handleInit);
                snakesocket.on('gameState', handleGameState);
                snakesocket.on('gameOver', handleGameOver);
                snakesocket.on('gameCode', handleGameCode);
                snakesocket.on('unknownCode', handleUnknownCode);
                snakesocket.on('tooManyPlayers', handleTooManyPlayers);
                
                const gameScreen = GameWindow
                const initialScreen = PreGameWindow
                const gameCodeDisplay = GameWindow.getElementsByTagName("span")[0]
                
                ButtonEvent(buttons[1], newGame)
                ButtonEvent(buttons[0], joinGame, gamecode.valueZ)
                
                
                function newGame() {
                  snakesocket.emit('newGame');
                  init();
                }
                
                function joinGame(code) {
                  snakesocket.emit('joinGame', code);
                  init();
                }
                
                let canvas, ctx;
                let playerNumber;
                let gameActive = false;
                
                function init() {
                  initialScreen.style.display = "none";
                  gameScreen.style.display = "block";
                
                  canvas = document.getElementById('canvas');
                  ctx = canvas.getContext('2d');
                
                  canvas.width = canvas.height = 600;
                
                  ctx.fillStyle = BG_COLOUR;
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                  document.addEventListener('keydown', keydown);
                  gameActive = true;
                }
                
                function keydown(e) {
                  snakesocket.emit('keydown', e.keyCode);
                }
                
                function paintGame(state) {
                  ctx.fillStyle = BG_COLOUR;
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                  const food = state.food;
                  const gridsize = state.gridsize;
                  const size = canvas.width / gridsize;
                
                  ctx.fillStyle = FOOD_COLOUR;
                  ctx.fillRect(food.x * size, food.y * size, size, size);
                
                  paintPlayer(state.players[0], size, SNAKE_COLOUR);
                  paintPlayer(state.players[1], size, 'red');
                }
                
                function paintPlayer(playerState, size, colour) {
                  const snake = playerState.snake;
                
                  ctx.fillStyle = colour;
                  for (let cell of snake) {
                    ctx.fillRect(cell.x * size, cell.y * size, size, size);
                  }
                }
                
                function handleInit(number) {
                  playerNumber = number;
                }
                
                function handleGameState(gameState) {
                  if (!gameActive) {
                    return;
                  }
                  gameState = JSON.parse(gameState);
                  requestAnimationFrame(() => paintGame(gameState));
                }
                
                function handleGameOver(data) {
                  if (!gameActive) {
                    return;
                  }
                  data = JSON.parse(data);
                
                  gameActive = false;
                
                  if (data.winner === playerNumber) {
                    alert('You Win!');
                  } else {
                    alert('You Lose :(');
                  }
                }
                
                function handleGameCode(gameCode) {
                  gameCodeDisplay.innerText = gameCode;
                }
                
                function handleUnknownCode() {
                  reset();
                  alert('Unknown Game Code')
                }
                
                function handleTooManyPlayers() {
                  reset();
                  alert('This game is already in progress');
                }
                
                function reset() {
                  playerNumber = null;
                  gamecode.value = '';
                  initialScreen.style.display = "block";
                  gameScreen.style.display = "none";
                }
                













            })
            snakesocket.on('disconnect', function() {
                snakewindow.getElementsByTagName("p")[0].innerHTML = "<i class='m-i'>dns</i> Disconnected"
            })
        }
    )
}

function unloadSnake(){
  snakesocket.disconnect()
  snakemodal()
  snakewindow.classList.remove("snakeactive")
}