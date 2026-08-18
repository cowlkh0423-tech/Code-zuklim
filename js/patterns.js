// ============================================================
// CODE : 죽림고수
// patterns.js
//
// 화살 패턴 전용 파일
//
// 패턴을 Game 클래스와 분리해서
// 나중에 새로운 패턴을 추가하기 쉽게 만든다.
//
// 난이도 목표:
// 0~3초   : 기본 공격
// 3~5초   : 단순 패턴
// 5~7초   : 복합 패턴
// 7~10초  : 고난도 패턴
// 10초+   : 극한 패턴
// ============================================================


// ============================================================
// 패턴 관리자
// ============================================================

export class PatternManager {

    constructor(game) {

        this.game = game;

    }


    // ========================================================
    // 패턴 실행
    // ========================================================

    execute() {

        const time =
            this.game.survivalTime;


        /*
            초반에는 너무 많은 화살을
            생성하지 않는다.
        */

        if (time < 3) {

            return;

        }


        /*
            현재 난이도
        */

        const difficulty =
            this.getDifficulty();


        /*
            패턴 선택
        */

        const patterns =
            this.getAvailablePatterns(
                difficulty
            );


        if (
            patterns.length === 0
        ) {

            return;

        }


        /*
            랜덤 선택
        */

        const index =
            Math.floor(
                Math.random() *
                patterns.length
            );


        patterns[index]();

    }


    // ========================================================
    // 난이도
    // ========================================================

    getDifficulty() {

        const time =
            this.game.survivalTime;


        if (time < 3) {

            return 1;

        }


        if (time < 5) {

            return 2;

        }


        if (time < 7) {

            return 3;

        }


        if (time < 10) {

            return 4;

        }


        return 5;

    }


    // ========================================================
    // 사용 가능한 패턴
    // ========================================================

    getAvailablePatterns(
        difficulty
    ) {

        const patterns = [

            () =>
                this.aimed(),

            () =>
                this.fan(),

        ];


        if (
            difficulty >= 2
        ) {

            patterns.push(

                () =>
                    this.doubleSide(),

                () =>
                    this.cross(),

                () =>
                    this.arrowRain()

            );

        }


        if (
            difficulty >= 3
        ) {

            patterns.push(

                () =>
                    this.circle(),

                () =>
                    this.wall(),

                () =>
                    this.gap(),

                () =>
                    this.burst()

            );

        }


        if (
            difficulty >= 4
        ) {

            patterns.push(

                () =>
                    this.spiral(),

                () =>
                    this.tracking(),

                () =>
                    this.reverseGap(),

                () =>
                    this.crossFan()

            );

        }


        if (
            difficulty >= 5
        ) {

            patterns.push(

                () =>
                    this.surround(),

                () =>
                    this.deathBox(),

                () =>
                    this.combination(),

                () =>
                    this.finalStorm()

            );

        }


        return patterns;

    }


    // ========================================================
    // 01. 기본 조준
    // ========================================================

    aimed() {

        const count =
            3 +
            Math.floor(
                this.game.survivalTime /
                5
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            setTimeout(
                () => {

                    if (
                        !this.game.running
                    ) {

                        return;

                    }


                    this.game.createAimedArrow();

                },

                i * 90

            );

        }

    }


    // ========================================================
    // 02. 부채꼴
    // ========================================================

    fan() {

        const position =
            this.game.getSpawnPosition();


        const target =
            this.game.player;


        const baseAngle =
            Math.atan2(

                target.y -
                position.y,

                target.x -
                position.x

            );


        const count =
            this.game.survivalTime >= 8
                ? 9
                : 7;


        const spread =
            Math.PI * 0.55;


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


            this.game.createDirectionalArrow(

                position.x,

                position.y,

                angle

            );

        }

    }


    // ========================================================
    // 03. 양쪽 압박
    // ========================================================

    doubleSide() {

        const y1 =
            Math.random() *
            this.game.height;


        const y2 =
            Math.random() *
            this.game.height;


        const target =
            this.game.player;


        let angle =
            Math.atan2(

                target.y -
                y1,

                target.x +
                70

            );


        this.game.createDirectionalArrow(

            -70,

            y1,

            angle,

            300

        );


        angle =
            Math.atan2(

                target.y -
                y2,

                target.x -
                this.game.width -
                70

            );


        this.game.createDirectionalArrow(

            this.game.width + 70,

            y2,

            angle,

            300

        );

    }


    // ========================================================
    // 04. 십자
    // ========================================================

    cross() {

        const positions = [

            {
                x:
                    this.game.width / 2,

                y:
                    -70
            },

            {
                x:
                    this.game.width + 70,

                y:
                    this.game.height / 2
            },

            {
                x:
                    this.game.width / 2,

                y:
                    this.game.height + 70
            },

            {
                x:
                    -70,

                y:
                    this.game.height / 2
            }

        ];


        for (
            const position
            of positions
        ) {

            const angle =
                Math.atan2(

                    this.game.player.y -
                    position.y,

                    this.game.player.x -
                    position.x

                );


            this.game.createDirectionalArrow(

                position.x,

                position.y,

                angle,

                290

            );

        }

    }


    // ========================================================
    // 05. 화살비
    // ========================================================

    arrowRain() {

        const count =
            this.game.survivalTime >= 8
                ? 18
                : 12;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                Math.random() *
                this.game.width;


            const targetX =
                this.game.player.x +
                (
                    Math.random() -
                    0.5
                ) *
                250;


            const targetY =
                this.game.player.y;


            const angle =
                Math.atan2(

                    targetY -
                    -80,

                    targetX -
                    x

                );


            setTimeout(

                () => {

                    if (
                        !this.game.running
                    ) {

                        return;

                    }


                    this.game.createDirectionalArrow(

                        x,

                        -80,

                        angle,

                        300

                    );

                },

                i * 65

            );

        }

    }


    // ========================================================
    // 06. 원형
    // ========================================================

    circle() {

        const centerX =
            this.game.width / 2;


        const centerY =
            this.game.height / 2;


        const count = 12;


        const radius =
            Math.max(
                this.game.width,
                this.game.height
            ) *
            0.65;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                (
                    Math.PI * 2 *
                    i /
                    count
                );


            const x =
                centerX +
                Math.cos(angle) *
                radius;


            const y =
                centerY +
                Math.sin(angle) *
                radius;


            const targetAngle =
                Math.atan2(

                    this.game.player.y -
                    y,

                    this.game.player.x -
                    x

                );


            this.game.createDirectionalArrow(

                x,

                y,

                targetAngle,

                270

            );

        }

    }


    // ========================================================
    // 07. 화살 벽
    // ========================================================

    wall() {

        const horizontal =
            Math.random() < 0.5;


        const gapSize =
            150;


        if (
            horizontal
        ) {

            const gap =
                Math.random() *
                (
                    this.game.width -
                    gapSize
                );


            const count =
                Math.ceil(
                    this.game.width /
                    55
                );


            for (
                let i = 0;
                i < count;
                i++
            ) {

                const x =
                    i * 55;


                if (
                    x > gap &&
                    x < gap + gapSize
                ) {

                    continue;

                }


                this.game.createDirectionalArrow(

                    x,

                    -70,

                    Math.PI / 2,

                    280

                );

            }

        }

        else {

            const gap =
                Math.random() *
                (
                    this.game.height -
                    gapSize
                );


            const count =
                Math.ceil(
                    this.game.height /
                    55
                );


            for (
                let i = 0;
                i < count;
                i++
            ) {

                const y =
                    i * 55;


                if (
                    y > gap &&
                    y < gap + gapSize
                ) {

                    continue;

                }


                this.game.createDirectionalArrow(

                    -70,

                    y,

                    0,

                    280

                );

            }

        }

    }


    // ========================================================
    // 08. 틈새
    // ========================================================

    gap() {

        /*
            화면 양쪽에서 화살을 보내고
            중앙의 작은 틈을 남긴다.
        */

        const gap =
            110;


        const center =
            this.game.player.y;


        for (
            let y = 30;
            y <
            this.game.height;
            y += 55
        ) {

            if (
                Math.abs(
                    y -
                    center
                ) <
                gap
            ) {

                continue;

            }


            const angle =
                Math.atan2(

                    this.game.player.y -
                    y,

                    this.game.width -
                    -60

                );


            this.game.createDirectionalArrow(

                -60,

                y,

                angle,

                310

            );

        }

    }


    // ========================================================
    // 09. 집중 포화
    // ========================================================

    burst() {

        const count =
            10 +
            Math.floor(
                this.game.survivalTime
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            setTimeout(

                () => {

                    if (
                        !this.game.running
                    ) {

                        return;

                    }


                    this.game.createAimedArrow();

                },

                i * 55

            );

        }

    }


    // ========================================================
    // 10. 나선
    // ========================================================

    spiral() {

        const centerX =
            this.game.width / 2;


        const centerY =
            this.game.height / 2;


        const count = 20;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                i *
                0.45;


            const radius =
                Math.max(
                    this.game.width,
                    this.game.height
                ) *
                0.65;


            const x =
                centerX +
                Math.cos(angle) *
                radius;


            const y =
                centerY +
                Math.sin(angle) *
                radius;


            const targetAngle =
                Math.atan2(

                    this.game.player.y -
                    y,

                    this.game.player.x -
                    x

                );


            setTimeout(

                () => {

                    if (
                        !this.game.running
                    ) {

                        return;

                    }


                    this.game.createDirectionalArrow(

                        x,

                        y,

                        targetAngle,

                        320

                    );

                },

                i * 45

            );

        }

    }


    // ========================================================
    // 11. 추적
    // ========================================================

    tracking() {

        const count = 8;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            setTimeout(

                () => {

                    if (
                        !this.game.running
                    ) {

                        return;

                    }


                    this.game.createAimedArrow();

                },

                i * 100

            );

        }

    }


    // ========================================================
    // 12. 역방향 틈새
    // ========================================================

    reverseGap() {

        const gap =
            130;


        const center =
            this.game.player.x;


        for (
            let x = 20;
            x <
            this.game.width;
            x += 55
        ) {

            if (
                Math.abs(
                    x -
                    center
                ) <
                gap
            ) {

                continue;

            }


            this.game.createDirectionalArrow(

                x,

                -70,

                Math.PI / 2,

                300

            );

        }

    }


    // ========================================================
    // 13. 교차 부채
    // ========================================================

    crossFan() {

        this.fan();


        setTimeout(

            () => {

                if (
                    !this.game.running
                ) {

                    return;

                }


                this.cross();

            },

            280

        );

    }


    // ========================================================
    // 14. 사방 포위
    // ========================================================

    surround() {

        const count = 20;


        const centerX =
            this.game.player.x;


        const centerY =
            this.game.player.y;


        const radius =
            Math.max(
                this.game.width,
                this.game.height
            ) *
            0.75;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                Math.PI * 2 *
                i /
                count;


            const x =
                centerX +
                Math.cos(angle) *
                radius;


            const y =
                centerY +
                Math.sin(angle) *
                radius;


            const target =
                Math.atan2(

                    centerY -
                    y,

                    centerX -
                    x

                );


            this.game.createDirectionalArrow(

                x,

                y,

                target,

                330

            );

        }

    }


    // ========================================================
    // 15. 죽음의 사각형
    // ========================================================

    deathBox() {

        const margin = 80;


        const positions = [

            {
                x:
                    -margin,

                y:
                    -margin
            },

            {
                x:
                    this.game.width +
                    margin,

                y:
                    -margin
            },

            {
                x:
                    this.game.width +
                    margin,

                y:
                    this.game.height +
                    margin
            },

            {
                x:
                    -margin,

                y:
                    this.game.height +
                    margin
            }

        ];


        for (
            const position
            of positions
        ) {

            const angle =
                Math.atan2(

                    this.game.player.y -
                    position.y,

                    this.game.player.x -
                    position.x

                );


            this.game.createDirectionalArrow(

                position.x,

                position.y,

                angle,

                360

            );

        }

    }


    // ========================================================
    // 16. 복합 패턴
    // ========================================================

    combination() {

        this.fan();


        setTimeout(

            () => {

                if (
                    !this.game.running
                ) {

                    return;

                }


                this.arrowRain();

            },

            350

        );


        setTimeout(

            () => {

                if (
                    !this.game.running
                ) {

                    return;

                }


                this.doubleSide();

            },

            700

        );

    }


    // ========================================================
    // 17. 최종 폭풍
    // ========================================================

    finalStorm() {

        /*
            10초 이상 살아남았을 때
            가장 어려운 패턴.

            단순히 화살을 많이 만드는 게 아니라
            서로 다른 방향의 패턴을
            짧은 간격으로 섞는다.
        */


        this.cross();


        setTimeout(

            () => {

                if (
                    !this.game.running
                ) {

                    return;

                }


                this.fan();

            },

            250

        );


        setTimeout(

            () => {

                if (
                    !this.game.running
                ) {

                    return;

                }


                this.arrowRain();

            },

            500

        );


        setTimeout(

            () => {

                if (
                    !this.game.running
                ) {

                    return;

                }


                this.surround();

            },

            850

        );

    }

}
