import React, { useCallback, useRef } from "react";
const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props) => {
    const Peer = useRef(null);

    // Initialize Peer and dataChannel in a useEffect
    const createPeer = useCallback((handleNegotiation, handleICECandidateEvent) => {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302",
                },
                {
                    urls: 'TURN:freestun.net:3479',
                    credential: 'free',
                    username: 'free',
                },
            ],
        });

        peer.onnegotiationneeded = handleNegotiation;
        peer.onicecandidate = handleICECandidateEvent;

        peer.onicecandidateerror = (e) => {
            console.error(e);
        };

         Peer.current = peer;
    }, []);


    const createOffer = useCallback(async () => {
        const offer = await Peer.current.createOffer();
        await Peer.current.setLocalDescription(offer).catch((e) => console.log(e));
        return offer;
    }, []);

    const createAnswer = useCallback(async (offer) => {
        const desc = new RTCSessionDescription(offer);
        await Peer.current.setRemoteDescription(desc);
        const answer = await Peer.current.createAnswer();
        await Peer.current.setLocalDescription(answer);
        return answer;
    }, []);


    return (
        <PeerContext.Provider value={{ Peer, createOffer, createAnswer, createPeer}}>
            {props.children}
        </PeerContext.Provider>
    );
};




















// import React, { useCallback, useEffect, useRef } from "react";
// import { useSocket } from "./Socket";
// import { usePlayerInfo } from "./PlayerInfo";

// const PeerContext = React.createContext(null);

// export const usePeer = () => { return React.useContext(PeerContext) };

// export const PeerProvider = (props) => {
//     const { name, thisPlayerId, opponentPlayerId, setOpponentPlayerId } = usePlayerInfo();
//     const { socket } = useSocket();
//     const Peer = useRef();
//     const dataChannel = useRef();


//     // function handleChannelOpen() {
//     //     console.log('Data channel is open');
//     // }

//     // function handleChannelClose() {
//     //     console.log('Data channel is closed');
//     // }

//     function handleMessageReceived(event) {
//         const receivedData = event.data;
//         console.log('Received: ' + receivedData);
//     }

//     const createPeer = useCallback(() => {
//         Peer.current = () => new RTCPeerConnection({
//             iceServers: [
//                 {
//                     urls: "stun:stun.stunprotocol.org"
//                 },
//                 {
//                     urls: 'turn:numb.viagenie.ca',
//                     credential: 'muazkh',
//                     username: 'webrtc@live.com'
//                 },
//             ],
//         })

//         Peer.current.onnegotiationneeded = handleNegotiation;
//         Peer.current.onicecandidate = handleICECandidateEvent;

//         Peer.current.onicecandidate = (e) => {
//             if (!e.candidate) return;
//             console.log(e.candidate.candidate)
//         };

//         Peer.current.onicecandidateerror = (e) => {
//             console.error(e);
//         };

//     }, []);


//     const createOffer = useCallback(async () => {
//         const offer = await Peer.current.createOffer();
//         await Peer.current.setLocalDescription(offer).catch(e => console.log(e));
//         return offer;
//     }, [])

//     const createAnswer = useCallback(async (offer) => {
//         const desc = new RTCSessionDescription(offer);
//         await Peer.current.setRemoteDescription(desc);
//         const answer = await Peer.current.createAnswer();
//         await Peer.current.setLocalDescription(answer);
//         return answer;
//     }, []);

//     const handleNewPlayerJoined = useCallback(async (data) => {
//         console.log("New player joined " + data.name);
//         setOpponentPlayerId(data.playerId);
//         await createPeer();
//         dataChannel.current = Peer.current.createDataChannel("player-control-messages");
//         dataChannel.current.onmessage = handleMessageReceived;
//     }, [setOpponentPlayerId, createPeer]);


//     const handleConnectionRequest = useCallback(async (data) => {
//         const { fromName, fromPlayerId, offer } = data;
//         console.log(fromName, " ", offer);
//         setOpponentPlayerId(fromPlayerId);
//         await createPeer();
//         const answer = await createAnswer(offer);
//         Peer.current.ondatachannel = (event) => {
//             dataChannel.current = event.channel;
//             dataChannel.current.onmessage = handleMessageReceived;
//         };
//         socket.emit("connection-request-accepted", { toPlayerId: fromPlayerId, answer });



//     }, [createAnswer, setOpponentPlayerId, socket, createPeer]);

//     const setRemoteAnswer = useCallback(async (answer) => {
//         const desc = new RTCSessionDescription(answer);
//         await Peer.current.setRemoteDescription(desc).catch(e => console.log(e));
//     }, []);


//     const handleNegotiation = useCallback(async () => {
//         console.log("Negotiation needed.");
//         const offer = await createOffer();
//         socket.emit("connection-request", { fromName: name, fromPlayerId: thisPlayerId, toPlayerId: opponentPlayerId, offer });
//     }, [createOffer, name, opponentPlayerId, socket, thisPlayerId]);

//     const handleICECandidateEvent = useCallback(async (e) => {
//         if (e.candidate) {
//             socket.emit("ice-candidate", { toPlayerId: opponentPlayerId, candidate: e.candidate });
//         }
//     }, [opponentPlayerId, socket])

//     const handleConnectionRequestAccepted = useCallback(async (data) => {
//         const { answer } = data;
//         await setRemoteAnswer(answer);
//         console.log("connected ", answer);
//     }, [setRemoteAnswer]);












//     const handleNewICECandidateMsg = useCallback((data) => {
//         const candidate = new RTCIceCandidate(data);
//         Peer.current.addIceCandidate(candidate).catch(e => console.log(e));
//     }, [Peer]);



//     useEffect(() => {
//         socket.on("new-player-joined", handleNewPlayerJoined);
//         socket.on("connection-request", handleConnectionRequest);
//         socket.on("connection-request-accepted", handleConnectionRequestAccepted);
//         socket.on("ice-candidate", handleNewICECandidateMsg);

//         return () => {
//             socket.off("new-player-joined", handleNewPlayerJoined);
//             socket.off("connection-request", handleConnectionRequest);
//             socket.off("connection-request-accepted", handleConnectionRequestAccepted);
//         };
//     }, [socket, handleNewPlayerJoined, handleConnectionRequest, handleConnectionRequestAccepted, Peer, handleICECandidateEvent, handleNegotiation, handleNewICECandidateMsg]);


//     return (
//         <PeerContext.Provider value={{ Peer, createOffer, createAnswer, setRemoteAnswer, createPeer, dataChannel }}>
//             {props.children}
//         </PeerContext.Provider>
//     )
// }