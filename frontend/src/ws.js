import React, { useEffect, useState, useRef } from "react"
import './ws.css';
import io from 'socket.io-client';

// connect on the server
const serverUrl = "http://localhost:3000";
const socket = io.connect(serverUrl);

const WS = () =>{
    const inputRef = useRef();
    const messagesRef = useRef();
    const [messages, setMessages] = useState([]); // chat
    const [clients, setClients] = useState([]); // list of online clients
    const [clientId, setClientId] = useState(''); // who i chat with

    const submitHandler = (e) =>{
        e.preventDefault();
        if (clientId) {
            socket.emit('chat specific client', clientId, socket.id, inputRef.current.value);
            inputRef.current.value = ''; 
        }
    }

    useEffect(() =>{
        socket.on('init clients list', (clientIds) => {
            const clietsWithoutMe = clientIds.filter(client => client !== socket.id);
            setClients(clietsWithoutMe);
        })
        socket.on('connect specific client', (socketId) => {
            setClientId(socketId);
          });
        socket.on('chat specific client message', function(msg) {
            setMessages((prev) => [...prev, msg]);
          });
        socket.on('group chat message', function(msg) {
            setMessages((prev) => [...prev, msg])
          });
        socket.on('group chat clients', function(msg) {
            setClients((prev) => [...prev, msg]);
            console.log('sockedid to add ', msg);
          });
          
    }, [])

    const handleClickClient = (clientId) =>{
        setClientId(clientId);
        socket.emit('connect specific client', clientId, socket.id);
    }

    return(
        <div className="container">
            <aside >
                <h2>Private chat</h2>
                <ul ref={messagesRef} id="messages">
                    {
                        clients.map((client) => <li key={Math.ceil(Math.random() * 10000)}><button onClick={()=>handleClickClient(client)}>{client}</button></li>)
                    }
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


export default WS;