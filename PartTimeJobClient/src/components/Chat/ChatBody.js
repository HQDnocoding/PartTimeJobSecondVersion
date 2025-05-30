import React, { useEffect, useCallback, useState, memo, useContext } from 'react';
import {
    fetchRecentMessages,
    fetchOlderMessages,
    listenMessages,
    markMessagesAsRead,
} from '../../utils/chatUtils';
import { MyChatBoxContext } from '../../configs/Contexts';

const ChatBody = ({
    messages,
    setMessages,
    receiverInfo,
    user,
    chatRoomId,
    messagesPerPage,
    loading,
    setLoading,
    loadingOlder,
    setLoadingOlder,
    hasMoreOlder,
    setHasMoreOlder,
    lastMessageTimestamp,
    setLastMessageTimestamp,
    shouldScrollToBottom,
    setShouldScrollToBottom,
    messagesEndRef,
    messagesStartRef,
    chatBodyRef,
    unsubscribeRef,
    scrollToBottom,
    hoveredMessageId,
    setHoveredMessageId,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const { isOpen, setIsOpen } = useContext(MyChatBoxContext);

    const openImageModal = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setIsModalOpen(true);
    };

    const closeImageModal = () => {
        setSelectedImageUrl(null);
        setIsModalOpen(false);
    };
    const loadRecentMessages = useCallback(async () => {
        setLoading(true);
        try {
            const recentMessages = await fetchRecentMessages(chatRoomId, messagesPerPage);
            const formattedMessages = recentMessages.map((msg) => ({
                id: msg.id,
                text: msg.message,
                sender: msg.senderId === user.id ? 'me' : 'you',
                timestamp: msg.createdAt
                    ? new Date(msg.createdAt.seconds * 1000).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                    : 'Just now',
                read: msg.read,
                createdAt: msg.createdAt,
                type: msg.type || 'text',
                fileUrl: msg.fileUrl || null,
            }));
            setMessages(formattedMessages);
            setHasMoreOlder(formattedMessages.length === messagesPerPage);
            if (formattedMessages.length > 0) {
                setLastMessageTimestamp(formattedMessages[formattedMessages.length - 1].createdAt);
            }
            setShouldScrollToBottom(true);
        } catch (error) {
            console.error('Error loading recent messages:', error);
        } finally {
            setLoading(false);
        }
    }, [chatRoomId, messagesPerPage, setMessages, setHasMoreOlder, setLastMessageTimestamp, setShouldScrollToBottom, setLoading]);

    const loadOlderMessages = useCallback(async () => {
        if (!chatRoomId || !hasMoreOlder || loadingOlder) return;

        setLoadingOlder(true);
        try {
            const lastMessage = messages[0];
            const olderMessages = await fetchOlderMessages(chatRoomId, lastMessage, messagesPerPage);
            const formattedOlderMessages = olderMessages.map((msg) => ({
                id: msg.id,
                text: msg.message,
                sender: msg.senderId === user.id ? 'me' : 'you',
                timestamp: msg.createdAt
                    ? new Date(msg.createdAt.seconds * 1000).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                    : 'Just now',
                read: msg.read,
                createdAt: msg.createdAt,
                type: msg.type || 'text',
                fileUrl: msg.fileUrl || null,
            }));

            setMessages((prev) => [...formattedOlderMessages, ...prev]);
            setHasMoreOlder(formattedOlderMessages.length === messagesPerPage);
            setShouldScrollToBottom(false);
        } catch (error) {
            console.error('Error loading older messages:', error);
        } finally {
            setLoadingOlder(false);
        }
    }, [chatRoomId, messages, hasMoreOlder, loadingOlder, setMessages, setHasMoreOlder, setShouldScrollToBottom, setLoadingOlder]);

    const handleScroll = useCallback(() => {
        const chatBody = chatBodyRef.current;
        if (chatBody && chatBody.scrollTop < 10 && hasMoreOlder && !loadingOlder) {
            loadOlderMessages();
        }
    }, [hasMoreOlder, loadingOlder, loadOlderMessages]);

    useEffect(() => {
        if (!chatRoomId) return;

        loadRecentMessages();

        return () => {
            setMessages([]);
            setLastMessageTimestamp(null);
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
        };
    }, [chatRoomId, loadRecentMessages, setMessages, setLastMessageTimestamp]);

    useEffect(() => {
        if (!chatRoomId || loading) return;

        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }

        // const listenTimestamp = messages.length === 0 ? new Date() : lastMessageTimestamp;

        const listenTimestamp = messages.length === 0 ? null : lastMessageTimestamp;
        unsubscribeRef.current = listenMessages(chatRoomId, listenTimestamp, (newMessages) => {
            console.log('New messages received:', newMessages);
            const formattedNewMessages = newMessages.map((msg) => ({
                id: msg.id,
                text: msg.message,
                sender: msg.senderId === user.id ? 'me' : 'you',
                timestamp: msg.createdAt
                    ? new Date(msg.createdAt.seconds * 1000).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                    : 'Just now',
                read: msg.read,
                createdAt: msg.createdAt,
                type: msg.type || 'text',
                fileUrl: msg.fileUrl || null,
            }));

            const uniqueNewMessages = formattedNewMessages.filter(
                (newMsg) => !messages.some((prevMsg) => prevMsg.id === newMsg.id)
            );
            console.log('Unique new messages:', uniqueNewMessages);
            if (uniqueNewMessages.length > 0) {
                setMessages((prev) => {
                    const updatedMessages = [...prev, ...uniqueNewMessages];
                    console.log('Updated messages:', updatedMessages); // Debug log
                    return updatedMessages;
                });
                setLastMessageTimestamp(uniqueNewMessages[uniqueNewMessages.length - 1].createdAt);
                markMessagesAsRead(chatRoomId, user.id, [...messages, ...uniqueNewMessages]);
                setShouldScrollToBottom(true);
            }
        });

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [isOpen, chatRoomId, user.id, loading, messages, lastMessageTimestamp, setMessages, setLastMessageTimestamp, setShouldScrollToBottom]);

    useEffect(() => {
        if (!loading && messages.length > 0 && shouldScrollToBottom) {
            scrollToBottom();
        }
    }, [messages, loading, shouldScrollToBottom, scrollToBottom]);

    const renderMessageContent = (msg) => {
        if (msg.type === 'image') {
            return (
                <div className="message-image">
                    <img src={msg.fileUrl} alt={msg.text} onClick={() => openImageModal(msg.fileUrl)} />
                </div>
            );
        } else if (msg.type === 'file') {
            return (
                <div className="message-file">
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                        {msg.text}
                    </a>
                </div>
            );
        }
        return <p>{msg.text}</p>;
    };

    return (
        <div className="chat-body" ref={chatBodyRef} onScroll={handleScroll}>

            <React.Fragment>
                {loadingOlder && (
                    <div className="loading-older">
                        <span>Đang tải tin nhắn cũ...</span>
                    </div>
                )}
                <div ref={messagesStartRef} />
                {messages.map((msg) => (
                    <div key={msg.id} className={`container ${msg.sender}`}>
                        {msg.sender === 'you' && (
                            <img src={receiverInfo.avatar} alt="avatar" className="avatar" />
                        )}
                        <div
                            className={`message ${msg.sender}`}
                            onMouseEnter={() => setHoveredMessageId(msg.id)}
                            onMouseLeave={() => setHoveredMessageId(null)}
                        >
                            {renderMessageContent(msg)}
                            <div className="message-meta">
                                <span className="timestamp">{msg.timestamp}</span>
                                {msg.sender === 'me' && hoveredMessageId === msg.id && (
                                    <span className="status">
                                        {msg.read ? 'Đã xem' : 'Đã gửi'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </React.Fragment>

            {isModalOpen && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeImageModal}>
                            <i className="bi bi-x"></i>
                        </button>
                        <img src={selectedImageUrl} alt="Full size" className="modal-image" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(ChatBody);