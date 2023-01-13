const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const playerPosition = { x: undefined, y: undefined};
const giftPosition = { x: undefined, y: undefined};
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
let enemiesPositions = [];
let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let timeStart;
let timePLayer;
let timeInterval;


window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
window.addEventListener('keydown', movByKeys);

function fixNumber(n) {
    return Number(n.toFixed(2));
}

btnUp.addEventListener('click', movUp);
btnLeft.addEventListener('click', movLeft);
btnRight.addEventListener('click', movRight);
btnDown.addEventListener('click', movDown);


function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
      } else {
        canvasSize = window.innerHeight * 0.7;
    }
    canvasSize = Number(canvasSize.toFixed(0));
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    starGame();
}

function starGame () {
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];
    if(!map){
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 1000);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    console.log({map, mapRows, mapRowCols});

    showLives();

    enemiesPositions = [];
    game.clearRect(0,0, canvasSize, canvasSize);


    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log({playerPosition});
                }
            } else if(col == 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X'){
                enemiesPositions.push({
                    x: posX,
                    y: posY
                });
            }

            game.fillText(emoji, posX, posY);
        });
    });
    movPlayer();
}

function movPlayer() {
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;
    if (giftCollision) {
        levelWin();
    }

    const enemyCollision = enemiesPositions.find(enemy => {
       const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
       const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
       return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
        levelFail();
    }
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    console.log('Subiste de nivel');
    level++;
    starGame();
}

function gameWin() {
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;
    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'Superaste el record';
        } else {
            pResult.innerHTML ='No superaste el record';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML ='Primera vez? Muy bien';

    }

    console.log({recordTime, playerTime});
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']);
    console.log(heartsArray);
    spanLives.innerHTML = "";
    heartsArray.forEach(heart => spanLives.append(heart));
    // spanLives.innerHTML = heartsArray;
}
function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

function levelFail() {
    console.log('Chocaste contra un enemigo');
    lives--;
    console.log(lives);
    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    starGame();
}

function movByKeys(event) {
    if (event.key == 'ArrowUp') movUp();
    else if (event.key == 'ArrowLeft') movLeft();
    else if (event.key == 'ArrowRight') movRight();
    else if (event.key == 'ArrowDown') movDown();
}

function movUp() {
    console.log('Me quiero mover hacia arriba');
    if ((playerPosition.y - elementsSize).toFixed < elementsSize) {
        console.log('Out');
    } else {
        playerPosition.y -= elementsSize;
        starGame();
    }
}

function movLeft() {
    console.log('Me quiero mover hacia la izquierda');
    if ((playerPosition.x - elementsSize) < elementsSize) {
        console.log('Out')
    } else{
        playerPosition.x -= elementsSize;
        starGame();
    }
}

function movRight() {
    console.log('Me quiero mover hacia la derecha');
    if ((playerPosition.x + elementsSize) > canvasSize) {
        console.log('Out')
    } else{
        playerPosition.x += elementsSize;
        starGame();
    }
}

function movDown() {
    console.log('Me quiero mover hacia abajo');
    if ((playerPosition.y + elementsSize) > canvasSize) {
        console.log('Out')
    } else{
        playerPosition.y += elementsSize;
        starGame();
    };
}