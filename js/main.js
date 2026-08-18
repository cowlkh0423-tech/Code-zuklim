const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();

window.addEventListener("resize", resize);

function render() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // 테스트 배경
    ctx.fillStyle = "#102015";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // 테스트 글자
    ctx.fillStyle = "#d8b85a";

    ctx.font = "bold 70px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "CODE",
        canvas.width / 2,
        canvas.height / 2
    );

    requestAnimationFrame(render);
}

render();
