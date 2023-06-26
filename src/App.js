import React, { useState, useEffect } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!winner && !isXNext) {
      const timer = setTimeout(makeAutoMove, 1000);
      return () => clearTimeout(timer);
    }
  }, [board, isXNext, winner]);

  const handleClick = (index) => {
    if (!board[index] && !winner && isXNext) {
      const updatedBoard = [...board];
      updatedBoard[index] = 'X';
      setBoard(updatedBoard);
      setIsXNext(false);
      checkWinner(updatedBoard, 'X');
    }
  };

  const checkWinner = (currentBoard, player) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        currentBoard[a] === player &&
        currentBoard[b] === player &&
        currentBoard[c] === player
      ) {
        if (player === 'X' && isXNext) {
          setWinner('X');
        } else if (player === 'O' && !isXNext) {
          setWinner('O');
        }
        return true;
      }
    }

    if (!currentBoard.includes(null)) {
      setWinner('Draw');
      return true;
    }

    return false;
  };

  const makeAutoMove = () => {
    if (!board.includes(null) || winner) {
      return;
    }

    // Intelligent move prioritization
    const winningMove = getWinningMove(board, 'O');
    if (winningMove !== null) {
      makeMove(winningMove);
      return;
    }

    const blockingMove = getWinningMove(board, 'X');
    if (blockingMove !== null) {
      makeMove(blockingMove);
      return;
    }

    const centerMove = 4;
    if (board[centerMove] === null) {
      makeMove(centerMove);
      return;
    }

    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter((corner) => board[corner] === null);
    if (availableCorners.length > 0) {
      const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
      makeMove(randomCorner);
      return;
    }

    const availableMoves = board.reduce((moves, cell, index) => {
      if (cell === null) {
        moves.push(index);
      }
      return moves;
    }, []);
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(randomMove);
  };

  const getWinningMove = (currentBoard, player) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        currentBoard[a] === player &&
        currentBoard[b] === player &&
        currentBoard[c] === null
      ) {
        return c;
      } else if (
        currentBoard[a] === player &&
        currentBoard[b] === null &&
        currentBoard[c] === player
      ) {
        return b;
      } else if (
        currentBoard[a] === null &&
        currentBoard[b] === player &&
        currentBoard[c] === player
      ) {
        return a;
      }
    }

    return null;
  };

  const makeMove = (index) => {
    const updatedBoard = [...board];
    updatedBoard[index] = 'O';
    setBoard(updatedBoard);
    setIsXNext(true);
    checkWinner(updatedBoard, 'O');
  };

  const renderBoard = () => {
    return board.map((value, index) => (
      <div
        key={index}
        className="bg-gray-200 w-16 h-16 flex items-center justify-center text-4xl cursor-pointer"
        onClick={() => handleClick(index)}
      >
        {value}
      </div>
    ));
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-gray-500 to-black h-screen ">
      <h2 className=' text-red-300 text-center p-6 mt-6 text-4xl font-bold '>{winner ? `Winner: ${winner}` : isXNext ? "Player's Turn (You)" : "Auto Player's Turn (AI)"}</h2>
      <div className="grid grid-cols-3 gap-4">{renderBoard()}</div>
      {winner && (
        <button onClick={resetGame} className='bg-white mt-4 p-4 text-xl'>
        Reset Game
      </button>
    )}
      </div>
);
};

export default TicTacToe;