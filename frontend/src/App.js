import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
  const trackingId = process.env.REACT_APP_GA_TRACKING_ID;
  return (
    <div className="App">
      <Helmet>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());

            gtag('config', '${trackingId}');
          `}
        </script>
      </Helmet>

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
