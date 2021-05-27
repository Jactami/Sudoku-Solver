const COLS = 9;
const ROWS = 9;

let grid = [
    ['', '', '', '', 6, '', 7, '', ''],
    [6, 9, '', '', 5, 4, 3, '', ''],
    ['', '', 5, 1, '', '', '', '', ''],
    ['', '', '', '', '', 3, 1, '', ''],
    ['', '', 8, '', '', '', '', 3, 4],
    ['', 3, 1, 5, 4, '', '', 6, 9],
    ['', 5, '', '', 2, 8, '', 9, ''],
    ['', 7, 4, '', '', '', 6, '', 2],
    ['', 8, 3, '', '', '', 5, '', 1]
];

let solution = [
    [3, 1, 2, 8, 6, 9, 7, 4, 5],
    [6, 9, 7, 2, 5, 4, 3, 1, 8],
    [8, 4, 5, 1, 3, 7, 9, 2, 6],
    [4, 2, 9, 6, 8, 3, 1, 5, 7],
    [5, 6, 8, 9, 7, 1, 2, 3, 4],
    [7, 3, 1, 5, 4, 2, 8, 6, 9],
    [1, 5, 6, 7, 2, 8, 4, 9, 3],
    [9, 7, 4, 3, 1, 5, 6, 8, 2],
    [2, 8, 3, 4, 9, 6, 5, 7, 1]
];

// console.table(grid)

function isValidEntry(x, y) {
    let entry = grid[x][y];

    // check row
    for (let i = 0; i < ROWS; i++) {
        if (i === y)
            continue;

        if (grid[x][i] === entry)
            return false;
    }

    // check column
    for (let i = 0; i < COLS; i++) {
        if (i === x)
            continue;

        if (grid[i][y] === entry)
            return false;
    }

    // check block
    let blockX = Math.floor(x / 3) * 3;
    let blockY = Math.floor(y / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (blockX + j === x && blockY + i === y)
                continue;

            if (grid[blockX + j][blockY + i] === entry)
                return false;
        }
    }

    return true;
}

function solve() {
    solveRec(getFreeSpot(), 1);
}

function solveRec(current, n) {
    if (!current)
        return true;

    if (n > 9)
        return false;

    grid[current.j][current.i] = n;
    next = getFreeSpot();

    if (!isValidEntry(current.j, current.i) || !solveRec(next, 1)) {
        grid[current.j][current.i] = '';
        return solveRec(current, n + 1);
    }

    return true;
}

function getFreeSpot() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (grid[j][i] === '')
                return {
                    i,
                    j
                };
        }
    }

    return null;
}

function test() {
    solve();
    console.table(grid);
    console.table(solution);
}

test();