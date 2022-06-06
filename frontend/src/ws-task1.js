import React, { useEffect, useState, useRef } from "react"
import './ws.css';
import io from 'socket.io-client';

// connect on the server
const serverUrl = "http://localhost:3000";
const socket = io(serverUrl);

const WSgroupChat = () =>{
    const inputRef = useRef();
    const messagesRef = useRef();
    const [messages, setMessages] = useState([]);

    const submitHandler = (e) =>{
        e.preventDefault();
        if (inputRef.current.value) {
            socket.emit('server group chat message', inputRef.current.value);
            inputRef.current.value = '';
        }
    }

    useEffect(() =>{
        socket.on('group chat message', function(msg) {
            setMessages((prev) => [...prev, msg])
          });
    }, [])

    return(
        <div className="container">
            <aside >
                <ul ref={messagesRef} id="messages">
                    <h2>Group chat</h2>
                </ul>
            </aside>
            <section >
                <ul ref={messagesRef} id="messages">
                    {
                        messages.map((message) => <li key={Math.ceil(Math.random() * 10000)}>{message}</li>)
                    }
                </ul>
                <form id="form" onSubmit={submitHandler}>
                    <input 
                        placeholder="Enter your message" 
                        id="input" 
                        ref={inputRef} 
                        required
                    />
                    <button>Send</button>
                </form>
            </section>
        </div>
    )
} 


export default WSgroupChat;