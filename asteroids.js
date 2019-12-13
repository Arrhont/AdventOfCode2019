const input = [
    `#....#.....#...#.#.....#.#..#....#
#..#..##...#......#.....#..###.#.#
#......#.#.#.....##....#.#.....#..
..#.#...#.......#.##..#...........
.##..#...##......##.#.#...........
.....#.#..##...#..##.....#...#.##.
....#.##.##.#....###.#........####
..#....#..####........##.........#
..#...#......#.#..#..#.#.##......#
.............#.#....##.......#...#
.#.#..##.#.#.#.#.......#.....#....
.....##.###..#.....#.#..###.....##
.....#...#.#.#......#.#....##.....
##.#.....#...#....#...#..#....#.#.
..#.............###.#.##....#.#...
..##.#.........#.##.####.........#
##.#...###....#..#...###..##..#..#
.........#.#.....#........#.......
#.......#..#.#.#..##.....#.#.....#
..#....#....#.#.##......#..#.###..
......##.##.##...#...##.#...###...
.#.....#...#........#....#.###....
.#.#.#..#............#..........#.
..##.....#....#....##..#.#.......#
..##.....#.#......................
.#..#...#....#.#.....#.........#..
........#.............#.#.........
#...#.#......#.##....#...#.#.#...#
.#.....#.#.....#.....#.#.##......#
..##....#.....#.....#....#.##..#..
#..###.#.#....#......#...#........
..#......#..#....##...#.#.#...#..#
.#.##.#.#.....#..#..#........##...
....#...##.##.##......#..#..##....`
];

const input1 = [
    `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`
];

const input2 = [
    `......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`
];

function counterMaker() {
    let count = 0;
    return function() {
        return count++;
    };
}

let counter = counterMaker();
let rayCounter = counterMaker();

class Asteroid {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.number = counter();
        this.sight = [];
    }
}

class Ray {
    constructor(startingPoint, crossingPoint) {
        if (
            startingPoint.x === crossingPoint.x &&
            startingPoint.y === crossingPoint.y
        ) {
            throw new Error('Cant build ray through one point');
        }

        this.start = {};
        this.cross = {};
        this.start.x = startingPoint.x;
        this.start.y = startingPoint.y;
        this.cross.x = crossingPoint.x;
        this.cross.y = crossingPoint.y;
        this.number = rayCounter();

        this.length = Math.sqrt(
            (crossingPoint.x - startingPoint.x) *
                (crossingPoint.x - startingPoint.x) +
                (crossingPoint.y - startingPoint.y) *
                    (crossingPoint.y - startingPoint.y)
        );

        this.sin = (startingPoint.y - crossingPoint.y) / this.length;
        this.tan =
            (crossingPoint.y - startingPoint.y) /
            (crossingPoint.x - startingPoint.x);

        this.quadrant = this.quadrantDetermine(startingPoint, crossingPoint);
    }

    quadrantDetermine(startingPoint, crossingPoint) {
        if (
            startingPoint.x <= crossingPoint.x &&
            startingPoint.y > crossingPoint.y
        ) {
            return 1;
        }

        if (
            startingPoint.x < crossingPoint.x &&
            startingPoint.y <= crossingPoint.y
        ) {
            return 2;
        }

        if (
            startingPoint.x >= crossingPoint.x &&
            startingPoint.y < crossingPoint.y
        ) {
            return 3;
        }

        if (
            startingPoint.x > crossingPoint.x &&
            startingPoint.y >= crossingPoint.y
        ) {
            return 4;
        }
    }

    isTheSameRay(ray) {
        const DELTA_X = this.cross.x - this.start.x;
        const DELTA_Y = this.cross.y - this.start.y;

        const isOntheOneLine =
            (ray.cross.x - this.start.x) * DELTA_Y ===
            (ray.cross.y - this.start.y) * DELTA_X;
        if (isOntheOneLine && this.quadrant === ray.quadrant) {
            return true;
        }

        return false;
    }

    static compare(ray1, ray2) {
        if (ray1.quadrant < ray2.quadrant) return -1;
        if (ray1.quadrant > ray2.quadrant) return 1;

        switch (ray1.quadrant) {
            case 1:
            case 2:
                if (ray1.tan < ray2.tan) return -1;
                if (ray1.tan > ray2.tan) return 1;
                if (ray1.length > ray2.length) return -1;
                if (ray1.length < ray2.length) return 1;
                break;

            case 3:
            case 4:
                if (ray1.tan > ray2.tan) return 1;
                if (ray1.tan < ray2.tan) return -1;
                if (ray1.length > ray2.length) return -1;
                if (ray1.length < ray2.length) return 1;
                break;

            default:
                throw new Error(
                    `Error in quadrant detection of Ray#${ray1.number} or #${ray2.number}`
                );
        }
    }
}

function asteroidParse(asteroidField) {
    const splittedAsteroidArray = asteroidField.split('\n');
    const asteroidArray = [];

    for (let y = 0; y < splittedAsteroidArray.length; y++) {
        const line = splittedAsteroidArray[y];

        for (let x = 0; x < line.length; x++) {
            const char = line[x];

            if (char === '#') {
                asteroidArray.push(new Asteroid(x, y));
            }
        }
    }

    return asteroidArray;
}

function checkSight(firstLinePoint, secondLinePoint, thirdPoint) {
    const x1 = firstLinePoint.x;
    const y1 = firstLinePoint.y;
    const x2 = secondLinePoint.x;
    const y2 = secondLinePoint.y;

    const x3 = thirdPoint.x;
    const y3 = thirdPoint.y;

    const distanceFirstSecond = Math.sqrt(
        (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
    );
    const distanceFirstThird = Math.sqrt(
        (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3)
    );

    const isOntheOneLine = (x3 - x1) * (y2 - y1) === (y3 - y1) * (x2 - x1);
    const firstIsBetweenX = (x2 < x1 && x1 < x3) || (x3 < x1 && x1 < x2);
    const firstIsBetweenY = (y2 < y1 && y1 < y3) || (y3 < y1 && y1 < y2);

    if (isOntheOneLine) {
        if (firstIsBetweenX || firstIsBetweenY) {
            return true;
        }

        if (distanceFirstSecond > distanceFirstThird) {
            return false;
        }
    }

    return true;
}

function sightAdder(targetAsteroid, asteroidArray) {
    for (const checkingAsteroid of asteroidArray) {
        if (checkingAsteroid === targetAsteroid) continue;
        const visibility = [];

        for (const asteroid of asteroidArray) {
            if (asteroid === checkingAsteroid || asteroid === targetAsteroid)
                continue;
            visibility.push(
                checkSight(targetAsteroid, checkingAsteroid, asteroid)
            );
        }

        if (visibility.every(visible => visible === true)) {
            targetAsteroid.sight.push(checkingAsteroid);
        }
    }
}

// TODO! Implement this
function shoot(rayArray) {
    let asteroidKillCount = 0;

    while (rayArray.length > 0) {

        for (let i = 0; i < rayArray.length; ) {

            if(i === rayArray.length) {
                asteroidKillCount += 1;
                console.log(asteroidKillCount, ': ', rayArray[i].cross);
                rayArray.splice(i, 1);
                break;
            }

            if(rayArray[i].isTheSameRay(rayArray[i + 1])) {
                i += 1;
                continue;
            }

            asteroidKillCount += 1;
            console.log(asteroidKillCount, ': ', rayArray[i].cross, i);
            rayArray.splice(i, 1);
        }
    }
}

//LAUNCHDATA

function run(field) {
    const asteroidField = field[0];
    const asteroidArray = asteroidParse(asteroidField);

    for (let i = 0; i < asteroidArray.length; i++) {
        sightAdder(asteroidArray[i], asteroidArray);
    }

    const result = asteroidArray.reduce((acc, asteroid) =>
        acc.sight.length < asteroid.sight.length ? asteroid : acc
    );

    console.log(
        'max vision asteroid#',
        result.number,
        'sight:',
        result.sight.length,
        result.x,
        result.y
    );
    return asteroidArray;
}

function run2() {
    const asteroidArray = run(input);
    let laser = asteroidArray[265];

    const rayArray = [];

    for (const asteroid of asteroidArray) {
        try {
            rayArray.push(new Ray(laser, asteroid));
        } catch (err) {
            continue;
        }
    }

    rayArray.sort(Ray.compare);

    shoot(rayArray);
}

run2();
