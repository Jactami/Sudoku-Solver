// variables
const COLS = 9;
const ROWS = 9;
let grid = makeEmptyGrid();

// initialize page
$(window).on('load', () => {
    // bind functions to buttons
    $('#solveBtn').on('click', solveBtnHandler);
    $('#resetBtn').on('click', resetBtnHandler);

    // create input sudoku
    for (let i = 0; i < ROWS; i++) {
        let row = $('<tr></tr>');
        $('#inputSudoku').append(row);
        for (let j = 0; j < COLS; j++) {
            let input = $('<td><input type="number" class="input highlight" min="1" max="9"/></td>');
            input.on("input", e => {
                $(e.target).val(validateInput($(e.target).val()));
            });
            row.append(input);
        }
    }

    // create output sudoku
    for (let i = 0; i < ROWS; i++) {
        let row = $('<tr></tr>');
        $('#outputSudoku').append(row);
        for (let j = 0; j < COLS; j++) {
            row.append('<td><input type="number" class="output" disabled/></td>');
        }
    }
});

// user interface functions
function validateInput(value) {
    validNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (validNumbers.includes(value))
        return value;

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
}

function writeOutput() {
    let outputs = $(".output");
    outputs.each((_, spot) => $(spot).removeClass("highlight"));

    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            let index = i * COLS + j;
            $(outputs[index]).val(grid[i][j]);
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

function resetBtnHandler() {
    grid = makeEmptyGrid();
    $(".input, .output").each((_, spot) => $(spot).val(''));
}

function solveBtnHandler() {
    readInput();
    console.table(grid);
    solve();
    writeOutput();
    console.table(grid);
}

// solver functions
function solve() {
    // validate user input
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (grid[i][j] !== '' && !isValidEntry(i, j))
                return;
        }
    }
    // solve recursively
    solveRec(getEmptySpot(), 1);
}

function solveRec(current, value) {
    if (!current)
        return true;

    if (value > 9)
        return false;

    grid[current.i][current.j] = value;
    next = getEmptySpot();

    if (!isValidEntry(current.i, current.j) || !solveRec(next, 1)) {
        grid[current.i][current.j] = '';
        return solveRec(current, value + 1);
    }

    return true;
}

function isValidEntry(row, column) {
    let entry = grid[row][column];

    // check row
    for (let j = 0; j < COLS; j++) {
        if (j === column)
            continue;

        if (grid[row][j] === entry)
            return false;
    }

    // check column
    for (let i = 0; i < ROWS; i++) {
        if (i === row)
            continue;

        if (grid[i][column] === entry)
            return false;
    }

    // check block
    let blockRow = Math.floor(row / 3) * 3;
    let blockCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (blockRow + i === row && blockCol + j === column)
                continue;

            if (grid[blockRow + i][blockCol + j] === entry)
                return false;
        }
    }

    return true;
}

function getEmptySpot() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (grid[i][j] === '')
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
            if (grid[i][j] !== solution[i][j]) {
                isSolved = false;
                break;
            }
        }
    }

    console.table(grid);
    console.table(solution);
    console.log("Sudoku solved?: " + isSolved);
}