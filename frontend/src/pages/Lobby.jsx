import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '../providers/Socket';
import { usePlayerInfo } from '../providers/PlayerInfo';
import { usePeer } from '../providers/Peer';
import FightingGameHost from '../components/FightingGameHost';
import FightingGameClient from '../components/FightingGameClient';
import { Chat } from '../components/Chat';
import { useNavigate } from 'react-router-dom';
import { MatchmakingAnimation } from '../components/MatchmakingAnimation';
import { timer } from '../utils/Timer';

function LobbyPage() {
   // Using custom hooks to access player information, socket connection, and WebRTC peer connection
   const { lobbyCode, setLobbyCode, name, setName, thisPlayerId, isGameHost, isPlayOnline } = usePlayerInfo();
   const { Peer, createOffer, createAnswer, createPeer } = usePeer();
   const { socket } = useSocket();
   const navigate = useNavigate();

   // Using useRef to maintain mutable variables across re-renders
   const clientState = useRef(null);
   const gameState = useRef(null);
   const dataChannelMessages = useRef(null);
   const dataChannelGameStateData = useRef(null);
   const dataChannelClientStateData = useRef(null);
   const opponentPlayerId = useRef('.');
   const opponentPlayerName = useRef(name);
   const messages = useRef([]);
   const time = useRef(0);
   const timerId = useRef(null);
   const timerSpan = useRef(null);

   // Using useState to manage component-level state
   const [start, setStart] = useState(false);
   const [cancelFlag, setCancelFlag] = useState(false)

   function getPlayerName() {
      return name;
   }

   function getEnemyName() {
      return opponentPlayerName.current;
   }

   function getMessages() {
      return messages.current;
   }

   const getClientState = () => {
      return clientState.current;
   }

   const getGameState = () => {
      return gameState.current;
   }

   // Function to send chat message
   function sendMessage(text) {
      if (dataChannelMessages.current.readyState === "open") {
         if (text.current.value !== '') {
            dataChannelMessages.current.send(text.current.value);
            messages.current = [...messages.current, { yours: true, value: text.current.value }];
            text.current.value = '';
         }
      } else {
         console.log("Data channel is not open, cannot send message.");
      }
   }

   // Function to send game state data
   const sendGameState = (data) => {
      if (dataChannelGameStateData.current.readyState === "open") {
         const gameStateJson = JSON.stringify(data);
         dataChannelGameStateData.current.send(gameStateJson);
      } else {
         console.log("Data channel for game state is not open, cannot send data.");
      }
   }

   // Function to send client state data
   const sendClientState = (data) => {
      if (dataChannelClientStateData.current.readyState === "open") {
         const clientStateJson = JSON.stringify(data);
         dataChannelClientStateData.current.send(clientStateJson);
      } else {
         console.log("Data channel for client state is not open, cannot send data.");
      }
   }

   // Callback function to handle received client state data
   const handleReceivedClientStateData = (event) => {
      const clientStateJson = event.data;
      clientState.current = JSON.parse(clientStateJson)
   }

   // Callback function to handle received game state data
   const handleReceivedGameStateData = (event) => {
      const gameStateJson = event.data;
      gameState.current = JSON.parse(gameStateJson)
   }

   // Callback function to handle received messages
   function handleReceivedMessages(event) {
      messages.current = [...messages.current, { yours: false, value: event.data }];
      console.log(event.data)
   }

   // Callback function to handle when a new player joins
   const handleNewPlayerJoined = useCallback(async (data) => {
      console.log("New player joined " + data.name);
      opponentPlayerName.current = data.name;
      opponentPlayerId.current = data.playerId;
      await createPeer(handleNegotiation, handleICECandidateEvent);

      // Create data channels for communication
      dataChannelGameStateData.current = Peer.current.createDataChannel("game-state-data");
      dataChannelClientStateData.current = Peer.current.createDataChannel("client-state-data");
      dataChannelMessages.current = Peer.current.createDataChannel("messages");

      // Set event handlers for data channels
      dataChannelGameStateData.current.onmessage = handleReceivedGameStateData;
      dataChannelClientStateData.current.onmessage = handleReceivedClientStateData;
      dataChannelMessages.current.onmessage = handleReceivedMessages;

   }, [createOffer, socket, opponentPlayerId]);

   // Callback function to handle connection request
   const handleConnectionRequest = useCallback(async (data) => {
      const { fromName, fromPlayerId, offer } = data;
      opponentPlayerName.current = fromName;
      opponentPlayerId.current = fromPlayerId;
      await createPeer(handleNegotiation, handleICECandidateEvent);
      const answer = await createAnswer(offer);
      Peer.current.ondatachannel = (event) => {
         // Switch to handle different types of data channels
         switch (event.channel.label) {
            case "game-state-data":
               dataChannelGameStateData.current = event.channel;
               dataChannelGameStateData.current.onmessage = handleReceivedGameStateData;
               break;
            case "client-state-data":
               dataChannelClientStateData.current = event.channel;
               dataChannelClientStateData.current.onmessage = handleReceivedClientStateData;
               break;
            case "messages":
               dataChannelMessages.current = event.channel;
               dataChannelMessages.current.onmessage = handleReceivedMessages;
               break;
            default:
               break;
         }
      };
      socket.emit("connection-request-accepted", { toPlayerId: fromPlayerId, answer });
   }, [createAnswer, socket]);

   // Function to set remote answer
   const setRemoteAnswer = useCallback(async (answer) => {
      const desc = new RTCSessionDescription(answer);
      await Peer.current.setRemoteDescription(desc).catch((e) => console.log(e));
   }, []);

   // Callback function to handle negotiation
   const handleNegotiation = useCallback(async () => {
      console.log("Negotiation needed.");
      const offer = await createOffer();
      socket.emit("connection-request", {
         fromName: name,
         fromPlayerId: thisPlayerId,
         toPlayerId: opponentPlayerId.current,
         offer,
      });
   }, [createOffer, socket, opponentPlayerId]);

   // Callback function to handle ICE candidate event
   const handleICECandidateEvent = useCallback(async (e) => {
      if (e.candidate) {
         socket.emit("ice-candidate", { toPlayerId: opponentPlayerId.current, candidate: e.candidate });
      }
   }, [socket, opponentPlayerId]);

   // Callback function to handle connection request accepted
   const handleConnectionRequestAccepted = useCallback(async (data) => {
      const { answer } = data;
      await setRemoteAnswer(answer);
   }, [setRemoteAnswer]);

   // Callback function to handle new ICE candidate message
   const handleNewICECandidateMsg = useCallback((data) => {
      const candidate = new RTCIceCandidate(data);
      Peer.current.addIceCandidate(candidate).then(() => {
         setStart(true);
      }).catch((e) => console.log(e));
   }, []);

   // Effect hook to set up socket event listeners
   useEffect(() => {
      socket.on("new-player-joined", handleNewPlayerJoined);
      socket.on("connection-request", handleConnectionRequest);
      socket.on("connection-request-accepted", handleConnectionRequestAccepted);
      socket.on("ice-candidate", handleNewICECandidateMsg);

      return () => {
         socket.off("new-player-joined", handleNewPlayerJoined);
         socket.off("connection-request", handleConnectionRequest);
         socket.off("connection-request-accepted", handleConnectionRequestAccepted);
         socket.off("ice-candidate", handleNewICECandidateMsg);
      };
   }, [socket]);

   // Effect hook to clear timer when the game starts
   useEffect(() => {
      if (timerId.current)
         clearTimeout(timerId.current);
   }, [start]);

   // Effect hook to start the timer
   useEffect(() => {
      timer(time, timerId, timerSpan, setCancelFlag, cancelFlag);
   }, []);

   // Function to handle cancel matchmaking
   const handleCancelMatchmaking = () => {
      socket.emit("delete-log", { playerId: thisPlayerId });
      setName('');
      setLobbyCode('');
      navigate("/");
   }

   return (
      <div className='flex flex-center flex-column background-img width-100p height-100vh'>
         <div id='game-and-chat-outer-container'>
            {start ?
               (
                  <div id='game-and-chat-container'>
                     <div>
                        {isGameHost ?
                           <FightingGameHost sendGameState={sendGameState} getClientState={getClientState} getPlayerName={getPlayerName} getEnemyName={getEnemyName} />
                           : <FightingGameClient sendClientState={sendClientState} getGameState={getGameState} getPlayerName={getPlayerName} getEnemyName={getEnemyName} />
                        }
                        {/* <div className='ad1'>

                        </div> */}
                     </div>
                     <div className="width-100p height-100p">
                        <Chat getMessages={getMessages} sendMessage={sendMessage} />
                        {/* <div className='ad1'>

                        </div> */}
                     </div>
                  </div>
               )
               : (
                  isPlayOnline ?
                     <div id='lobby-wait-container'>
                        <div>
                           <h1>MATCHMAKING</h1>
                        </div>

                        <MatchmakingAnimation />
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                           <h3>Search time: <span ref={timerSpan}>0:00</span></h3>
                           <br />
                           {(cancelFlag ?
                              <>
                                 <h5 style={{ width: "30%" }}>We apologize for extended matchmaking times. Currently, there are fewer players online. We appreciate your patience as we work to improve the situation.</h5>
                                 <br />
                                 <button className='button2' onClick={handleCancelMatchmaking}>Cancel Matchmaking</button>
                              </>

                              : null)}
                        </div>
                     </div>

                     :

                     <div id='lobby-wait-container'>
                        <div>
                           <h1 className='text-center'>LOBBY CODE: {lobbyCode}</h1>
                           <h4>Share this code with a friend to join the game</h4>
                        </div>
                        <MatchmakingAnimation />

                        <h4>Please wait for your friend to join</h4>
                     </div>
               )
            }
         </div>
      </div>
   );
}

export default LobbyPage;
