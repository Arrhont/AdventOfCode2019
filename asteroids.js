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
        if (startingPoint.x === crossingPoint.x && startingPoint.y === crossingPoint.y) {
            throw new Error('Cant build ray through one point');
        }

        this.start = {};
        this.cross = {};
        this.start.x = startingPoint.x;
        this.start.y = startingPoint.y;
        this.cross.x = crossingPoint.x;
        this.cross.y = crossingPoint.y;
        this.number = rayCounter();

        this.length = Math.sqrt((startingPoint.x * startingPoint.x - crossingPoint.x * crossingPoint.x) +
            (startingPoint.y * startingPoint.y - crossingPoint.y * crossingPoint.y));
        
        this.sin = (startingPoint.y - crossingPoint.y) / this.length;
        this.tan = (crossingPoint.y - startingPoint.y) / (crossingPoint.x - startingPoint.x);

        this.quadrant = this.quadrantDetermine(startingPoint, crossingPoint);
    }

    quadrantDetermine(startingPoint, crossingPoint) {

        if (startingPoint.x <= crossingPoint.x && startingPoint.y >= crossingPoint.y) {
            return 1;
        }

        if (startingPoint.x <= crossingPoint.x && startingPoint.y < crossingPoint.y) {
            return 2;
     
        }

        if (startingPoint.x > crossingPoint.x && startingPoint.y < crossingPoint.y) {
            return 3;
        }

        if (startingPoint.x > crossingPoint.x && startingPoint.y > crossingPoint.y) {
            return 4;
        }
    }
    
    isTheSameRay(ray) {
        const DELTA_X = this.cross.x - this.start.x;
        const DELTA_Y = this.cross.y - this.start.y;

        const isOntheOneLine = (ray.cross.x - this.start.x) * DELTA_Y === (ray.cross.y - this.start.y) * DELTA_X;
        if (isOntheOneLine && this.quadrant === ray.quadrant) {
            return true;
        }

        return false;
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

    console.log(result.sight.length);
    return asteroidArray;
}

const asteroidArray = run(input);
let laser = asteroidArray[265];

const rayArray = [];
for (const asteroid of asteroidArray) {
    try {
        rayArray.push(new Ray(laser, asteroid));
    }
    catch(err) {
        continue;
    }
}

console.log(rayArray[0]);







