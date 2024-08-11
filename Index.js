//DOM del canvas
const canvas = document.getElementById('canvas');

//Contexto del canvas
let ctx = canvas.getContext("2d");


//Anchura y altura del canvas
let anchura = 500;
let altura = 500;
canvas.width = anchura;
canvas.height = altura;



/*Para que sea el todo el ancho y alto de la pagina
let anchura = window.innerWidth;
let altura = window.innerHeight;*/


//Variable que cuente el tiempo inicial y funcion para ir contando el tiempo
var timeCero = new Date;
var actualTime = 0;
function calTime(){
    let timeNow = new Date;
    actualTime = Math.floor((timeNow - timeCero) / 1000);
}


//Variables para almacenar donde esta el raton
let cursorX = 0;
let cursorY =0;

//Metodo para detectar la posicion del raton
function cursorPosition (e){
    let cRect = canvas.getBoundingClientRect();
    let canvasX = Math.round(e.clientX - cRect.left);
    let canvasY = Math.round(e.clientY - cRect.top);
    updateBallPos(canvasX,canvasY);
    cursorX = canvasX;
    cursorY = canvasY;
}

//LLamar al metodo para detectar la posicion del raton, siempre que se mueva el raton
canvas.addEventListener("mousemove", cursorPosition)

//Metodo para limpiar la pantalla
function cleanCanvas(){
    //Limpiamos todo 
    ctx.clearRect(0,0,canvas.width, canvas.height);
}


//Metodo para dibujar el main menu
var gameStarted = false;
const menuButtonX = 215;
const menuButtonY = 215;
const menuButtonWidth = 80;
const menuButtonHeight = 60;


function drawMainMenu(){
    //Fondo del main menu
    ctx.fillStyle = ("black");
    ctx.fillRect(0,0,canvas.width,canvas.height);
    //Titulo del juego
    ctx.fillStyle = ("white");
    ctx.font = "40px Roman";
    ctx.fillText("Esquiva la bola", canvas.width /2 - 120, 50);
    //Texto 'empezar partida'
    ctx.font = "16px Arial";
    ctx.fillText("Empezar partida", menuButtonX - 17, menuButtonY- 20);
    //Fondo del boton
    ctx.fillRect(menuButtonX , menuButtonY, menuButtonWidth, menuButtonHeight);
    //Dibujar el triangulo del boton
    ctx.beginPath();
    ctx.fillStyle = 'black'; // Establecer el color de relleno
    ctx.moveTo(233, 225);
    ctx.lineTo(273, 245);
    ctx.lineTo(233, 265);
    ctx.lineWidth = 8; 
    ctx.stroke();
    ctx.closePath();
}

//Evento para que cuando pulses el boton se inicie la partida
function pulsarBotonMainMenu(){
    let cordXandButton = cursorX > menuButtonX && cursorX < menuButtonX + menuButtonWidth
    let cordYandButton = cursorY > menuButtonY && cursorY < menuButtonY + menuButtonHeight
    if(cordXandButton && cordYandButton){
        gameStarted = true;
        //Que al empezar la partida, cuente como el momento 0
        timeCero = new Date;
        timeNow = new Date;
        actualTime = 0;
        //Una vez empezado el juego, que el cursor desaparezca
        canvas.style.cursor = "none"
    }
}
//Llamar al evento
canvas.addEventListener('click', pulsarBotonMainMenu)



//Variables para la bola
var ballRadius = 8;
let ballX = canvas.width / 2
let ballY = canvas.height / 2

function updateBallPos(x, y){
    if(x + ballRadius > canvas.width){
        ballX = canvas.width - ballRadius
    }else if(x - ballRadius < 0){
        ballX = 0 + ballRadius
    }else{
        ballX = x;
    }

    if(y + ballRadius > canvas.height){
        ballY = canvas.height - ballRadius
    }else if(y - ballRadius < 0){
        ballY = 0 + ballRadius
    }else{
        ballY = y;
    }
}

//Metodo para dibujar la bola
function drawBall(){
//Avisar al contexto de que se va a empezar a dibujar la bola    
    ctx.beginPath();
    ctx.arc(ballX,ballY,ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

//Metodo para generar una posicion aleatoria para dejar caer el obstaculo
function cordXRandom(){
    return Math.round(Math.random() * (canvas.width - 20)) + 10;
}

//Variables del obstaculo

    //Para que se genere una cordenada aleatoria, pero falta revisar
    //let CordX = cordXRandom();
let cordX = cordXRandom()
let cordY = 10;
let obstacleRadius = ballRadius;
//Velocidad para los obstaculos a esquivar
let dx = 5;
let dy = 4;

//Metodo para dibujar obstaculos
function drawObstacles(){
    /*Estos condicionales, sirven para cambiar la direccion de las bolas
    conforme chocan con la pared*/
    if(cordX + dx > canvas.width - obstacleRadius|| cordX + dx < obstacleRadius){
        dx=-dx;
    }
    if(cordY + dy > canvas.height - obstacleRadius|| cordY + dy < obstacleRadius){
        dy=-dy;
    }
    cordX += dx;
    cordY += dy;
//Avisar al contexto de que se va a empezar a dibujar la bola    
    ctx.beginPath();
    ctx.arc(cordX,cordY,obstacleRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();    

}

//Metodo para que cada 10 segundos la bola se acelera y cambia de direccion
var HasBeenAcelerated = false;
var HasBeenTurned = false;
function AltereObstacle(){
    
    //Cada 10 segundos se cambia repentinamente la velocidad en X
    if(actualTime%5 == 0 && HasBeenTurned == true){
        dx = -dx    
        HasBeenTurned = false;
    }
    //Recuperar el boolean
    if((actualTime - 1)%5 == 0 ){
        HasBeenTurned = true;
    }
    

    if(actualTime%10 == 0 && HasBeenAcelerated == true){
        //Se verifica si la velocidad es negativa o positiva para no decelerar la bola
        if(dx < 0 ){
            dx--;
        }else{
            dx++;
        }
        //Lo mismo con el eje y
        if(dy < 0 ){
            dy--;
        }else{
            dy++;
        }
        //Tambien se quiere que cada diez segundos se aumente el obstaculo
        if(obstacleRadius < 30){
            obstacleRadius++;
            obstacleRadius++;
            obstacleRadius++;
        }
        

        HasBeenAcelerated = false;
    }
    //Recuperar el boolean
    if((actualTime - 1)%10 == 0){
        HasBeenAcelerated = true;
    }
}

//Variable y metodo para programar las colisiones del obstaculo con la bola

//Constante para hacer mas precisa la colision debido a que va muy rapido
const ballColisionFactor = 2;

function chekColision(){

    const chekColisionX =
    cordX + ballRadius + ballColisionFactor > ballX - ballRadius &&
    cordX - ballRadius - ballColisionFactor < ballX + ballRadius;

    const chekColisionY =
    cordY + ballRadius + ballColisionFactor > ballY - ballRadius &&
    cordY - ballRadius - ballColisionFactor < ballY + ballRadius;

    if(chekColisionX && chekColisionY){
        console.log("Tas muerto");
        document.location.reload();
    }
}


//Metodo de dibujado del HUD
function drawHUD(){
    ctx.font = "16px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText("Segundos : " + actualTime, 10, 20);
}

//Metodo de cada frame
function frames(){
    cleanCanvas();
    if(gameStarted == false){
    drawMainMenu();
    }else{
    drawBall();
    drawObstacles();
    chekColision();
    calTime();
    drawHUD();
    AltereObstacle();
    }
    window.requestAnimationFrame(frames);
}
frames();