import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import './GameStatus.css';

const GameStatus: React.FC = () => {
  const { 
    currentPlayer, 
    isCheck, 
    isCheckmate, 
    isStalemate, 
    isDraw,
    capturedPieces
  } = useSelector((state: RootState) => state.game);

  // Group captured pieces by color
  const whiteCaptured = capturedPieces.filter(piece => piece.color === 'w');
  const blackCaptured = capturedPieces.filter(piece => piece.color === 'b');

  // Map piece type to Unicode character
  const getPieceSymbol = (type: string, color: string): string => {
    const isWhite = color === 'w';
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

  // Get game status message
  const getStatusMessage = () => {
    if (isCheckmate) {
      return `Checkmate! ${currentPlayer === 'w' ? 'Black' : 'White'} wins!`;
    } else if (isStalemate) {
      return 'Stalemate! The game is a draw.';
    } else if (isDraw) {
      return 'Draw!';
    } else if (isCheck) {
      return `${currentPlayer === 'w' ? 'White' : 'Black'} is in check!`;
    } else {
      return `${currentPlayer === 'w' ? 'White' : 'Black'} to move`;
    }
  };

  return (
    <div className="game-status">
      <div className="status-message">{getStatusMessage()}</div>
      
      <div className="captured-pieces-container">
        <div className="captured-pieces">
          <h3>Captured by White</h3>
          <div className="pieces-list">
            {blackCaptured.map((piece, index) => (
              <span key={index} className="captured-piece">
                {getPieceSymbol(piece.type, piece.color)}
              </span>
            ))}
          </div>
        </div>
        
        <div className="captured-pieces">
          <h3>Captured by Black</h3>
          <div className="pieces-list">
            {whiteCaptured.map((piece, index) => (
              <span key={index} className="captured-piece">
                {getPieceSymbol(piece.type, piece.color)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
