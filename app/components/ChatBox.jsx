'use client';
import { useState, useEffect, useRef } from "react";

export default function ChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatBoxRef = useRef();
    const messagesRef = useRef();

    useEffect(() => {
        const chatID = localStorage.getItem('chatID') || createUUID();
        localStorage.setItem('chatID', chatID);

        setTimeout(() => {
            chatBoxRef.current.classList.add('enter');
        }, 1000);
    },[]);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage =async (e) => {
        e.preventDefault()
        if(!input.trim()) return;

        const userMessage = { role:'user', content: input};
        setMessages([...messages, userMessage]);

        const response = await fetch('/api/openai/chat',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({message:input})
        })

        const data = await response.json();
        const botMessage = { role:'bot', content:data.reply.content}

        setMessages([...messages, userMessage, botMessage]);
        setInput('');
    }

    const createUUID = () =>{
        let s= [];
        let hexDigits = '0123456789abcdef';
        for (let i = 0; i <36; i++){
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }

        s[14] = '4';
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = '-';
        return s.join('');
    }

    return (
        <div ref={chatBoxRef} className="fixed bottom-4 right-4 w-80 bg-base-100 shadow-lg rounded-lg overflow-hidden">
            <div className="bg-purple-500 text-white p-2 cursor-pointer" onClick={toggleChat}>
                {isOpen ? 'Close Chat' : 'Open Chat'}
            </div>
            {isOpen && (
                <div className="p-4">
                    <div ref={messagesRef} className="h-80 overflow-y-auto mb-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`p-2 chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}>
                                <div className={`chat-bubble`}>
                                {msg.content}
                            </div>
                            </div>
                        ))}
                    </div>
                    <form className="flex" onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="input input-bordered flex-1 p-2 rounded-l-lg focus:outline-none"
                        />
                        <button type="submit" className="btn bg-purple-500 p-2 rounded-r-lg text-white">
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}