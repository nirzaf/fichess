// Chess piece types
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

// Board position using algebraic notation (e.g., 'a1', 'e4')
export type Position = string;

// Chess move representation
export interface Move {
  from: Position;
  to: Position;
  promotion?: PieceType; // For pawn promotion
}

// Game state
export interface GameState {
  board: Board;
  currentPlayer: PieceColor;
  moveHistory: Move[];
  capturedPieces: Piece[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  selectedSquare: Position | null;
  possibleMoves: Position[];
  lastMove: Move | null;
}

// Board representation
export type Board = (Piece | null)[][];

// Difficulty levels for AI
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Expert';

// Game mode
export type GameMode = 'AI' | 'TwoPlayer';