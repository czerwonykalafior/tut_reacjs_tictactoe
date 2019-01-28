import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6], 
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}/>
        );
    }

    render() {
        let rows = [];
        let counter = 0;
        for (let r = 0; r < 3; r++) {
            rows.push([]);
            for (let c = 0; c < 3; c++) {
                rows[r].push(this.renderSquare(counter));
                counter++;
            };
        }

        let board = rows.map((r, idx) => {
            return (
                <div className="board-row" key={idx}>
                    {r}
                </div>
            )})

        return (
            <div className="board">
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                move_loc: null
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const loc_x = Math.floor(i/3);
        const loc_y = i%3;
        this.setState({
            history: history.concat([{
                squares: squares,
                move_loc: '' + loc_x + ', ' + loc_y,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
         });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' ' + step.move_loc :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}> {desc}</button>
                </li>
            )
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


// Display the location for each move in the format (col, row) in the move history list.

// n = x, y
// 0 = 0, 0
// 1 = 0, 1
// 2 = 0, 2

// 3 = 1, 0
// 4 = 1, 1
// 5 = 1, 2

// 6 = 2, 0
// 7 = 2, 1
// 8 = 2, 2


// x = n//3
// y = n%3