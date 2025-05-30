// Chat.js
import React, { useState, useEffect, useContext } from 'react';
import { listenMessages, getChatRoomId, sendMessage } from '../../utils/chatUtils';
import { MyUserContext } from '../../configs/Contexts';

const Chat = () => {
    const user = useContext(MyUserContext); // Lấy thông tin người dùng từ context
    const [otherUserId, setOtherUserId] = useState(''); // id của người dùng khác
    const [chatRoomId, setChatRoomId] = useState(null); // ID phòng chat
    const [messages, setMessages] = useState([]); // Danh sách tin nhắn
    const [newMessage, setNewMessage] = useState(''); // Tin nhắn mới

    // Xử lý khi chọn người dùng để chat
    const handleStartChat = () => {
        if (!otherUserId || !user?.id) {
            console.error('Invalid user IDs:', { userId: user?.id, otherUserId });
            return;
        }
        try {
            const roomId = getChatRoomId(user.id, otherUserId);
            console.log('Starting chat with roomId:', roomId);
            setChatRoomId(roomId);
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };

    // Lắng nghe tin nhắn khi chatRoomId thay đổi
    useEffect(() => {
        if (chatRoomId) {
            const unsubscribe = listenMessages(chatRoomId, (msgs) => {
                setMessages(msgs);
            });
            return () => unsubscribe();
        }
    }, [chatRoomId]);

    // Gửi tin nhắn
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() && chatRoomId && user?.id) {
            await sendMessage(chatRoomId, user.id, newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
            {!chatRoomId ? (
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={otherUserId}
                        onChange={(e) => setOtherUserId(e.target.value)}
                        placeholder="Nhập id của người dùng khác"
                        className="p-2 border rounded"
                    />
                    <button
                        onClick={handleStartChat}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Bắt đầu chat
                    </button>
                </div>
            ) : (
                <div className="flex flex-col h-96">
                    <h2 className="text-lg font-bold mb-2">Chat với {otherUserId}</h2>
                    <div className="flex-1 overflow-y-auto p-2 border rounded mb-2">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`mb-2 p-2 rounded ${msg.senderId === user.id
                                    ? 'bg-blue-100 ml-auto'
                                    : 'bg-gray-100 mr-auto'
                                    } max-w-xs`}
                            >
                                <p>{msg.message}</p>
                                <span className="text-xs text-gray-500">
                                    {msg.createdAt && msg.createdAt.toDate
                                        ? msg.createdAt.toDate().toLocaleTimeString()
                                        : 'Đang gửi...'}
                                </span>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 p-2 border rounded"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Gửi
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chat;