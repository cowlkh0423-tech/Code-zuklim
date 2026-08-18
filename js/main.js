// ============================================================
// CODE : 죽림고수
// main.js - 렌더링 테스트 + 기본 이동
// ============================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// ============================================================
// 화면 크기
// ============================================================

function resize() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resize();

window.addEventListener("resize", resize);


// ============================================================
// 키보드
// ============================================================

const keys = {};

window.addEventListener("keydown", (event) => {

    if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
    ) {
        event.preventDefault();
    }

    keys[event.key] = true;

}, { passive: false });


window.addEventListener("keyup", (event) => {

    keys[event.key] = false;

});


// ============================================================
// 플레이어
// ============================================================

const player = {

    x: canvas.width / 2,
    y: canvas.height / 2,

    radius: 14,

    speed: 260

};


// ============================================================
// 시간
// ============================================================

let lastTime = performance.now();


// ============================================================
// 플레이어 이동
// ============================================================

function update(delta) {

    let dx = 0;
    let dy = 0;


    if (keys["ArrowUp"]) {
        dy -= 1;
    }

    if (keys["ArrowDown"]) {
        dy += 1;
    }

    if (keys["ArrowLeft"]) {
        dx -= 1;
    }

    if (keys["ArrowRight"]) {
        dx += 1;
    }


    // 대각선 속도 보정

    const length =
        Math.sqrt(dx * dx + dy * dy);


    if (length > 0) {

        dx /= length;
        dy /= length;

    }


    player.x +=
        dx *
        player.speed *
        delta;


    player.y +=
        dy *
        player.speed *
        delta;


    // 화면 밖으로 나가지 않게

    player.x = Math.max(
        player.radius,
        Math.min(
            canvas.width - player.radius,
            player.x
        )
    );


    player.y = Math.max(
        player.radius,
        Math.min(
            canvas.height - player.radius,
            player.y
        )
    );

}


// ============================================================
// 대나무 배경
// ============================================================

function drawBamboo() {

    const width = canvas.width;
    const height = canvas.height;


    // 기본 배경

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            height
        );

    gradient.addColorStop(
        0,
        "#061109"
    );

    gradient.addColorStop(
        0.5,
        "#0b1b0e"
    );

    gradient.addColorStop(
        1,
        "#030805"
    );


    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // 중앙의 은은한 빛

    const glow =
        ctx.createRadialGradient(
            width / 2,
            height / 2,
            50,
            width / 2,
            height / 2,
            Math.max(width, height) * 0.7
        );

    glow.addColorStop(
        0,
        "rgba(80,110,45,0.12)"
    );

    glow.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle = glow;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // 뒤쪽 대나무

    for (
        let x = -30;
        x < width + 30;
        x += 65
    ) {

        drawBambooStem(
            x,
            height,
            0.45,
            0.7
        );

    }


    // 앞쪽 대나무

    for (
        let x = -20;
        x < width + 40;
        x += 95
    ) {

        drawBambooStem(
            x,
            height,
            0.8,
            1
        );

    }


    // 황금색 CODE

    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font =
        "bold " +
        Math.min(
            130,
            width * 0.13
        ) +
        "px serif";

    ctx.fillStyle =
        "rgba(216, 184, 90, 0.055)";

    ctx.shadowColor =
        "rgba(216, 184, 90, 0.15)";

    ctx.shadowBlur = 20;

    ctx.fillText(
        "CODE",
        width / 2,
        height / 2
    );

    ctx.restore();

}


// ============================================================
// 대나무 하나
// ============================================================

function drawBambooStem(
    x,
    height,
    alpha,
    scale
) {

    ctx.save();

    ctx.globalAlpha = alpha;


    const stemWidth =
        18 * scale;


    ctx.fillStyle =
        "#16351d";


    ctx.fillRect(
        x,
        0,
        stemWidth,
        height
    );


    // 밝은 면

    ctx.fillStyle =
        "#28532c";


    ctx.fillRect(
        x + 3 * scale,
        0,
        3 * scale,
        height
    );


    // 마디

    ctx.fillStyle =
        "#0b2111";


    for (
        let y = 40;
        y < height;
        y += 75
    ) {

        ctx.fillRect(
            x - 2,
            y,
            stemWidth + 4,
            7 * scale
        );

    }


    ctx.restore();

}


// ============================================================
// 플레이어
// ============================================================

function drawPlayer() {

    const x = player.x;
    const y = player.y;


    ctx.save();


    // 그림자

    ctx.globalAlpha = 0.35;

    ctx.fillStyle = "#000";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 17,
        21,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.globalAlpha = 1;


    // 외곽광

    ctx.shadowColor =
        "rgba(225,190,80,0.5)";

    ctx.shadowBlur = 15;


    // 몸

    ctx.fillStyle =
        "#496d43";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 7,
        14,
        17,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // 얼굴

    ctx.shadowBlur = 0;

    ctx.fillStyle =
        "#d9ae76";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 7,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // 삿갓

    ctx.fillStyle =
        "#72582f";

    ctx.beginPath();

    ctx.moveTo(
        x,
        y - 29
    );

    ctx.lineTo(
        x - 23,
        y - 7
    );

    ctx.lineTo(
        x + 23,
        y - 7
    );

    ctx.closePath();

    ctx.fill();


    ctx.strokeStyle =
        "#302412";

    ctx.lineWidth = 2;

    ctx.stroke();


    // 눈

    ctx.fillStyle =
        "#17130c";

    ctx.fillRect(
        x - 4,
        y - 7,
        2,
        2
    );

    ctx.fillRect(
        x + 2,
        y - 7,
        2,
        2
    );


    ctx.restore();

}


// ============================================================
// 렌더링
// ============================================================

function render() {

    const now =
        performance.now();


    let delta =
        (now - lastTime) / 1000;


    lastTime = now;


    // 너무 큰 delta 방지

    delta =
        Math.min(
            delta,
            0.05
        );


    update(delta);


    // 배경

    drawBamboo();


    // 플레이어

    drawPlayer();


    // 다음 프레임

    requestAnimationFrame(render);

}


// ============================================================
// 시작
// ============================================================

render();

console.log(
    "CODE : 렌더링 정상 실행"
);
