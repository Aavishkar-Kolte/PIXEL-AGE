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
        <PeerContext.Provider value={{ Peer, createOffer, createAnswer, createPeer }}>
            {props.children}
        </PeerContext.Provider>
    );
};