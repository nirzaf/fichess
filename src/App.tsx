import { Provider } from 'react-redux';
import { store } from './store/store';
import ChessBoard from './components/Board/ChessBoard';
import GameControls from './components/Controls/GameControls';
import GameStatus from './components/GameInfo/GameStatus';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="chess-app">
        <h1>FiChess Board</h1>
        <ChessBoard />
        <GameControls />
        <GameStatus />
      </div>
    </Provider>
  );
}

export default App;
