import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '../providers/Socket';
import { usePlayerInfo } from '../providers/PlayerInfo';
import { usePeer } from '../providers/Peer';
import FightingGameHost from './FightingGameHost';
import FightingGameClient from './FightingGameClient';
import styled from "styled-components";
import { Chat } from '../components/Chat';

const GameContainer = styled.div`
   min-width:684px;
   height: auto;
   float: left;
   padding: 10px
`;

function LobbyPage() {
   const clientState = useRef(null);
   const gameState = useRef(null);
   const { socket } = useSocket();
   const { lobbyCode, name, thisPlayerId, isGameHost } = usePlayerInfo();
   const { Peer, createOffer, createAnswer, createPeer } = usePeer();
   const dataChannelMessages = useRef(null);
   const dataChannelGameStateData = useRef(null);
   const dataChannelClientStateData = useRef(null);
   const opponentPlayerId = useRef('.');
   const opponentPlayerName = useRef(name);
   const messages = useRef([]);
   const [start, setStart] = useState(false);


   // useEffect(() => {
   //    return () => {
   //       socket.emit("delete-log", {playerId: thisPlayerId});
   //    }
   // }, [])



   function getPlayerName() {
      return name;
   }

   function getEnemyName() {
      return opponentPlayerName.current;
   }

   function getMessages() {
      return messages.current;
   }

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

   const sendGameState = (data) => {
      if (dataChannelGameStateData.current.readyState === "open") {
         const gameStateJson = JSON.stringify(data);
         //   console.log(gameStateJson);
         dataChannelGameStateData.current.send(gameStateJson);
      } else {
         console.log("Data channel for game state is not open, cannot send data.");
      }
   }

   const sendClientState = (data) => {
      if (dataChannelClientStateData.current.readyState === "open") {
         const clientStateJson = JSON.stringify(data);
         //   console.log(clientStateJson);
         dataChannelClientStateData.current.send(clientStateJson);
      } else {
         console.log("Data channel for client state is not open, cannot send data.");
      }
   }




   const handleReceivedClientStateData = (event) => {
      const clientStateJson = event.data;
      clientState.current = JSON.parse(clientStateJson)
      // console.log(clientState.current);
   }

   const handleReceivedGameStateData = (event) => {
      const gameStateJson = event.data;
      gameState.current = JSON.parse(gameStateJson)
      // console.log(gameState.current);
   }

   function handleReceivedMessages(event) {
      messages.current = [...messages.current, { yours: false, value: event.data }];
      console.log(event.data)
   }



   const getClientState = () => {
      return clientState.current;
   }

   const getGameState = () => {
      return gameState.current;
   }


   const handleNewPlayerJoined = useCallback(async (data) => {
      console.log("New player joined " + data.name);
      opponentPlayerName.current = data.name;
      opponentPlayerId.current = data.playerId;
      await createPeer(handleNegotiation, handleICECandidateEvent);

      dataChannelGameStateData.current = Peer.current.createDataChannel("game-state-data");
      dataChannelClientStateData.current = Peer.current.createDataChannel("client-state-data");
      dataChannelMessages.current = Peer.current.createDataChannel("messages");

      dataChannelGameStateData.current.onmessage = handleReceivedGameStateData;
      dataChannelClientStateData.current.onmessage = handleReceivedClientStateData;
      dataChannelMessages.current.onmessage = handleReceivedMessages;

   }, [createOffer, socket, opponentPlayerId]);

   const handleConnectionRequest = useCallback(async (data) => {
      const { fromName, fromPlayerId, offer } = data;
      opponentPlayerName.current = fromName;
      opponentPlayerId.current = fromPlayerId;
      await createPeer(handleNegotiation, handleICECandidateEvent);
      const answer = await createAnswer(offer);
      Peer.current.ondatachannel = (event) => {

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

   const setRemoteAnswer = useCallback(async (answer) => {
      const desc = new RTCSessionDescription(answer);
      await Peer.current.setRemoteDescription(desc).catch((e) => console.log(e));
   }, []);

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

   const handleICECandidateEvent = useCallback(async (e) => {
      if (e.candidate) {
         socket.emit("ice-candidate", { toPlayerId: opponentPlayerId.current, candidate: e.candidate });
      }
   }, [socket, opponentPlayerId]);



   const handleConnectionRequestAccepted = useCallback(async (data) => {
      const { answer } = data;
      await setRemoteAnswer(answer);
   }, [setRemoteAnswer]);


   const handleNewICECandidateMsg = useCallback((data) => {
      const candidate = new RTCIceCandidate(data);
      Peer.current.addIceCandidate(candidate).then(() => {
         setStart(true);
      }).catch((e) => console.log(e));
   }, []);



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



   useEffect(() => {
      socket.on("message.current", (data) => { console.log(data.str); });
   }, [socket])




   return (
      <div className='lobbypage-container'>
         <div className='game-and-chat-container'>
            <GameContainer>
               {start ? (isGameHost
                  ? <FightingGameHost sendGameState={sendGameState} getClientState={getClientState} getPlayerName={getPlayerName} getEnemyName={getEnemyName} />
                  : <FightingGameClient sendClientState={sendClientState} getGameState={getGameState} getPlayerName={getPlayerName} getEnemyName={getEnemyName} />)
                  : <div><h1>LOBBY CODE: {lobbyCode}</h1><h2>Share this code with other player</h2><h2>Please wait for another player to join...</h2></div>
               }
               <div className='ad1'>

               </div>
            </GameContainer>
            <div className='chatbox-ad-div'>
               <Chat getMessages={getMessages} sendMessage={sendMessage} />
               <div className='ad2'></div>
            </div>

         </div>
      </div>
   );
}

export default LobbyPage;





