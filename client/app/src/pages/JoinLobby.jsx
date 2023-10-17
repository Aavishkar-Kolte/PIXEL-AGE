import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../providers/Socket';
import { usePlayerInfo } from '../providers/PlayerInfo';


function JoinLobbyPage() {
    const { socket } = useSocket();
    const { lobbyCode, setLobbyCode, name, setName, setThisPlayerId } = usePlayerInfo();

    const navigate = useNavigate();


    const HandleJoinedLobby = useCallback((data) => {
        setName(data.name);
        setThisPlayerId(data.playerId);
        setLobbyCode(data.lobbyCode);
        console.log(data.playerId + " " + data.name + " " + data.lobbyCode);
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
            <div>
                <h1>Join lobby</h1>
                <input type="text" placeholder="Enter username" value={name} onChange={e => { setName(e.target.value) }} />
                <input type="text" placeholder="Enter lobby code" value={lobbyCode} onChange={e => { setLobbyCode(e.target.value) }} />
                <button className="button-50" onClick={() => { socket.emit("join-lobby", { name, lobbyCode }) }}> Join Lobby </button>
            </div>
        </div>
    )
}

export default JoinLobbyPage;