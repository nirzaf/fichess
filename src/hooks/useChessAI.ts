import { useCallback } from 'react';
import { Chess } from 'chess.js';
import { DifficultyLevel, Move } from '../types/chess.types';

// Simple evaluation function for the AI
const evaluateBoard = (chess: Chess): number => {
  // Material value
  const pieceValues: Record<string, number> = {
    p: 1,   // pawn
    n: 3,   // knight
    b: 3,   // bishop
    r: 5,   // rook
    q: 9,   // queen
    k: 0    // king (not counted in material evaluation)
  };

  let score = 0;
  const board = chess.board();

  // Calculate material advantage
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = board[row][col];
      if (square) {
        const value = pieceValues[square.type];
        score += square.color === 'w' ? value : -value;
      }
    }
  }

  // Add some positional evaluation (center control)
  const centerSquares = ['d4', 'd5', 'e4', 'e5'];
  for (const square of centerSquares) {
    // Fix Type 'string' is not assignable to parameter of type 'Square'
    const piece = chess.get(square as any);
    if (piece) {
      score += piece.color === 'w' ? 0.5 : -0.5;
    }
  }

  return score;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  chess: Chess, 
  depth: number, 
  alpha: number, 
  beta: number, 
  isMaximizing: boolean
): number => {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    const moves = chess.moves({ verbose: true });
    
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    
    return maxEval;
  } else {
    let minEval = Infinity;
    const moves = chess.moves({ verbose: true });
    
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    
    return minEval;
  }
};

// Hook for AI move calculation
const useChessAI = () => {
  // Calculate best move for the AI
  const calculateBestMove = useCallback((fen: string, difficulty: DifficultyLevel): Move | null => {
    const chess = new Chess(fen);
    
    // Set search depth based on difficulty
    let depth = 1;
    switch (difficulty) {
      case 'Easy':
        depth = 2;
        break;
      case 'Medium':
        depth = 3;
        break;
      case 'Hard':
        depth = 4;
        break;
      case 'Expert':
        depth = 5;
        break;
    }
    
    // Get all possible moves
    const possibleMoves = chess.moves({ verbose: true });
    
    if (possibleMoves.length === 0) {
      return null; // Game over
    }
    
    let bestMove = null;
    let bestValue = -Infinity;
    
    // Find the best move using minimax
    for (const move of possibleMoves) {
      chess.move(move);
      const value = minimax(chess, depth - 1, -Infinity, Infinity, false);
      chess.undo();
      
      // Add some randomness for lower difficulties
      const randomFactor = 
        difficulty === 'Easy' ? Math.random() * 2 : 
        difficulty === 'Medium' ? Math.random() : 0;
      
      if (value + randomFactor > bestValue) {
        bestValue = value + randomFactor;
        bestMove = move;
      }
    }
    
    if (bestMove) {
      return {
        from: bestMove.from,
        to: bestMove.to,
        promotion: bestMove.promotion
      };
    }
    
    return null;
  }, []);
  
  return { calculateBestMove };
};

export default useChessAI;
