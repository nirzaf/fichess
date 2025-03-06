import React from 'react';
// Removing unused import
// import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import { Piece, Position } from '../../types/chess.types';
import { RootState } from '../../store/store';
import './ChessPiece.css';

interface ChessPieceProps {
  piece: Piece;
  position: Position;
}

// Destructuring only what we need to avoid unused variable warnings
const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {
  const { currentPlayer } = useSelector((state: RootState) => state.game);
  // Commenting out unused variables

  // Map piece type and color to the corresponding piece class
  const getPieceClass = (piece: Piece): string => {
    const { type, color } = piece;
    return `piece-${type} ${color === 'w' ? 'white-piece' : 'black-piece'}`;
  };

  // Map piece type and color to the corresponding Unicode character
  const getPieceSymbol = (piece: Piece): string => {
    const { type, color } = piece;
    const isWhite = color === 'w';

    // Using specific Unicode characters that better match the image
    switch (type) {
      case 'p': return isWhite ? '♙' : '♟';
      case 'r': return isWhite ? '♖' : '♜';
      case 'n': return isWhite ? '♘' : '♞';
      case 'b': return isWhite ? '♗' : '♝';
      case 'q': return isWhite ? '♕' : '♛';
      case 'k': return isWhite ? '♔' : '♚';
      default: return '';
    }
  };

  return (
    <div 
      className={`chess-piece ${getPieceClass(piece)}`}
      data-piece-type={piece.type}
      data-piece-color={piece.color}
    >
      {getPieceSymbol(piece)}
    </div>
  );
};

export default ChessPiece;
