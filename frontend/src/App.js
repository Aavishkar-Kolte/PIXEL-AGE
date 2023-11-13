import { Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from './pages/Home';
import CreateLobbyPage from './pages/CreateLobby';
import JoinLobbyPage from './pages/JoinLobby';
import { SocketProvider } from './providers/Socket';
import LobbyPage from './pages/Lobby';
import { PlayerProvider } from './providers/PlayerInfo';
import { PeerProvider } from './providers/Peer';
import PlayOnlinePage from './pages/PlayOnline';
import AboutPage from './pages/About';

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <PlayerProvider>
          <PeerProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-lobby" element={<CreateLobbyPage />} />
              <Route path="/join-lobby" element={<JoinLobbyPage />} />
              <Route path='/lobby/:lobbyCode' element={<LobbyPage />} />
              <Route path="/play-online" element={<PlayOnlinePage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </PeerProvider>
        </PlayerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
