import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const boardSize = 3;

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i + 1}
      />
    );
  }

  renderRow(row) {
    let cols = [<div className="row-label" key={0}>{row + 1}</div>];
    for (let col = 0; col < boardSize; col++) {
      let square = row * boardSize + col;
      cols.push(this.renderSquare(square));
    }

    return (<div className="board-row" key={row}>{cols}</div>);
  }

  renderLabelRow() {
    let labelCols = [<div className="col-label" key={0}></div>];
    for (let labelCol = 0; labelCol < boardSize; labelCol++) {
        labelCols.push(<div className="col-label" key={labelCol + 1}>a</div>);
    }

    return (<div className="board-row" key={boardSize}>{labelCols}</div>);
  }

  render() {
    let rows = [];
    for (let row = 0; row < boardSize; row++) {
      rows.push(this.renderRow(row));
    }
    rows.push(this.renderLabelRow());

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      move: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.move + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const xIsNext = !this.state.xIsNext;
    const row = Math.floor(i / boardSize);
    const col = i % boardSize;
    this.setState({
      history: [...history, {squares, row, col}],
      move: history.length,
      xIsNext,
    });
  }

  jumpTo(move) {
    this.setState({
      move,
      xIsNext: (move % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.move];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    const moves = history.map((step, move) => {
      const colLabel = ['a', 'b', 'c'][step.col];

      const desc = move ?
        `Go to move #${move} (${colLabel}${step.row + 1})`
        : 'Go to game start';
      
      const className = (move === this.state.move) ? 'selected' : '';

      return (
        <li key={move} className={className}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
