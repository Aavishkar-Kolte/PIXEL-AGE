import React, { useEffect, useState, useRef } from "react";





export const Chat = (props) => {
    const text = useRef(null);
    const messagesContainer = useRef(null);
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        const interval = setInterval(() => {
            setMessages(props.getMessages());
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [props]);


    useEffect(() => {
        // Scroll to the bottom of the messages container whenever messages change
        if (messagesContainer.current) {
            messagesContainer.current.scrollBy(0, messagesContainer.current.scrollHeight);
        }
    }, [messages]);


    useEffect(() => {
        text.current.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                document.getElementById("chat-send-btn").click();
            }
        });
    }, [])


    function renderMessage(message, index) {
        if (message.yours) {
            return (
                <div id="chat-message-my-row" key={index}>
                    <div className="chat-my-message">
                        {message.value}
                    </div>
                </div>
            )
        }

        return (
            <div id="chat-message-opponent-row" key={index}>
                <div className="chat-opponent-message">
                    {message.value}
                </div>
            </div>
        )
    }


    return (
        <div id="chat-container">
            <div className="message-div" ref={messagesContainer}>
                {messages.map(renderMessage)}
            </div>

            <div className="width-100p">
                <div className="flex relative">
                    <input id="chat-message-input" className="form-input" ref={text} type="text" placeholder="Enter message" />
                    <button className="button1" id="chat-send-btn" onClick={() => { props.sendMessage(text) }}>Send</button>
                </div>
            </div>
        </div>

    )
}