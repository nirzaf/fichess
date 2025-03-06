import React from 'react';
// Removing unused import
// import { useDrop } from 'react-dnd';
import { Piece, Position } from '../../types/chess.types';
import ChessPiece from '../Pieces/ChessPiece.tsx';
import './Square.css';

interface SquareProps {
  position: Position;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
  onSelect: () => void;
}

const Square: React.FC<SquareProps> = ({
  position,
  piece,
  isLight,
  isSelected,
  isValidMove,
  isLastMoveFrom,
  isLastMoveTo,
  onSelect,
}) => {
  // Determine the square color class based on the light/dark pattern
  const squareColorClass = isLight ? 'light-square' : 'dark-square';
  
  // Add additional classes for highlighting
  const highlightClass = isSelected
    ? 'selected-square'
    : isValidMove
    ? 'valid-move-square'
    : isLastMoveFrom || isLastMoveTo
    ? 'last-move-square'
    : '';

  return (
    <div
      className={`square ${squareColorClass} ${highlightClass}`}
      onClick={onSelect}
      data-position={position}
    >
      {piece && <ChessPiece piece={piece} position={position} />}
      {isValidMove && !piece && <div className="move-indicator" />}
    </div>
  );
};

export default Square;
