import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { MyChatBoxContext } from '../../configs/Contexts';
import { getChatRoomId } from '../../utils/chatUtils';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import rolesAndStatus from '../../utils/rolesAndStatus';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import './ChatBox.scss';

const ChatBox = ({ receiver, user }) => {
    const { isOpen, setIsOpen } = useContext(MyChatBoxContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const [receiverInfo, setReceiverInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [hasMoreOlder, setHasMoreOlder] = useState(true);
    const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const messagesEndRef = useRef(null);
    const messagesStartRef = useRef(null);
    const chatBodyRef = useRef(null);
    const unsubscribeRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const chatRoomId = getChatRoomId(user.id, receiver.id);
    const messagesPerPage = 15;

    const scrollToBottom = useCallback(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, []);

    const fetchReceiverInfo = useCallback(async () => {
        if (!receiver?.id || !receiver?.role) return;

        try {
            let endpoint = '';
            if (receiver.role === rolesAndStatus.company) {
                endpoint = endpoints['getCandidateByUserId'](receiver.id);
            } else if (receiver.role === rolesAndStatus.candidate) {
                endpoint = endpoints['getCandidateByUserId'](receiver.id);
            } else {
                throw new Error('Invalid receiver role');
            }

            const res = await authApis().get(endpoint);
            if (res.status === 200) {
                if (receiver.role === rolesAndStatus.company) {
                    setReceiverInfo({
                        name: res.data.name || receiver.id,
                        avatar: res.data.avatar || '/default-avatar.png',
                    });
                } else {
                    setReceiverInfo({
                        name: res.data.fullName || receiver.id,
                        avatar: res.data.avatar || '/default-avatar.png',
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching receiver info:', error);
            setReceiverInfo({
                name: receiver.id,
                avatar: '/default-avatar.png',
            });
        }
    }, [receiver]);

    useEffect(() => {
        if (!isOpen || !chatRoomId) return;

        fetchReceiverInfo();

        return () => {
            setReceiverInfo(null);
        };
    }, [isOpen, chatRoomId, fetchReceiverInfo]);

    const handleClose = () => {
        setIsOpen(false);
        setMessages([]);
        setNewMessage('');
        setHoveredMessageId(null);
        setReceiverInfo(null);
        setHasMoreOlder(true);
        setLoadingOlder(false);
        setLoading(true);
        setLastMessageTimestamp(null);
        setShouldScrollToBottom(true);
        setSelectedFiles((prev) => {
            prev.forEach(({ preview }) => {
                if (preview) URL.revokeObjectURL(preview);
            });
            return [];
        });
    };

    if (!isOpen || !receiverInfo) return null;

    return (
        <div className="chat-box">
            <ChatHeader receiverInfo={receiverInfo} handleClose={handleClose} />
            <ChatBody
                messages={messages}
                setMessages={setMessages}
                receiverInfo={receiverInfo}
                user={user}
                chatRoomId={chatRoomId}
                messagesPerPage={messagesPerPage}
                loading={loading}
                setLoading={setLoading}
                loadingOlder={loadingOlder}
                setLoadingOlder={setLoadingOlder}
                hasMoreOlder={hasMoreOlder}
                setHasMoreOlder={setHasMoreOlder}
                lastMessageTimestamp={lastMessageTimestamp}
                setLastMessageTimestamp={setLastMessageTimestamp}
                shouldScrollToBottom={shouldScrollToBottom}
                setShouldScrollToBottom={setShouldScrollToBottom}
                messagesEndRef={messagesEndRef}
                messagesStartRef={messagesStartRef}
                chatBodyRef={chatBodyRef}
                unsubscribeRef={unsubscribeRef}
                scrollToBottom={scrollToBottom}
                hoveredMessageId={hoveredMessageId}
                setHoveredMessageId={setHoveredMessageId}
            />
            <ChatFooter
                chatRoomId={chatRoomId}
                user={user}
                receiver={receiver}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                fileInputRef={fileInputRef}
                imageInputRef={imageInputRef}
                loading={loading}
                setLoading={setLoading}
                scrollToBottom={scrollToBottom}
                setShouldScrollToBottom={setShouldScrollToBottom}
            />
        </div>
    );
};

export default ChatBox;