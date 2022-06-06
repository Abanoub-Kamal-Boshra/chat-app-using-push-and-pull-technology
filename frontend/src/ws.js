import React, { useEffect, useState, useRef } from "react"
import './ws.css';
import io from 'socket.io-client';

// connect on the server
const serverUrl = "http://localhost:3000";
const socket = io(serverUrl);

const WS = () =>{
    const inputRef = useRef();
    const messagesRef = useRef();
    const [messages, setMessages] = useState([]);
    const [clients, setClients] = useState([]);
    const [clientId, setClientId] = useState('');
    // a way to overcome on twice socket connecting
    // const [count, setCount] = useState(0);

    console.log('My socketID: ', socket.id);

    const submitHandler = (e) =>{
        console.log('11111111115');
        e.preventDefault();
        if (clientId) {
            socket.emit('chat specific client', clientId, socket.id, inputRef.current.value);
            inputRef.current.value = '';
        }
    }

    useEffect(() =>{
        socket.on('group chat message', function(msg) {
            setMessages((prev) => [...prev, msg])
            console.log('11111111111');
          });
        socket.on('group chat clients', function(msg) {
            setClients((prev) => [...prev, msg]);
                
            console.log('11111111112');
            // console.log('count ' ,count);
            console.log('sockedid to add ', msg);
          });
        socket.on('connect specific client', (socketId) => {
            setClientId(socketId);
            console.log('11111111113');
          });
        socket.on('chat specific client message', function(msg) {
            setMessages((prev) => [...prev, msg]);
            console.log('11111111114');
          });
    }, [])

    const handleClickClient = (clientId) =>{
        console.log('Connect with ', clientId);
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