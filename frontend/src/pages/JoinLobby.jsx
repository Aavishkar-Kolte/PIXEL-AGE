import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../providers/Socket';
import { usePlayerInfo } from '../providers/PlayerInfo';
import { Header } from '../components/Header';


function JoinLobbyPage() {
    const { socket } = useSocket();
    const { lobbyCode, setLobbyCode, name, setName, setThisPlayerId, setIsGameHost } = usePlayerInfo();

    useEffect(() => {
        setLobbyCode("")
        setName("")
    }, [])

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
        socket.on("lobby-not-found", (data) => {
            console.log("not found");
            alert(`Could not find lobby with lobby code: ${data.lobbyCode}. Please try again`);
        });


        return () => {
            socket.off("joined-lobby", HandleJoinedLobby);
            socket.off("lobby-not-found", (data) => {
                alert(`Could not find lobby with lobby code: ${data.lobbyCode}. Please try again.`)
            });
        }
    }, [socket, HandleJoinedLobby])

    const handleSubmit = () => {
        if (name != "" && lobbyCode != "") {
            socket.emit("join-lobby", { name, lobbyCode });
        } else if (name == "" && lobbyCode == "") {
            alert("Please fill out all the fields.")
        } else {
            if (name == "") {
                alert("Please enter a valid player name. The field cannot be left empty.")
            } else if (lobbyCode == "") {
                alert("Please enter a valid lobby code. The field cannot be left empty.")
            }
        }
    }


    return (
        <div className='joinlobbypage-container'>
            <Header />
            <div className="form-div">
                <input type="text" placeholder="player name" value={name} onChange={e => { if (e.target.value.length <= 15) setName(e.target.value); }} />
                <input type="text" placeholder="lobby code" value={lobbyCode} onChange={e => { if (e.target.value.length <= 4) setLobbyCode(e.target.value) }} />
                <button className="button-confirm" onClick={handleSubmit}> JOIN-LOBBY </button>
                <h3 id='home-vp-text'>2-PLAYER ONLINE GAME THAT YOU CAN PLAY WITH YOUR FRIENDS.</h3>
            </div>
        </div>
    )
}

export default JoinLobbyPage;