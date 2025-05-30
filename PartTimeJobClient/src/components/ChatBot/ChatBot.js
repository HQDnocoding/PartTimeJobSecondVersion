import ReactMarkdown from 'react-markdown';
import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Form, Spinner } from "react-bootstrap";
import { apisAI } from "../../configs/APIs";
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const MODEL = "deepseek/deepseek-chat-v3-0324:free";
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setMessages([{ role: "assistant", content: "🌟 Xin chào! Mình là trợ lý AI tư vấn việc làm. Bạn cần hỗ trợ gì về việc làm, CV, phỏng vấn hay định hướng nghề nghiệp? 😊" }]);
    }, []);

    const extractTextFromJSX = (jsx) => {
        if (typeof jsx === "string") return jsx;
        if (jsx && jsx.props && jsx.props.children) {
            return React.Children.toArray(jsx.props.children)
                .map(child => (typeof child === "string" ? child : extractTextFromJSX(child)))
                .join(" ");
        }
        return "";
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        const messagesForApi = newMessages.map(m => ({
            role: m.role,
            content: typeof m.content === "string" ? m.content : extractTextFromJSX(m.content)
        }));

        try {
            const res = await apisAI().post("", {
                model: MODEL,
                messages: messagesForApi
            });
            if (!res.data.choices || !res.data.choices[0]?.message?.content) {
                throw new Error("No valid response from API");
            }
            const aiReply = res.data.choices[0].message.content;
            setMessages([...newMessages, { role: "assistant", content: aiReply }]);
        } catch (err) {
            console.error("API Error:", err.response?.data || err.message);
            setMessages([...newMessages, { role: "assistant", content: `Có lỗi xảy ra, vui lòng thử lại sau. (Chi tiết lỗi: ${err.response?.status || err.message})` }]);
        } finally {
            setLoading(false);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    };

    if (!isOpen) {
        return (
            <Button
                variant="primary"
                className="chatbot-button"
                style={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    borderRadius: "50%",
                    width: 60,
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.15)"
                }}
                onClick={() => setIsOpen(true)}
            >
                <i className="bi bi-robot" style={{ fontSize: "24px" }}></i>
            </Button>
        );
    }

    return (
        <Card
            className="chatbot-card"
            style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                width: 340,
                zIndex: 9999,
                boxShadow: "0 4px 24px rgba(0,0,0,0.15)"
            }}
        >
            <Card.Header className="bg-primary text-white py-2 d-flex justify-content-between align-items-center">
                <b><i className="bi bi-robot me-2"></i>AI Tư vấn việc làm</b>
                <Button
                    variant="link"
                    className="text-white p-0"
                    onClick={() => setIsOpen(false)}
                >
                    <i className="bi bi-x-lg"></i>
                </Button>
            </Card.Header>
            <Card.Body style={{
                maxHeight: 370,
                overflowY: "auto",
                background: "#f8f9fa",
                padding: 12,
                paddingBottom: 80
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{ textAlign: msg.role === "user" ? "right" : "left", marginBottom: 8 }}>
                        <span
                            style={{
                                display: "inline-block",
                                background: msg.role === "user" ? "#0d6efd" : "#e9ecef",
                                color: msg.role === "user" ? "#fff" : "#333",
                                borderRadius: 12,
                                padding: "6px 12px",
                                maxWidth: "80%",
                                wordBreak: "break-word",
                                textAlign: "left"
                            }}
                        >
                            {typeof msg.content === "string" ? (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            ) : (
                                msg.content
                            )}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </Card.Body>
            <Card.Footer style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                background: "#fff",
                borderTop: "1px solid #dee2e6",
                padding: "8px 12px",
                height: 60
            }}>
                <Form onSubmit={sendMessage} className="d-flex gap-2">
                    <Form.Control
                        type="text"
                        placeholder="Nhập câu hỏi về việc làm..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={loading}
                        autoFocus
                    />
                    <Button type="submit" variant="primary" disabled={loading || !input.trim()}>
                        {loading ? <Spinner size="sm" animation="border" /> : <i className="bi bi-send"></i>}
                    </Button>
                </Form>
            </Card.Footer>
        </Card>
    );
};

export default ChatBot;