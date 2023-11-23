import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../providers/Socket';
import { usePlayerInfo } from '../providers/PlayerInfo';
import { Header } from '../components/Header';

function PlayOnlinePage() {
    const { socket } = useSocket();
    const { lobbyCode, setLobbyCode, name, setName, setThisPlayerId, setIsGameHost, setIsPlayOnline } = usePlayerInfo();
    const navigate = useNavigate();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setLobbyCode("")
        setName("")
    }, [])

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


    const handleSubmit = () => {
        if (name != "") {
            socket.emit("play-online", { name })
        } else {
            alert("Please enter a valid player name. The field cannot be left empty.")
        }
    }

    return (
        <div className='createlobbypage-container'>
            <div>
                <Header />
                <div className='form-div'>
                    <input type="text" placeholder="player name" value={name} onChange={e => { if (e.target.value.length <= 15) setName(e.target.value); }} />
                    <button className="button-confirm" onClick={handleSubmit}> PLAY </button>
                    <h3 id='home-vp-text'>2-PLAYER ONLINE GAME THAT YOU CAN PLAY WITH YOUR FRIENDS.</h3>
                </div>
            </div>
        </div>
    )
}

export default PlayOnlinePage;


