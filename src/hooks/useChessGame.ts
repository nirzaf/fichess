import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chess } from 'chess.js';
import { RootState } from '../store/store';
import { makeMove, resetGame } from '../store/gameSlice';
import useChessAI from './useChessAI';
// Removing unused import
// import { DifficultyLevel, GameMode, Move } from '../types/chess.types';
import { DifficultyLevel, Move } from '../types/chess.types';

const useChessGame = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const { calculateBestMove } = useChessAI();
  
  // Create a chess.js instance from the current state
  const createChessInstance = useCallback(() => {
    const chess = new Chess();
    
    // Reconstruct the game from move history
    chess.reset();
    gameState.moveHistory.forEach(move => {
      chess.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion
      });
    });
    
    return chess;
  }, [gameState.moveHistory]);
  
  // Make a move
  const movePiece = useCallback((move: Move) => {
    dispatch(makeMove(move));
  }, [dispatch]);
  
  // Reset the game
  const startNewGame = useCallback(() => {
    dispatch(resetGame());
  }, [dispatch]);
  
  // Get AI move
  const getAIMove = useCallback((difficulty: DifficultyLevel = 'Medium') => {
    const chess = createChessInstance();
    const fen = chess.fen();
    return calculateBestMove(fen, difficulty);
  }, [calculateBestMove, createChessInstance]);
  
  // Make AI move
  const makeAIMove = useCallback((difficulty: DifficultyLevel = 'Medium') => {
    const aiMove = getAIMove(difficulty);
    if (aiMove) {
      dispatch(makeMove(aiMove));
      return true;
    }
    return false;
  }, [dispatch, getAIMove]);
  
  return {
    gameState,
    movePiece,
    startNewGame,
    getAIMove,
    makeAIMove,
    createChessInstance
  };
};

export default useChessGame;
