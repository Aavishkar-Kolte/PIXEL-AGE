import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '../providers/Socket';
import { usePlayerInfo } from '../providers/PlayerInfo';
import { usePeer } from '../providers/Peer';
import FightingGame from './FightingGame';

function LobbyPage() {
   const text = useRef(null);
   const opponentKeys = useRef({});
   const { socket } = useSocket();
   const { name, thisPlayerId } = usePlayerInfo();
   const { Peer, createOffer, createAnswer, createPeer } = usePeer();
   const dataChannelMessages = useRef(null);
   const dataChannelPlayerActionData = useRef(null);
   const opponentPlayerId = useRef('.');


   function handleClickMessage(e) {
      dataChannelMessages.current.send(text.current.value);
      text.current.value = '';
   }
   const getOpponentKeys = () => {
      return opponentKeys.current;
   }

   const handlePlayerActionDataReceived = (event) => {
      const jsonStr = event.data;
      opponentKeys.current = JSON.parse(jsonStr)
      console.log(opponentKeys.current); 
   }

   const sendPlayerActionData = (data) => {
      const jsonStr = JSON.stringify(data)
      console.log(jsonStr);
      dataChannelPlayerActionData.current.send(jsonStr);
   }


   function handleMessageReceived(event) {
      const receivedData = event.data;
      console.log('Received: ' + receivedData);
   }

   const handleNewPlayerJoined = useCallback(async (data) => {
      console.log("New player joined " + data.name);
      opponentPlayerId.current = data.playerId;
      await createPeer(handleNegotiation, handleICECandidateEvent);

      dataChannelPlayerActionData.current = Peer.current.createDataChannel("player-action-data");
      dataChannelMessages.current = Peer.current.createDataChannel("messages");
      dataChannelMessages.current.onmessage = handleMessageReceived;
      dataChannelPlayerActionData.current.onmessage = handlePlayerActionDataReceived;

   }, [createOffer, socket, opponentPlayerId]);

   const handleConnectionRequest = useCallback(async (data) => {
      const { fromName, fromPlayerId, offer } = data;
      console.log(fromName, " ", offer);
      opponentPlayerId.current = fromPlayerId;
      await createPeer(handleNegotiation, handleICECandidateEvent);
      const answer = await createAnswer(offer);
      Peer.current.ondatachannel = (event) => {
         if (event.channel.label === "player-action-data") {
            dataChannelPlayerActionData.current = event.channel;
            dataChannelPlayerActionData.current.onmessage = handlePlayerActionDataReceived;
         } else {
            dataChannelMessages.current = event.channel;
            dataChannelMessages.current.onmessage = handleMessageReceived;
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
      console.log(" i am handleICECandidateEvent ", e)
      if (e.candidate) {
         socket.emit("ice-candidate", { toPlayerId: opponentPlayerId.current, candidate: e.candidate });
      }
   }, [socket, opponentPlayerId]);

   const handleConnectionRequestAccepted = useCallback(async (data) => {
      const { answer } = data;
      await setRemoteAnswer(answer);
      console.log("connected ", answer);
   }, [setRemoteAnswer]);

   const handleNewICECandidateMsg = useCallback((data) => {
      const candidate = new RTCIceCandidate(data);
      Peer.current.addIceCandidate(candidate).catch((e) => console.log(e));
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
   }, [socket, handleNewPlayerJoined, handleConnectionRequest, handleConnectionRequestAccepted, handleNewICECandidateMsg]);


   useEffect(() => {
      socket.on("message.current", (data) => { console.log(data.str); });
   }, [socket])



   return (
      <div className='lobbypage-container'>
         <h1>Lobby Page - Game Here</h1>
         <FightingGame sendData={sendPlayerActionData} opKeys = {getOpponentKeys}/>
         <input ref={text} type="text" placeholder="Enter message" />
         <button className="button-50" onClick={handleClickMessage}> Send message</button>
      </div >
   );
}

export default LobbyPage;





