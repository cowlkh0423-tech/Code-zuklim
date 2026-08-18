// ============================================================
// CODE : 죽림고수
// game.js
//
// 게임 전체를 관리하는 핵심 클래스
//
// 담당:
// 1. 게임 상태
// 2. 플레이어
// 3. 화살
// 4. 시간
// 5. 난이도
// 6. 충돌
// 7. 대나무 숲 배경
// 8. 황금색 CODE
// ============================================================


import { Player } from "./player.js";
import { Arrow } from "./arrow.js";


// ============================================================
// Game
// ============================================================

export class Game {

    constructor(canvas) {

        // ----------------------------------------------------
        // Canvas
        // ----------------------------------------------------

        this.canvas = canvas;

        this.ctx =
            canvas.getContext("2d");


        // ----------------------------------------------------
        // 화면 크기
        // ----------------------------------------------------

        this.width =
            window.innerWidth;

        this.height =
            window.innerHeight;


        // ----------------------------------------------------
        // 게임 상태
        // ----------------------------------------------------

        this.running = false;

        this.gameOver = false;


        // ----------------------------------------------------
        // 플레이어
        // ----------------------------------------------------

        this.player =
            new Player(
                this.width / 2,
                this.height / 2
            );


        // ----------------------------------------------------
        // 화살 배열
        // ----------------------------------------------------

        this.arrows = [];


        // ----------------------------------------------------
        // 시간
        // ----------------------------------------------------

        this.startTime = 0;

        this.survivalTime = 0;

        this.lastTime =
            performance.now();


        // ----------------------------------------------------
        // 화살 생성 타이머
        // ----------------------------------------------------

        this.arrowTimer = 0;


        // ----------------------------------------------------
        // 특수 패턴 타이머
        // ----------------------------------------------------

        this.patternTimer = 0;


        // ----------------------------------------------------
        // 패턴 상태
        // ----------------------------------------------------

        this.patternActive = false;

        this.patternWarningTime = 0;


        // ----------------------------------------------------
        // 최고 기록
        // ----------------------------------------------------

        this.bestTime =
            Number(
                localStorage.getItem(
                    "code-juklim-best"
                )
            ) || 0;


        // ----------------------------------------------------
        // 키 입력
        // ----------------------------------------------------

        this.keys = {};


        window.addEventListener(
            "keydown",
            (event) => {

                this.keys[
                    event.key
                ] = true;

            }
        );


        window.addEventListener(
            "keyup",
            (event) => {

                this.keys[
                    event.key
                ] = false;

            }
        );


        // ----------------------------------------------------
        // 창 크기 변경
        // ----------------------------------------------------

        window.addEventListener(
            "resize",
            () => {

                this.resize();

            }
        );

    }


    // ========================================================
    // 화면 크기 변경
    // ========================================================

    resize() {

        this.width =
            window.innerWidth;

        this.height =
            window.innerHeight;


        /*
            플레이어가 화면 밖으로
            나가지 않도록 위치 보정
        */

        if (
            this.player
        ) {

            this.player.x =
                Math.min(
                    this.player.x,
                    this.width -
                    this.player.radius
                );


            this.player.y =
                Math.min(
                    this.player.y,
                    this.height -
                    this.player.radius
                );

        }

    }


    // ========================================================
    // 게임 시작
    // ========================================================

    start() {

        // ----------------------------------------------------
        // 상태 초기화
        // ----------------------------------------------------

        this.running = true;

        this.gameOver = false;


        // ----------------------------------------------------
        // 화살 제거
        // ----------------------------------------------------

        this.arrows = [];


        // ----------------------------------------------------
        // 플레이어 초기화
        // ----------------------------------------------------

        this.player.reset(
            this.width / 2,
            this.height / 2
        );


        // ----------------------------------------------------
        // 시간 초기화
        // ----------------------------------------------------

        this.startTime =
            performance.now();

        this.lastTime =
            performance.now();


        this.survivalTime = 0;


        // ----------------------------------------------------
        // 타이머 초기화
        // ----------------------------------------------------

        this.arrowTimer = 0;

        this.patternTimer = 0;

        this.patternActive = false;

        this.patternWarningTime = 0;

    }


    // ========================================================
    // 게임 업데이트
    // ========================================================

    update() {

        // ----------------------------------------------------
        // 게임이 실행되지 않았으면
        // 아무것도 하지 않는다.
        // ----------------------------------------------------

        if (
            !this.running ||
            this.gameOver
        ) {

            return;

        }


        // ----------------------------------------------------
        // 시간 계산
        // ----------------------------------------------------

        const now =
            performance.now();


        let delta =
            (
                now -
                this.lastTime
            ) / 1000;


        this.lastTime =
            now;


        /*
            탭을 잠깐 바꿨다가 돌아오는 등의
            큰 시간 차이를 방지
        */

        delta =
            Math.min(
                delta,
                0.05
            );


        // ----------------------------------------------------
        // 생존 시간
        // ----------------------------------------------------

        this.survivalTime =
            (
                now -
                this.startTime
            ) / 1000;


        // ----------------------------------------------------
        // 플레이어
        // ----------------------------------------------------

        this.player.update(
            delta,
            this.keys,
            this.width,
            this.height
        );


        // ----------------------------------------------------
        // 화살 생성
        // ----------------------------------------------------

        this.updateArrowSpawner(
            delta
        );


        // ----------------------------------------------------
        // 화살 이동
        // ----------------------------------------------------

        for (
            const arrow
            of this.arrows
        ) {

            arrow.update(
                delta
            );

        }


        // ----------------------------------------------------
        // 충돌
        // ----------------------------------------------------

        this.checkCollisions();


        // ----------------------------------------------------
        // 필요없는 화살 삭제
        // ----------------------------------------------------

        this.removeDeadArrows();


        // ----------------------------------------------------
        // 사망
        // ----------------------------------------------------

        if (
            this.player.health <= 0
        ) {

            this.endGame();

        }

    }


    // ========================================================
    // 화살 생성 시스템
    // ========================================================

    updateArrowSpawner(delta) {

        this.arrowTimer +=
            delta;


        /*
            난이도 계산

            0초  = 1
            5초  = 2
            10초 = 3
            15초 = 4
        */

        const difficulty =
            this.getDifficulty();


        /*
            초반에는 느리게,
            시간이 지나면 빠르게
        */

        const spawnInterval =
            Math.max(
                0.16,
                0.48 -
                this.survivalTime *
                0.020
            );


        if (
            this.arrowTimer >=
            spawnInterval
        ) {

            this.arrowTimer = 0;


            /*
                기본 화살 생성
            */

            this.spawnBasicArrows(
                difficulty
            );

        }


        /*
            특수 패턴 타이머
        */

        this.patternTimer +=
            delta;


        /*
            패턴 간격
        */

        const patternInterval =
            Math.max(
                1.4,
                3.4 -
                this.survivalTime *
                0.10
            );


        if (
            this.patternTimer >=
            patternInterval
        ) {

            this.patternTimer = 0;


            this.spawnSpecialPattern();

        }

    }


    // ========================================================
    // 난이도
    // ========================================================

    getDifficulty() {

        /*
            시간이 지날수록 증가

            0초  → 1
            5초  → 2
            10초 → 3
            15초 → 4
        */

        return Math.min(
            5,
            1 +
            Math.floor(
                this.survivalTime / 5
            )
        );

    }


    // ========================================================
    // 기본 화살
    // ========================================================

    spawnBasicArrows(
        difficulty
    ) {

        /*
            기본 화살 수
        */

        let count = 1;


        if (
            difficulty >= 2
        ) {

            count = 2;

        }


        if (
            difficulty >= 3
        ) {

            count = 2;


            /*
                50% 확률로
                세 번째 화살
            */

            if (
                Math.random() <
                0.5
            ) {

                count = 3;

            }

        }


        if (
            difficulty >= 4
        ) {

            count = 3;

        }


        if (
            difficulty >= 5
        ) {

            count = 4;

        }


        /*
            실제 생성
        */

        for (
            let i = 0;
            i < count;
            i++
        ) {

            this.createAimedArrow();

        }

    }


    // ========================================================
    // 조준 화살
    // ========================================================

    createAimedArrow() {

        const position =
            this.getSpawnPosition();


        const target =
            this.getPredictedTarget();


        const dx =
            target.x -
            position.x;


        const dy =
            target.y -
            position.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance <= 0
        ) {

            return;

        }


        /*
            화살 속도

            시간이 지날수록 증가
        */

        const speed =
            230 +
            Math.min(
                180,
                this.survivalTime *
                12
            );


        const vx =
            dx /
            distance *
            speed;


        const vy =
            dy /
            distance *
            speed;


        this.arrows.push(

            new Arrow(
                position.x,
                position.y,
                vx,
                vy
            )

        );

    }


    // ========================================================
    // 화살 생성 위치
    // ========================================================

    getSpawnPosition() {

        const margin = 70;


        const side =
            Math.floor(
                Math.random() * 4
            );


        // ----------------------------------------------------
        // 위
        // ----------------------------------------------------

        if (
            side === 0
        ) {

            return {

                x:
                    Math.random() *
                    this.width,

                y:
                    -margin

            };

        }


        // ----------------------------------------------------
        // 오른쪽
        // ----------------------------------------------------

        if (
            side === 1
        ) {

            return {

                x:
                    this.width +
                    margin,

                y:
                    Math.random() *
                    this.height

            };

        }


        // ----------------------------------------------------
        // 아래
        // ----------------------------------------------------

        if (
            side === 2
        ) {

            return {

                x:
                    Math.random() *
                    this.width,

                y:
                    this.height +
                    margin

            };

        }


        // ----------------------------------------------------
        // 왼쪽
        // ----------------------------------------------------

        return {

            x:
                -margin,

            y:
                Math.random() *
                this.height

        };

    }


    // ========================================================
    // 플레이어 예측 위치
    // ========================================================

    getPredictedTarget() {

        let x =
            this.player.x;

        let y =
            this.player.y;


        /*
            플레이어가 움직이고 있는
            방향을 조금 예측한다.

            너무 정확하게 예측하면
            불공평해지기 때문에
            시간이 지나도 제한한다.
        */

        const prediction =
            Math.min(
                0.35,
                0.12 +
                this.survivalTime *
                0.015
            );


        if (
            this.keys["w"] ||
            this.keys["W"]
        ) {

            y -=
                this.player.speed *
                prediction;

        }


        if (
            this.keys["s"] ||
            this.keys["S"]
        ) {

            y +=
                this.player.speed *
                prediction;

        }


        if (
            this.keys["a"] ||
            this.keys["A"]
        ) {

            x -=
                this.player.speed *
                prediction;

        }


        if (
            this.keys["d"] ||
            this.keys["D"]
        ) {

            x +=
                this.player.speed *
                prediction;

        }


        /*
            약간의 조준 오차
        */

        const error =
            Math.max(
                15,
                60 -
                this.survivalTime *
                3
            );


        x +=
            (
                Math.random() -
                0.5
            ) *
            error;


        y +=
            (
                Math.random() -
                0.5
            ) *
            error;


        return {
            x,
            y
        };

    }


    // ========================================================
    // 특수 패턴
    // ========================================================

    spawnSpecialPattern() {

        /*
            아직 초반에는
            특수 패턴을 거의 사용하지 않는다.
        */

        if (
            this.survivalTime <
            3
        ) {

            return;

        }


        /*
            난이도가 올라갈수록
            패턴 확률 증가
        */

        const difficulty =
            this.getDifficulty();


        let chance =
            0.30;


        if (
            difficulty >= 3
        ) {

            chance = 0.50;

        }


        if (
            difficulty >= 4
        ) {

            chance = 0.70;

        }


        if (
            Math.random() >
            chance
        ) {

            return;

        }


        /*
            현재는 임시 패턴

            patterns.js를 만들면
            여기에서 다양한 패턴으로
            교체한다.
        */

        const pattern =
            Math.floor(
                Math.random() * 4
            );


        switch (pattern) {

            case 0:

                this.patternFan();

                break;


            case 1:

                this.patternDouble();

                break;


            case 2:

                this.patternCross();

                break;


            case 3:

                this.patternBurst();

                break;

        }

    }


    // ========================================================
    // 부채꼴
    // ========================================================

    patternFan() {

        const position =
            this.getSpawnPosition();


        const baseAngle =
            Math.atan2(
                this.player.y -
                position.y,

                this.player.x -
                position.x
            );


        let count = 5;


        if (
            this.survivalTime >=
            10
        ) {

            count = 7;

        }


        const spread =
            Math.PI / 3;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                baseAngle -
                spread / 2 +
                spread *
                (
                    i /
                    (count - 1)
                );


            this.createDirectionalArrow(
                position.x,
                position.y,
                angle
            );

        }

    }


    // ========================================================
    // 양쪽 공격
    // ========================================================

    patternDouble() {

        const speed =
            260 +
            Math.min(
                140,
                this.survivalTime *
                10
            );


        /*
            왼쪽
        */

        let y =
            this.player.y +
            (
                Math.random() -
                0.5
            ) *
            100;


        let angle =
            Math.atan2(
                this.player.y -
                y,

                this.player.x +
                60
            );


        this.createDirectionalArrow(
            -60,
            y,
            angle,
            speed
        );


        /*
            오른쪽
        */

        y =
            this.player.y +
            (
                Math.random() -
                0.5
            ) *
            100;


        angle =
            Math.atan2(
                this.player.y -
                y,

                this.player.x -
                this.width -
                60
            );


        this.createDirectionalArrow(
            this.width + 60,
            y,
            angle,
            speed
        );

    }


    // ========================================================
    // 십자
    // ========================================================

    patternCross() {

        const positions = [

            {
                x:
                    this.width / 2,

                y:
                    -70
            },

            {
                x:
                    this.width + 70,

                y:
                    this.height / 2
            },

            {
                x:
                    this.width / 2,

                y:
                    this.height + 70
            },

            {
                x:
                    -70,

                y:
                    this.height / 2
            }

        ];


        for (
            const position
            of positions
        ) {

            const angle =
                Math.atan2(
                    this.player.y -
                    position.y,

                    this.player.x -
                    position.x
                );


            this.createDirectionalArrow(
                position.x,
                position.y,
                angle,
                280
            );

        }

    }


    // ========================================================
    // 집중 포화
    // ========================================================

    patternBurst() {

        let count = 6;


        if (
            this.survivalTime >=
            10
        ) {

            count = 9;

        }


        for (
            let i = 0;
            i < count;
            i++
        ) {

            this.createAimedArrow();

        }

    }


    // ========================================================
    // 특정 방향으로 화살 생성
    // ========================================================

    createDirectionalArrow(
        x,
        y,
        angle,
        speed = null
    ) {

        const finalSpeed =
            speed ??
            (
                240 +
                Math.min(
                    170,
                    this.survivalTime *
                    12
                )
            );


        const vx =
            Math.cos(angle) *
            finalSpeed;


        const vy =
            Math.sin(angle) *
            finalSpeed;


        this.arrows.push(

            new Arrow(
                x,
                y,
                vx,
                vy
            )

        );

    }


    // ========================================================
    // 충돌
    // ========================================================

    checkCollisions() {

        for (
            const arrow
            of this.arrows
        ) {

            if (
                arrow.dead
            ) {

                continue;

            }


            if (
                arrow.collidesWith(
                    this.player
                )
            ) {

                /*
                    체력은 1개뿐이다.
                    한 번 맞으면 바로 죽는다.
                */

                this.player.takeDamage();

                arrow.dead = true;

                return;

            }

        }

    }


    // ========================================================
    // 죽은 화살 삭제
    // ========================================================

    removeDeadArrows() {

        this.arrows =
            this.arrows.filter(
                arrow => {

                    if (
                        arrow.dead
                    ) {

                        return false;

                    }


                    if (
                        arrow.x <
                        -200 ||

                        arrow.x >
                        this.width +
                        200 ||

                        arrow.y <
                        -200 ||

                        arrow.y >
                        this.height +
                        200
                    ) {

                        return false;

                    }


                    return true;

                }
            );

    }


    // ========================================================
    // 게임 종료
    // ========================================================

    endGame() {

        if (
            this.gameOver
        ) {

            return;

        }


        this.running = false;

        this.gameOver = true;


        /*
            최고 기록
        */

        if (
            this.survivalTime >
            this.bestTime
        ) {

            this.bestTime =
                this.survivalTime;


            localStorage.setItem(
                "code-juklim-best",
                this.bestTime
            );

        }

    }


    // ========================================================
    // 생존 시간
    // ========================================================

    getSurvivalTime() {

        return this.survivalTime;

    }


    // ========================================================
    // 체력
    // ========================================================

    getHealth() {

        return this.player.health;

    }


    // ========================================================
    // 게임오버
    // ========================================================

    isGameOver() {

        return this.gameOver;

    }


    // ========================================================
    // 최고 기록
    // ========================================================

    getBestTime() {

        return this.bestTime;

    }


    // ========================================================
    // DRAW
    // ========================================================

    draw() {

        const ctx =
            this.ctx;


        /*
            배경
        */

        this.drawBackground();


        /*
            황금색 CODE
        */

        this.drawCodeText();


        /*
            화살
        */

        for (
            const arrow
            of this.arrows
        ) {

            arrow.draw(ctx);

        }


        /*
            플레이어
        */

        this.player.draw(ctx);

    }


    // ========================================================
    // 대나무 숲
    // ========================================================

    drawBackground() {

        const ctx =
            this.ctx;


        // ----------------------------------------------------
        // 기본 배경
        // ----------------------------------------------------

        ctx.fillStyle =
            "#102315";

        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );


        // ----------------------------------------------------
        // 뒤쪽 대나무
        // ----------------------------------------------------

        this.drawBambooLayer(
            0.35,
            70,
            8
        );


        // ----------------------------------------------------
        // 중간 대나무
        // ----------------------------------------------------

        this.drawBambooLayer(
            0.55,
            50,
            12
        );


        // ----------------------------------------------------
        // 앞쪽 대나무
        // ----------------------------------------------------

        this.drawBambooLayer(
            0.8,
            35,
            15
        );


        // ----------------------------------------------------
        // 안개
        // ----------------------------------------------------

        const gradient =
            ctx.createRadialGradient(
                this.width / 2,
                this.height / 2,
                50,

                this.width / 2,
                this.height / 2,
                Math.max(
                    this.width,
                    this.height
                )
            );


        gradient.addColorStop(
            0,
            "rgba(160,180,100,0.08)"
        );


        gradient.addColorStop(
            1,
            "rgba(0,0,0,0.38)"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );

    }


    // ========================================================
    // 대나무 레이어
    // ========================================================

    drawBambooLayer(
        opacity,
        spacing,
        width
    ) {

        const ctx =
            this.ctx;


        ctx.save();


        ctx.globalAlpha =
            opacity;


        for (
            let x = -50;
            x < this.width + 100;
            x += spacing
        ) {

            /*
                자연스럽게 휘어지는 느낌
            */

            const sway =
                Math.sin(
                    x * 0.03
                ) * 8;


            // 줄기

            ctx.strokeStyle =
                "#315d32";

            ctx.lineWidth =
                width;


            ctx.beginPath();

            ctx.moveTo(
                x,
                0
            );


            ctx.quadraticCurveTo(
                x + sway,
                this.height * 0.5,

                x - sway,
                this.height
            );


            ctx.stroke();


            /*
                대나무 마디
            */

            ctx.strokeStyle =
                "#203f25";

            ctx.lineWidth = 3;


            for (
                let y = 50;
                y < this.height;
                y += 65
            ) {

                ctx.beginPath();

                ctx.moveTo(
                    x - width / 2,
                    y
                );

                ctx.lineTo(
                    x + width / 2,
                    y
                );

                ctx.stroke();

            }

        }


        ctx.restore();

    }


    // ========================================================
    // CODE 글씨
    // ========================================================

    drawCodeText() {

        const ctx =
            this.ctx;


        ctx.save();


        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        /*
            화면 뒤에 아주 크게
            CODE 표시
        */

        const fontSize =
            Math.min(
                this.width * 0.28,
                280
            );


        ctx.font =
            `900 ${fontSize}px Georgia`;


        /*
            그림자
        */

        ctx.fillStyle =
            "rgba(0,0,0,0.28)";


        ctx.fillText(
            "CODE",
            this.width / 2 + 5,
            this.height / 2 + 8
        );


        /*
            황금색
        */

        const gradient =
            ctx.createLinearGradient(
                0,
                this.height * 0.25,
                0,
                this.height * 0.75
            );


        gradient.addColorStop(
            0,
            "#f3d77a"
        );


        gradient.addColorStop(
            0.5,
            "#c89d32"
        );


        gradient.addColorStop(
            1,
            "#76581d"
        );


        ctx.fillStyle =
            gradient;


        /*
            너무 밝지 않게
        */

        ctx.globalAlpha =
            0.20;


        ctx.fillText(
            "CODE",
            this.width / 2,
            this.height / 2
        );


        ctx.restore();

    }

}
