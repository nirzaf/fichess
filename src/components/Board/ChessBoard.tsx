import { useState } from 'react';
// Removing unused import
// import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RootState } from '../../store/store';
import { makeMove, selectSquare } from '../../store/gameSlice';
import Square from './Square';
import './ChessBoard.css';
import { Position } from '../../types/chess.types';

const ChessBoard = () => {
  const dispatch = useDispatch();
  const { board, selectedSquare, possibleMoves, lastMove } = useSelector((state: RootState) => state.game);
  // Using setCoordinates in a comment to avoid unused variable warning
  const [coordinates] = useState<boolean>(true); // setCoordinates will be used for toggling coordinates

  // Create the board squares
  const renderSquares = () => {
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const position = `${files[file]}${ranks[rank]}`;
        const piece = board[rank][file];
        const isSelected = selectedSquare === position;
        const isValidMove = possibleMoves.includes(position);
        // Fix Type 'boolean | null' is not assignable to type 'boolean'
        const isLastMoveFrom = lastMove ? lastMove.from === position : false;
        const isLastMoveTo = lastMove ? lastMove.to === position : false;
        
        squares.push(
          <Square
            key={position}
            position={position}
            piece={piece}
            isLight={(rank + file) % 2 === 1}
            isSelected={isSelected}
            isValidMove={isValidMove}
            isLastMoveFrom={isLastMoveFrom}
            isLastMoveTo={isLastMoveTo}
            onSelect={() => handleSquareSelect(position)}
          />
        );
      }
    }
    return squares;
  };

  // Handle square selection
  const handleSquareSelect = (position: Position) => {
    if (possibleMoves.includes(position) && selectedSquare) {
      // Make a move if the square is a valid move target
      dispatch(makeMove({ from: selectedSquare, to: position }));
    } else {
      // Select the square
      dispatch(selectSquare(position));
    }
  };

  // Render the board
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="chess-board-container">
        <div className="chess-board">
          {renderSquares()}
          {coordinates && (
            <>
              <div className="file-coordinates">
                {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(file => (
                  <div key={file} className="coordinate">{file}</div>
                ))}
              </div>
              <div className="rank-coordinates">
                {['8', '7', '6', '5', '4', '3', '2', '1'].map(rank => (
                  <div key={rank} className="coordinate">{rank}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default ChessBoard;
