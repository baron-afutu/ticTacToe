"use strict"

let turn = 'x';
let xturn = true;
let gameEnded = false;
let moves = 0;
let cellsTaken = [
    false, false, false,
    false, false, false,
    false, false, false
];
let scores = { 'x': 0, 'o': 0, 't': 0 }
let cellsPlayed = { 'x': [], 'o': [] }
let playerNumbers = { 'x': 2, 'o': 1 }
let p1Token = 'o';
let pvCPU = false;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]


/**
 * Hides all tokens from the board
 */
const restart = () => {
    $('.x-token').hide();
    $('.o-token').hide();
    $('#oTurnIndic').hide();
    cellsTaken = [
        false, false, false,
        false, false, false,
        false, false, false
    ];
    cellsPlayed = { 'x': [], 'o': [] }
    turn = 'x';
    gameEnded = false;
    moves = 0;
}

/**
 * Returns the index of a cell
 * @param {Node} cell 
 * @returns {Number} index
 */
const getIndex = (cell) => {
    return parseInt($(cell).attr('data-cell'));
}

/**
 * checks if current player has won
 * @param {Array} movesMade 
 * @returns {Boolean} win status
 */
const hasWon = (movesMade) => {
    if (movesMade.length < 3) return false;
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(element => {
            return movesMade.includes(element);
        })
    })
}

const changeTurn = () => {
    $(`#${turn}TurnIndic`).hide();
    turn = turn === 'o' ? 'x' : 'o';
    $(`#${turn}TurnIndic`).show();
}


/**
 * Runs a round of player move
 * @param {Node} cell 
 */
let runPlay = (cell) => {
    const cellIndex = getIndex(cell);
    if (isNaN(cellIndex) || cellsTaken[cellIndex]) { return; }

    $(cell).find(`.${turn}-token`).show();
    cellsPlayed[turn].push(cellIndex);

    if (hasWon(cellsPlayed[turn])) {
        let winStatement = '';
        if (pvCPU) {
            winStatement = turn === p1Token ? 'You have won!' : 'You lost!';
        } else {
            winStatement = turn === p1Token ? 'P1 Won!' : 'P2 Won!';
        }
        console.log(`${winStatement}
        increasing scores. resetting in 3 secons`);
        gameEnded = true;
        scores[turn]++;
        $(`#${turn}Score`).html(scores[turn]);
        setTimeout(() => {
            restart();
        }, 3000);
        return;
    }

    if (moves > 7) {
        console.log('Its a tie. resetting in 3 secons');
        scores.t++;
        $(`#tScore`).html(scores.t);
        setTimeout(() => {
            restart();
        }, 3000);
        return;
    }
    changeTurn();
    moves++;
    cellsTaken[cellIndex] = true;
}



function makeMove(e) {
    e.preventDefault();
    if (gameEnded) return;
    if (pvCPU && turn != p1Token) return;

    runPlay(this);
}

const selectToken = function (e) {
    let token = $(this).attr('data-token');
    if (token === 'x') {
        p1Token = 'x';
        $('#xToken').addClass('rectangle-4');
        $('#oToken').removeClass('rectangle-3');
    }
    if (token === 'o') {
        p1Token = 'o';
        $('#xToken').removeClass('rectangle-4');
        $('#oToken').addClass('rectangle-3');
    }
}

const selectGameMode = function (e) {
    const mode = $(this).attr('id');
    pvCPU = mode == 'PvC';

    if (pvCPU) {
        if (p1Token == 'o') {
            // CPU Moves first
            $('#oName').html('O (You)');
            $('#xName').html('X (CPU)');
            let pos = Math.floor(Math.random() * 9);
            setTimeout(() => {
                runPlay($(`.cell[data-cell="${pos}"]`));
            }, 1000);
        }
    } else {
        if (p1Token == 'x') {
            $('#oName').html('O (P2)');
            $('#xName').html('X (P1)');
        }else{
            $('#oName').html('O (P1)');
            $('#xName').html('X (P2)');
        }
    }
    $('.main-menu').hide();
    $('.gameboard').show();
}





$(document).ready(function () {
    restart();
    $('.gameboard').hide();
    $('.overlay').hide();

    $('.rectangle-token').click(selectToken);
    $('.cell').click(makeMove);
    $('.button').click(selectGameMode);
});