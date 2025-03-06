import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import useChessGame from '../../hooks/useChessGame';
import { DifficultyLevel } from '../../types/chess.types';
import './AIControls.css';

const AIControls: React.FC = () => {
  const [gameMode, setGameMode] = useState<'AI' | 'TwoPlayer'>('TwoPlayer');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [isThinking, setIsThinking] = useState(false);
  
  const { currentPlayer } = useSelector((state: RootState) => state.game);
  const { makeAIMove } = useChessGame();
  
  // Make AI move when it's AI's turn
  useEffect(() => {
    if (gameMode === 'AI' && currentPlayer !== playerColor && !isThinking) {
      setIsThinking(true);
      
      // Add a small delay to simulate "thinking"
      const timer = setTimeout(() => {
        makeAIMove(difficulty);
        setIsThinking(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, difficulty, gameMode, makeAIMove, playerColor, isThinking]);
  
  return (
    <div className="ai-controls">
      <div className="control-group">
        <label>Game Mode:</label>
        <select 
          value={gameMode} 
          onChange={(e) => setGameMode(e.target.value as 'AI' | 'TwoPlayer')}
        >
          <option value="TwoPlayer">Two Player</option>
          <option value="AI">Play vs AI</option>
        </select>
      </div>
      
      {gameMode === 'AI' && (
        <>
          <div className="control-group">
            <label>Difficulty:</label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>Play as:</label>
            <select 
              value={playerColor} 
              onChange={(e) => setPlayerColor(e.target.value as 'w' | 'b')}
            >
              <option value="w">White</option>
              <option value="b">Black</option>
            </select>
          </div>
          
          {isThinking && <div className="thinking-indicator">AI is thinking...</div>}
        </>
      )}
    </div>
  );
};

export default AIControls;
