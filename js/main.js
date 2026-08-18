// ============================================================
// CODE : 죽림고수
// main.js
// ============================================================

import { Game } from "./game.js";


// ============================================================
// DOM
// ============================================================

const canvas =
    document.getElementById("gameCanvas");

const startScreen =
    document.getElementById("start-screen");

const gameOverScreen =
    document.getElementById("game-over-screen");

const hud =
    document.getElementById("hud");

const bottomGuide =
    document.getElementById("bottom-guide");

const startButton =
    document.getElementById("start-button");

const restartButton =
    document.getElementById("restart-button");

const timeText =
    document.getElementById("time");

const healthText =
    document.getElementById("health");

const bestTimeText =
    document.getElementById("best-time");

const finalTimeText =
    document.getElementById("final-time");

const resultBestTimeText =
    document.getElementById(
        "result-best-time"
    );


// ============================================================
// Canvas 크기
// ============================================================

function resizeCanvas() {

    /*
        실제 화면 크기에 맞춰
        Canvas의 내부 해상도를 설정한다.
    */

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;


    /*
        고해상도 화면 대응

        iPhone / iPad / Retina 등에서
        화면이 흐려지는 것을 방지한다.
    */

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.width =
        Math.floor(width * dpr);

    canvas.height =
        Math.floor(height * dpr);


    canvas.style.width =
        `${width}px`;

    canvas.style.height =
        `${height}px`;


    /*
        Canvas 좌표를
        CSS 픽셀 기준으로 사용한다.
    */

    const ctx =
        canvas.getContext("2d");

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

}


// 처음 실행
resizeCanvas();


// 창 크기가 바뀌면 다시 계산
window.addEventListener(
    "resize",
    resizeCanvas
);


// ============================================================
// 게임 생성
// ============================================================

const game =
    new Game(canvas);


// ============================================================
// UI 상태
// ============================================================

let previousGameOver =
    false;


// ============================================================
// 시작 화면
// ============================================================

function showStartScreen() {

    startScreen.classList.remove(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    hud.classList.add(
        "hidden"
    );

    bottomGuide.classList.remove(
        "hidden"
    );

}


// ============================================================
// 실제 게임 화면
// ============================================================

function showGameScreen() {

    startScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    hud.classList.remove(
        "hidden"
    );

    bottomGuide.classList.add(
        "hidden"
    );

}


// ============================================================
// 게임오버 화면
// ============================================================

function showGameOverScreen() {

    const survivalTime =
        game.getSurvivalTime();

    const bestTime =
        game.getBestTime();


    finalTimeText.textContent =
        formatTime(
            survivalTime
        );


    resultBestTimeText.textContent =
        formatTime(
            bestTime
        );


    gameOverScreen.classList.remove(
        "hidden"
    );

    hud.classList.add(
        "hidden"
    );

    bottomGuide.classList.remove(
        "hidden"
    );

}


// ============================================================
// 시간 표시
// ============================================================

function formatTime(seconds) {

    return seconds
        .toFixed(2)
        .padStart(5, "0");

}


// ============================================================
// HUD 업데이트
// ============================================================

function updateHUD() {

    const survivalTime =
        game.getSurvivalTime();

    const health =
        game.getHealth();

    const bestTime =
        game.getBestTime();


    /*
        생존 시간
    */

    timeText.textContent =
        formatTime(
            survivalTime
        );


    /*
        체력

        이번 게임에서는
        하트가 무조건 하나다.
    */

    if (health > 0) {

        healthText.textContent =
            "♥";

    }

    else {

        healthText.textContent =
            "♡";

    }


    /*
        최고 기록
    */

    bestTimeText.textContent =
        formatTime(
            bestTime
        );

}


// ============================================================
// 게임 시작
// ============================================================

function startGame() {

    game.start();

    showGameScreen();

    previousGameOver = false;

}


// ============================================================
// 시작 버튼
// ============================================================

startButton.addEventListener(
    "click",
    () => {

        startGame();

    }
);


// ============================================================
// 재시작 버튼
// ============================================================

restartButton.addEventListener(
    "click",
    () => {

        startGame();

    }
);


// ============================================================
// R 키
// ============================================================

window.addEventListener(
    "keydown",
    (event) => {

        /*
            입력 중복 방지
        */

        if (
            event.repeat
        ) {

            return;

        }


        if (
            event.key.toLowerCase()
            === "r"
        ) {

            startGame();

        }

    }
);


// ============================================================
// 게임 루프
// ============================================================

function gameLoop() {

    /*
        게임 업데이트
    */

    game.update();


    /*
        화면 그리기
    */

    game.draw();


    /*
        HUD 업데이트
    */

    if (
        !game.isGameOver()
    ) {

        updateHUD();

    }


    /*
        게임오버 감지
    */

    const currentGameOver =
        game.isGameOver();


    if (
        currentGameOver &&
        !previousGameOver
    ) {

        showGameOverScreen();

    }


    previousGameOver =
        currentGameOver;


    /*
        다음 프레임
    */

    requestAnimationFrame(
        gameLoop
    );

}


// ============================================================
// 초기 상태
// ============================================================

showStartScreen();


// ============================================================
// 게임 루프 시작
// ============================================================

gameLoop();
