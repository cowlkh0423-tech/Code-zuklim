// ============================================================
// CODE : 죽림고수
// arrow.js
//
// 화살 객체
//
// 담당:
// 1. 이동
// 2. 회전
// 3. 잔상
// 4. 화살 그리기
// 5. 충돌 판정
// ============================================================


export class Arrow {


    // ========================================================
    // 생성
    // ========================================================

    constructor(
        x,
        y,
        velocityX,
        velocityY
    ) {

        // ----------------------------------------------------
        // 위치
        // ----------------------------------------------------

        this.x = x;
        this.y = y;


        // ----------------------------------------------------
        // 이전 위치
        // ----------------------------------------------------

        this.previousX = x;
        this.previousY = y;


        // ----------------------------------------------------
        // 속도
        // ----------------------------------------------------

        this.velocityX =
            velocityX;

        this.velocityY =
            velocityY;


        // ----------------------------------------------------
        // 화살 길이
        // ----------------------------------------------------

        this.length = 34;


        // ----------------------------------------------------
        // 화살촉 크기
        // ----------------------------------------------------

        this.headSize = 7;


        // ----------------------------------------------------
        // 충돌 반경
        // ----------------------------------------------------

        this.collisionRadius = 5;


        // ----------------------------------------------------
        // 상태
        // ----------------------------------------------------

        this.dead = false;


        // ----------------------------------------------------
        // 잔상
        // ----------------------------------------------------

        this.trail = [];

        this.maxTrailLength = 6;

    }


    // ========================================================
    // 속력
    // ========================================================

    getSpeed() {

        return Math.sqrt(
            this.velocityX *
            this.velocityX +

            this.velocityY *
            this.velocityY
        );

    }


    // ========================================================
    // 방향
    // ========================================================

    getAngle() {

        return Math.atan2(
            this.velocityY,
            this.velocityX
        );

    }


    // ========================================================
    // 업데이트
    // ========================================================

    update(delta) {

        if (
            this.dead
        ) {

            return;

        }


        // ----------------------------------------------------
        // 이전 위치
        // ----------------------------------------------------

        this.previousX =
            this.x;

        this.previousY =
            this.y;


        // ----------------------------------------------------
        // 잔상 위치 저장
        // ----------------------------------------------------

        this.trail.unshift({

            x: this.x,
            y: this.y

        });


        if (
            this.trail.length >
            this.maxTrailLength
        ) {

            this.trail.pop();

        }


        // ----------------------------------------------------
        // 이동
        // ----------------------------------------------------

        this.x +=
            this.velocityX *
            delta;


        this.y +=
            this.velocityY *
            delta;

    }


    // ========================================================
    // 플레이어 충돌
    // ========================================================

    collidesWith(player) {

        if (
            this.dead
        ) {

            return false;

        }


        /*
            화살의 현재 위치와
            플레이어 중심 사이 거리
        */

        const dx =
            this.x -
            player.x;


        const dy =
            this.y -
            player.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        /*
            플레이어 반지름 +
            화살 충돌 반경
        */

        return (
            distance <=
            player.radius +
            this.collisionRadius
        );

    }


    // ========================================================
    // 그리기
    // ========================================================

    draw(ctx) {

        if (
            this.dead
        ) {

            return;

        }


        const angle =
            this.getAngle();


        // ----------------------------------------------------
        // 잔상
        // ----------------------------------------------------

        this.drawTrail(
            ctx
        );


        // ----------------------------------------------------
        // 화살
        // ----------------------------------------------------

        ctx.save();


        ctx.translate(
            this.x,
            this.y
        );


        ctx.rotate(
            angle
        );


        // ----------------------------------------------------
        // 화살 그림자
        // ----------------------------------------------------

        ctx.shadowColor =
            "rgba(0, 0, 0, 0.5)";

        ctx.shadowBlur = 5;


        // ----------------------------------------------------
        // 화살 자루
        // ----------------------------------------------------

        ctx.strokeStyle =
            "#9b7040";

        ctx.lineWidth = 3;


        ctx.beginPath();

        ctx.moveTo(
            -this.length / 2,
            0
        );

        ctx.lineTo(
            this.length / 2,
            0
        );

        ctx.stroke();


        // ----------------------------------------------------
        // 자루 밝은 부분
        // ----------------------------------------------------

        ctx.shadowBlur = 0;

        ctx.strokeStyle =
            "#c49758";

        ctx.lineWidth = 1;


        ctx.beginPath();

        ctx.moveTo(
            -this.length / 2,
            -1
        );

        ctx.lineTo(
            this.length / 2,
            -1
        );

        ctx.stroke();


        // ----------------------------------------------------
        // 화살촉
        // ----------------------------------------------------

        ctx.fillStyle =
            "#c8c8b7";


        ctx.beginPath();

        ctx.moveTo(
            this.length / 2 +
            this.headSize,
            0
        );


        ctx.lineTo(
            this.length / 2 -
            1,
            -this.headSize / 1.5
        );


        ctx.lineTo(
            this.length / 2 -
            1,
            this.headSize / 1.5
        );


        ctx.closePath();

        ctx.fill();


        // ----------------------------------------------------
        // 화살촉 가운데
        // ----------------------------------------------------

        ctx.strokeStyle =
            "#eeeece";

        ctx.lineWidth = 1;


        ctx.beginPath();

        ctx.moveTo(
            this.length / 2 +
            this.headSize -
            1,
            0
        );

        ctx.lineTo(
            this.length / 2,
            -this.headSize / 2
        );

        ctx.stroke();


        // ----------------------------------------------------
        // 깃털
        // ----------------------------------------------------

        ctx.fillStyle =
            "#5b432b";


        ctx.beginPath();

        ctx.moveTo(
            -this.length / 2,
            0
        );

        ctx.lineTo(
            -this.length / 2 -
            8,
            -5
        );

        ctx.lineTo(
            -this.length / 2 -
            5,
            0
        );

        ctx.lineTo(
            -this.length / 2 -
            8,
            5
        );

        ctx.closePath();

        ctx.fill();


        // ----------------------------------------------------
        // 깃털 선
        // ----------------------------------------------------

        ctx.strokeStyle =
            "#a47b45";

        ctx.lineWidth = 1;


        ctx.beginPath();

        ctx.moveTo(
            -this.length / 2 -
            6,
            0
        );

        ctx.lineTo(
            -this.length / 2,
            0
        );

        ctx.stroke();


        ctx.restore();

    }


    // ========================================================
    // 잔상 그리기
    // ========================================================

    drawTrail(ctx) {

        if (
            this.trail.length === 0
        ) {

            return;

        }


        ctx.save();


        for (
            let i = 0;
            i < this.trail.length;
            i++
        ) {

            const point =
                this.trail[i];


            /*
                뒤쪽으로 갈수록
                투명하게 만든다.
            */

            const alpha =
                (
                    1 -
                    i /
                    this.trail.length
                ) *
                0.18;


            ctx.globalAlpha =
                alpha;


            ctx.strokeStyle =
                "#d8bc70";


            ctx.lineWidth =
                2;


            ctx.beginPath();

            ctx.moveTo(
                point.x,
                point.y
            );


            /*
                화살 진행 방향 반대로
                짧은 선을 그린다.
            */

            const speed =
                this.getSpeed();


            const normalizedX =
                this.velocityX /
                speed;


            const normalizedY =
                this.velocityY /
                speed;


            ctx.lineTo(
                point.x -
                normalizedX *
                22,

                point.y -
                normalizedY *
                22
            );


            ctx.stroke();

        }


        ctx.restore();

    }

}
