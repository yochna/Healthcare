import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageCircle } from 'lucide-react';
import './Chatbot.css';

const API = process.env.REACT_APP_API_URL || '';

const SUGGESTIONS = [
  'What are your working hours?',
  'How do I book an appointment?',
  'Is the service free?',
  'How can I volunteer?',
];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1, from: 'bot',
      text: "Hi! I'm HealthBot, your assistant for HealthBridge NGO.\n\nI can help you with:\n• Appointments & services\n• Volunteering info\n• Donations\n• Emergency contacts\n\nWhat can I help you with today?",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [open, messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setMessages(m => [...m, { id: Date.now(), from: 'user', text: userMsg, time: new Date() }]);
    setInput('');
    setTyping(true);
    try {
      const res = await fetch(`${API}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setTyping(false);
      setMessages(m => [...m, { id: Date.now() + 1, from: 'bot', text: data.botReply, time: new Date() }]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setTyping(false);
      setMessages(m => [...m, {
        id: Date.now() + 1, from: 'bot',
        text: "I'm having trouble connecting right now. Please call 1800-XXX-XXXX for immediate assistance.",
        time: new Date()
      }]);
    }
  };

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const fmt = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <button className={`chat-toggle ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
        {open ? <X size={20} /> : <MessageCircle size={22} />}
        {!open && unread > 0 && <span className="chat-badge">{unread}</span>}
        {!open && <span className="chat-label">Ask HealthBot</span>}
      </button>

      {open && (
        <div className="chat-window fade-in">
          <div className="chat-header">
            <div className="chat-avatar"><Bot size={24} color="white" /></div>
            <div className="chat-meta">
              <strong>HealthBot</strong>
              <span><span className="live-dot" /> Online — HealthBridge NGO</span>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}><X size={16} /></button>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg ${msg.from}`}>
                {msg.from === 'bot' && (
                  <div className="bot-avatar"><Bot size={16} color="#0a7c6e" /></div>
                )}
                <div className="msg-bubble">
                  <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                  <span className="msg-time">{fmt(msg.time)}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="chat-msg bot">
                <div className="bot-avatar"><Bot size={16} color="#0a7c6e" /></div>
                <div className="msg-bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 2 && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="chat-input-row">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
            />
            <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
