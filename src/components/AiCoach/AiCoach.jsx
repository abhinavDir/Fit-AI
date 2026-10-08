import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  FaPaperPlane,
  FaUserAlt,
  FaRobot,
  FaBolt,
  FaSync,
  FaShieldAlt
} from 'react-icons/fa';
import './AiCoach.css';

const AiCoach = () => {
  const [messages, setMessages] = useState([
    { role: 'model', content: "FitCoach active. Ready to guide your training. What are we crushing today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8787/api/coach/chat", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: updatedMessages,
          message: userMessage
        })
      });

      if (!res.ok) throw new Error("Coach connection unstable.");

      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        setMessages(prev => {
          const newMsg = [...prev];
          newMsg[newMsg.length - 1].content = fullResponse;
          return newMsg;
        });
      }

    } catch (error) {
      console.error("Coach API Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Connection lost. Please regroup and try again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="coach-page">
      <div className="coach-wrapper">
        <aside className="coach-sidebar">
          <div className="coach-brand">
            <div className="avatar-container">
              <FaRobot className="avatar-icon" />
              <div className="status-dot"></div>
            </div>
            <div className="brand-text">
              <h2>FitCoach AI</h2>
            </div>
          </div>

          <div className="sidebar-nav">
            <div className="nav-group">
              <span className="group-label">SESSION</span>
              <div className="nav-item active">
                <FaBolt /> <span>Live Training</span>
              </div>
              <div className="nav-item">
                <FaShieldAlt /> <span>Secure Chat</span>
              </div>
            </div>
          </div>

          <div className="sidebar-stats">
            <div className="stat-card">
              <span className="stat-label">Neural Sync</span>
              <div className="stat-progress"><div className="progress-fill" style={{ width: '94%' }}></div></div>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="sync-info">
              <FaSync className="spin-icon" /> <span>Cloud Optimized</span>
            </div>
          </div>
        </aside>

        <main className="coach-main">
          <header className="main-header">
            <div className="header-meta">
              <h3>FitCoach AI</h3>
            </div>
          </header>

          <div className="messages-container">
            {messages.map((message, idx) => (
              <div key={idx} className={`msg-node ${message.role}`}>
                <div className="msg-bubble">
                  {message.role === 'model' ? (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  ) : (
                    <span>{message.content}</span>
                  )}
                </div>
              </div>
            ))}
            {isLoading && !messages[messages.length - 1].content && (
              <div className="coach-thinking">
                <div className="dot-pulse"><span></span><span></span><span></span></div>
                <span>Coach is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <footer className="input-container">
            <form onSubmit={handleSend} className="modern-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Talk to your coach..."
                disabled={isLoading}
              />
              <button type="submit" className="submit-btn" disabled={isLoading || !input.trim()}>
                <FaPaperPlane />
              </button>
            </form>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AiCoach;
