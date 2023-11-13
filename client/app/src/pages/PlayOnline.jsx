import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../providers/Socket';
import { usePlayerInfo } from '../providers/PlayerInfo';

function PlayOnlinePage() {
    const { socket } = useSocket();
    const { lobbyCode, setLobbyCode, name, setName, setThisPlayerId, setIsGameHost, setIsPlayOnline} = usePlayerInfo();

    const navigate = useNavigate();
    const [isReady, setIsReady] = useState(false);

    const HandleCreatedLobby = useCallback((data) => {
        setLobbyCode(data.lobbyCode);
        setName(data.name);
        setThisPlayerId(data.playerId);
        setIsGameHost(true);
        setIsReady(true);
    }, [setLobbyCode, setName, setThisPlayerId]);

    const HandleJoinedLobby = useCallback((data) => {
        setName(data.name);
        setThisPlayerId(data.playerId);
        setLobbyCode(data.lobbyCode);
        setIsGameHost(false);
        setIsPlayOnline(true);
        navigate(`/lobby/${data.lobbyCode}`);
    }, []);

    useEffect(() => {
        socket.on("created-lobby", HandleCreatedLobby);
        socket.on("joined-lobby", HandleJoinedLobby);

        return () => {
            socket.off("created-lobby", HandleCreatedLobby);
            socket.off("joined-lobby", HandleJoinedLobby);
        }
    }, [socket, HandleCreatedLobby]);

    useEffect(() => {
        if (isReady) {
            setIsPlayOnline(true);
            navigate(`/lobby/${lobbyCode}`);
        }
    }, [isReady, setLobbyCode, navigate]);

    return (
        <div className='createlobbypage-container'>
            <div>
                <div className='header'>
                    <h1 className='logo'>PIXEL-AGE</h1>
                    <button id='header-option' onClick={() => { navigate("../about") }} >ABOUT</button>

                </div>
                <div className='form-div'>
                     <input type="text" placeholder="player name" value={name} onChange={e => { setName(e.target.value) }} />
                    <button className="button-confirm" onClick={() => { socket.emit("play-online", { name }) }}> PLAY </button>
                    <h3 id='home-vp-text'>2-PLAYER ONLINE GAME THAT YOU CAN PLAY WITH YOUR FRIENDS.</h3>
                </div>  
            </div>
        </div>
    )
}

export default PlayOnlinePage;


