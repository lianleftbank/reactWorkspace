import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

// Board
class Board extends React.Component {
  constructor(props) {

    super(props);
    this.state =({
      result: [],
    });
  }
  renderSquare(i) {
    return (<Square 
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />
    );
  }

  paintSquare() {
    let x = this.props.xy[0];
    let y = this.props.xy[1];
    console.debug('------------');
    for (let i = 1; i <= x; i++) {
        for (let j = 0; j < y; j++) {
          this.setState({
            result: this.state.result.concat(this.renderSquare(i * j)),
          });
        }
    }
  }

  render() {
    return (
      <div>
        {/* {this.paintSquare()}
        <div>
          {
            this.state.result.map((e) => <div>{e}</div>)
          }
        </div> */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history:[{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber:0,
      xAxis: 0,
      yAxis: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber +1);
    const current = history[history.length -1];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]) {
      return ;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    let x = Math.round(i / this.props.xNum);
    let y = i % this.props.xNum;
    if (x >= 1 && y === this.props.xNum - 1) {
      x = x - 1;
    }

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      xAxis: x,
      yAxis: y,
    })
  }

  jumpTo(step) {

    this.setState({
      stepNumber: step,
      xIsNext: (step %2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? ('Go to move #' + move) : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(winner) {
      status = 'Winner is: ' + winner;
    } else {
      status = 'Next player is: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let coordinate;
    coordinate = 'coordinate is: [' + this.state.xAxis + ',' + this.state.yAxis + ']';

    let xy = [this.state.xAxis, this.state.yAxis];

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            xy={xy}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{coordinate}</div>
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
  <Game xNum = {3} yNum = {3}/>,
  document.getElementById('root')
);

