import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../providers/Socket';
import { usePlayerInfo } from '../providers/PlayerInfo';


function JoinLobbyPage() {
    const { socket } = useSocket();
    const { lobbyCode, setLobbyCode, name, setName, setThisPlayerId, setIsGameHost } = usePlayerInfo();

    const navigate = useNavigate();


    const HandleJoinedLobby = useCallback((data) => {
        setName(data.name);
        setThisPlayerId(data.playerId);
        setLobbyCode(data.lobbyCode);
        setIsGameHost(false);
        navigate(`/lobby/${data.lobbyCode}`);
    }, []);

    useEffect(() => {
        socket.on("joined-lobby", HandleJoinedLobby);

        return () => {
            socket.off("joined-lobby", HandleJoinedLobby);
        }
    }, [socket, HandleJoinedLobby])


    return (
        <div className='joinlobbypage-container'>
            <div className='header'>
                <h1 className='logo'>PIXEL-AGE</h1>
                <button id='header-option' onClick={() => { navigate("../about") }} >DEVELOPER</button>

            </div>
            <div class="form-div">
                <input type="text" placeholder="Enter Username" value={name} onChange={e => { setName(e.target.value) }} />
                <input type="text" placeholder="Enter Lobby Code" value={lobbyCode} onChange={e => { setLobbyCode(e.target.value) }} />
                <button className="button-confirm" onClick={() => { socket.emit("join-lobby", { name, lobbyCode }) }}> JOIN-LOBBY </button>
            </div>
        </div>
    )
}

export default JoinLobbyPage;