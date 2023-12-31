import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";


const Messages = styled.div`
    width: 100%;
    min-height: 200px;
    margin-top: 10px;
    overflow: scroll;
    overflow-x: hidden;
    border-radius: 5px;
    padding: 5px;
    margin: 0px 10px 10px 10px;
    box-sizing: border-box;
    background: #efdfc200;
    background-color: rgba(235, 223, 200,0.6);
    gap: 20px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    align-items: center;
`;

const Container = styled.div`
    height: 100%;
    box-sizing: border-box;
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid black;
    border-radius: 5px;
    --input-focus: #2d8cf0;
    --font-color: #221301;
    --font-color-sub: #666;
    --bg-color: #ebdfc8;
    --main-color: #221301;
    padding: 20px;
    background: #efdfc200;
    background-color: rgba(235, 223, 200,0.5);
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 0px 2px var(--main-color);
    align-items: center;
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
  width: 45%;
  background-color: #174187;
  color: white;
  padding: 10px;
  margin-right: 5px;
  text-align: center;
  border-radius: 5px;
  word-wrap: break-word; 
  border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 2px 2px var(--main-color);  
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  width: 45%;
  background-color: #A0251E;
  color: white;
  border: 1px solid lightgray;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  border-radius: 5px;
  word-wrap: break-word;  
  border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 2px 2px var(--main-color); 
`;



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
    }, []);

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
                document.getElementById("send").click();
            }
        });
    }, [])


    function renderMessage(message, index) {
        if (message.yours) {
            return (
                <MyRow key={index}>
                    <MyMessage>
                        {message.value}
                    </MyMessage>
                </MyRow>
            )
        }

        return (
            <PartnerRow key={index}>
                <PartnerMessage>
                    {message.value}
                </PartnerMessage>
            </PartnerRow>
        )
    }
    return (
        <div id="chat-div">
            <Container>
                <Messages ref={messagesContainer}>
                    {messages.map(renderMessage)}
                </Messages>

                <div class="message-input-div">
                    <div class="embed-submit-field">
                        <input ref={text} type="text" placeholder="Enter message" />
                        <button className="button-confirm" id="send" onClick={() => { props.sendMessage(text) }}>Send</button>
                    </div>
                </div>
            </Container>
        </div>
    )
}