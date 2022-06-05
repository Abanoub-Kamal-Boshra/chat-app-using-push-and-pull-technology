import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
const _URL = 'http://localhost:3000'

function ShortPolling() {
    const [messages, setMessages] = useState([]);
    const inputRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = inputRef.current.value;
        inputRef.current.value = "";
        axios
            .post(`${_URL}/messages`, { message })
            .then()
    }

    useEffect(() => {
        const messageInterval = setInterval(() => {
            axios
                .get(`${_URL}/messages/${messages.length}`)
                .then(({ data }) => {
                    setMessages((prev) => [...prev, ...data])
                    clearInterval(messageInterval);
                })
        }, 2000)
    }, [messages])

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>Message </label>
                <input
                    type="text"
                    name="message"
                    id="message"
                    placeholder='Enter your message'
                    required
                    ref={inputRef}
                />
            </form>
            <section>
                <h2>Messages</h2>
                <ul>
                    {
                        messages.map((message) => <li key={Math.ceil(Math.random() * 10000)}>{message}</li>)
                    }
                </ul>
            </section>
        </>
    )
}

export default ShortPolling;