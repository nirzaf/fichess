import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetGame, undoMove } from '../../store/gameSlice';
import { RootState } from '../../store/store';
import AIControls from './AIControls';
import './GameControls.css';

const GameControls: React.FC = () => {
  const dispatch = useDispatch();
  const { moveHistory } = useSelector((state: RootState) => state.game);
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the game?')) {
      dispatch(resetGame());
    }
  };
  
  const handleUndo = () => {
    dispatch(undoMove());
  };

  return (
    <div className="game-controls-container">
      <AIControls />
      <div className="game-controls">
        <button 
          className="control-button" 
          onClick={handleReset}
        >
          New Game
        </button>
        <button 
          className="control-button" 
          onClick={handleUndo} 
          disabled={moveHistory.length === 0}
        >
          Undo Move
        </button>
      </div>
    </div>
  );
};

export default GameControls;
