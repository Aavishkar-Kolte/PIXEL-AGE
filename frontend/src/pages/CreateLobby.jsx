import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../providers/Socket';
import { usePlayerInfo } from '../providers/PlayerInfo';

function CreateLobbyPage() {
    const { socket } = useSocket();
    const { lobbyCode, setLobbyCode, name, setName, setThisPlayerId, setIsGameHost} = usePlayerInfo();

    const navigate = useNavigate();
    const [isReady, setIsReady] = useState(false);

    const HandleCreatedLobby = useCallback((data) => {
        setLobbyCode(data.lobbyCode);
        setName(data.name);
        setThisPlayerId(data.playerId);
        setIsGameHost(true);
        setIsReady(true);
    }, [setLobbyCode, setName, setThisPlayerId]);

    useEffect(() => {
        socket.on("created-lobby", HandleCreatedLobby);

        return () => {
            socket.off("created-lobby", HandleCreatedLobby);
        }
    }, [socket, HandleCreatedLobby]);

    useEffect(() => {
        if (isReady) {
            navigate(`/lobby/${lobbyCode}`);
        }
    }, [isReady, setLobbyCode, navigate]);

    return (
        <div className='createlobbypage-container'>
            <div>
                <h1>Create lobby</h1>
                <input type="text" placeholder="Enter username" value={name} onChange={e => { setName(e.target.value) }} />
                <button className="button-50" onClick={() => { socket.emit("create-lobby", { name }) }}> Create Lobby </button>
            </div>
        </div>
    )
}

export default CreateLobbyPage;


