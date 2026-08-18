// ============================================================
// CODE : 죽림고수
// main.js
// ============================================================

import { Game } from "./game.js";


// ============================================================
// HTML 요소
// ============================================================

const canvas =
    document.getElementById("gameCanvas");

const startButton =
    document.getElementById("start-button");

const restartButton =
    document.getElementById("restart-button");

const startScreen =
    document.getElementById("start-screen");

const gameOverScreen =
    document.getElementById("game-over-screen");

const hud =
    document.getElementById("hud");

const bottomGuide =
    document.getElementById("bottom-guide");


// ============================================================
// 키 입력
// ============================================================

const keys = {};


// ------------------------------------------------------------
// 키를 누름
// ------------------------------------------------------------

window.addEventListener(
    "keydown",
    (event) => {

        // 방향키 때문에 웹페이지가 움직이는 것 방지
        if (
            event.key === "ArrowUp" ||
            event.key === "ArrowDown" ||
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight"
        ) {

            event.preventDefault();

        }


        keys[event.key] = true;

    },
    {
        passive: false
    }
);


// ------------------------------------------------------------
// 키를 뗌
// ------------------------------------------------------------

window.addEventListener(
    "keyup",
    (event) => {

        keys[event.key] = false;

    }
);


// ------------------------------------------------------------
// 브라우저 창을 다시 열었을 때
// 키가 계속 눌린 것으로 남는 것 방지
// ------------------------------------------------------------

window.addEventListener(
    "blur",
    () => {

        for (
            const key in keys
        ) {

            keys[key] = false;

        }

    }
);


// ============================================================
// 게임 생성
// ============================================================

const game =
    new Game(canvas);


// ============================================================
// Game에 키 전달
// ============================================================

game.keys = keys;


// ============================================================
// 시작
// ============================================================

startButton.addEventListener(
    "click",
    () => {

        startScreen.classList.add(
            "hidden"
        );

        hud.classList.remove(
            "hidden"
        );

        bottomGuide.classList.remove(
            "hidden"
        );

        gameOverScreen.classList.add(
            "hidden"
        );


        game.start();

    }
);


// ============================================================
// 재시작
// ============================================================

restartButton.addEventListener(
    "click",
    () => {

        gameOverScreen.classList.add(
            "hidden"
        );

        hud.classList.remove(
            "hidden"
        );

        bottomGuide.classList.remove(
            "hidden"
        );

        game.start();

    }
);


// ============================================================
// R 키 → 재시작
// ============================================================

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key.toLowerCase() === "r"
        ) {

            if (
                game.gameOver
            ) {

                gameOverScreen.classList.add(
                    "hidden"
                );

                hud.classList.remove(
                    "hidden"
                );

                bottomGuide.classList.remove(
                    "hidden"
                );

                game.start();

            }

        }

    }
);
