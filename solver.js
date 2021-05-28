// variables
const COLS = 9;
const ROWS = 9;
let grid = makeEmptyGrid();

// initialize page
$(window).on('load', () => {
    // bind functions to buttons
    $('#solveBtn').on('click', solve);
    $('#resetBtn').on('click', reset);

    // create input grid
    for (let i = 0; i < ROWS; i++) {
        let row = $('<tr></tr>');
        $('#inputSudoku').append(row);
        for (let j = 0; j < COLS; j++) {
            let input = $('<td><input type="number" class="input" min="1" max="9"/></td>');
            input.on("input", e => {
                $(e.target).val(validateInput($(e.target).val()));
            });
            row.append(input);
        }
    }

    // create output grid
    for (let i = 0; i < ROWS; i++) {
        let row = $('<tr></tr>');
        $('#outputSudoku').append(row);
        for (let j = 0; j < COLS; j++) {
            row.append('<td><input type="number" class="output" min="1" max="9" disabled/></td>');
        }
    }
});

// user interface functions
function validateInput(n) {
    validNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (validNumbers.includes(n))
        return n;

    return '';
}

function readInput() {
    let inputs = $(".input");

    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            let index = i * COLS + j;
            grid[i][j] = parseInt($(inputs[index]).val()) || '';
        }
    }
    console.table(grid);
}

function writeOutput(outputs) {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            let index = i * COLS + j;
            $(outputs[index]).val(grid[i][j]);
            $(outputs[index]).removeClass("highlight");
            if ($(outputs[index]).val() === $($(".input")[index]).val()) {
                $(outputs[index]).addClass("highlight");
            }
        }
    }
}

function makeEmptyGrid() {
    arr = new Array(ROWS);
    for (let i = 0; i < ROWS; i++) {
        arr[i] = new Array(COLS);
        for (let j = 0; j < COLS; j++) {
            arr[i][j] = '';
        }
    }
    return arr;
}

function reset() {
    grid = makeEmptyGrid();
    writeOutput($(".output"));
    writeOutput($(".input"));
}

function solve() {
    readInput();
    getSolution();
    writeOutput($(".output"));
    console.table(grid);
}

// solver functions
function getSolution() {
    solveRec(getEmptyField(), 1);
}

function solveRec(current, n) {
    if (!current)
        return true;

    if (n > 9)
        return false;

    grid[current.j][current.i] = n;
    next = getEmptyField();

    if (!isValidEntry(current.j, current.i) || !solveRec(next, 1)) {
        grid[current.j][current.i] = '';
        return solveRec(current, n + 1);
    }

    return true;
}

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

function getEmptyField() {
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
    grid = [
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

    solve();
    isSolved = true;
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (grid[j][i] !== solution[j][i]) {
                isSolved = false;
                break;
            }
        }
    }

    console.table(grid);
    console.table(solution);
    console.log("Sudoku solved?: " + isSolved);
}

// TODO: place input inside table to adapt strokewidth
// TODO: copy empty table next to user input
// TODO: validate user input before analysing