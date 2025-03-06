import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chess } from 'chess.js';
import { Board, GameState, Move, Piece, PieceColor, Position } from '../types/chess.types';

// Initialize chess.js instance
const chess = new Chess();

// Helper function to convert chess.js board to our Board type
const convertBoard = (): Board => {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = chess.board()[row][col];
      if (square) {
        board[row][col] = {
          type: square.type as any,
          color: square.color as PieceColor
        };
      }
    }
  }
  
  return board;
};

// Helper function to get captured pieces
const getCapturedPieces = (): Piece[] => {
  const capturedPieces: Piece[] = [];
  const history = chess.history({ verbose: true });
  
  history.forEach(move => {
    if (move.captured) {
      capturedPieces.push({
        type: move.captured as any,
        color: move.color === 'w' ? 'b' : 'w'
      });
    }
  });
  
  return capturedPieces;
};

// Initial state
const initialState: GameState = {
  board: convertBoard(),
  currentPlayer: 'w',
  moveHistory: [],
  capturedPieces: [],
  isCheck: chess.isCheck(),
  isCheckmate: chess.isCheckmate(),
  isStalemate: chess.isStalemate(),
  isDraw: chess.isDraw(),
  selectedSquare: null,
  possibleMoves: [],
  lastMove: null
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    selectSquare: (state, action: PayloadAction<Position>) => {
      const position = action.payload;
      state.selectedSquare = position;
      
      // Get possible moves for the selected piece
      state.possibleMoves = [];
      // Fix Type 'string' is not assignable to type 'Square'
      try {
        const moves = chess.moves({ square: position as any, verbose: true });
        state.possibleMoves = moves.map(move => move.to);
      } catch (error) {
        console.error('Error getting moves:', error);
        state.possibleMoves = [];
      }
    },
    
    makeMove: (state, action: PayloadAction<Move>) => {
      const { from, to, promotion } = action.payload;
      
      // Try to make the move
      const moveResult = chess.move({
        from,
        to,
        promotion
      });
      
      if (moveResult) {
        // Update state
        state.board = convertBoard();
        state.currentPlayer = chess.turn() as PieceColor;
        state.moveHistory.push(action.payload);
        state.capturedPieces = getCapturedPieces();
        state.isCheck = chess.isCheck();
        state.isCheckmate = chess.isCheckmate();
        state.isStalemate = chess.isStalemate();
        state.isDraw = chess.isDraw();
        state.selectedSquare = null;
        state.possibleMoves = [];
        state.lastMove = action.payload;
      }
    },
    
    resetGame: (_state) => {
      chess.reset();
      return initialState;
    },
    
    undoMove: (state) => {
      // Fix unused state variable warning by using it in a comment
      // This reducer modifies the state directly
      chess.undo();
      state.board = convertBoard();
      state.currentPlayer = chess.turn() as PieceColor;
      state.moveHistory.pop();
      state.capturedPieces = getCapturedPieces();
      state.isCheck = chess.isCheck();
      state.isCheckmate = chess.isCheckmate();
      state.isStalemate = chess.isStalemate();
      state.isDraw = chess.isDraw();
      state.selectedSquare = null;
      state.possibleMoves = [];
      state.lastMove = state.moveHistory[state.moveHistory.length - 1] || null;
    }
  }
});

export const { selectSquare, makeMove, resetGame, undoMove } = gameSlice.actions;
export default gameSlice.reducer;