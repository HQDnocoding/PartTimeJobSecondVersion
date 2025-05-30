import { memo, useContext, useEffect, useState } from 'react';
import { NavDropdown, Spinner } from 'react-bootstrap';
import { collection, query, where, limit, startAfter, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../configs/FireBaseConfigs';
import { MyUserContext, MyChatBoxContext, MyReceiverContext } from '../../configs/Contexts';
import './ChatDropdown.scss';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import rolesAndStatus from '../../utils/rolesAndStatus';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ChatDropdown = () => {
    const user = useContext(MyUserContext);
    const { receiver, setReceiver } = useContext(MyReceiverContext);
    const { isOpen, setIsOpen } = useContext(MyChatBoxContext);

    const [chatRooms, setChatRooms] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const chatsPerPage = 5;

    const getReceiverInfo = async (receiverId, receiverRole) => {
        try {
            let endpoint = '';
            if (receiverRole === rolesAndStatus.company) {
                endpoint = endpoints['getCompanyByUserId'](receiverId);
            } else if (receiverRole === rolesAndStatus.candidate) {
                endpoint = endpoints['getCandidateByUserId'](receiverId);
            } else {
                throw new Error('Invalid receiver role');
            }
            const res = await authApis().get(endpoint);

            if (res.status === 200) {
                if (receiverRole === rolesAndStatus.company)
                    return {
                        role: receiverRole,
                        name: res.data.name || receiverId,
                        avatar: res.data.avatar || '/default-avatar.png',
                    };
                else
                    return {
                        role: receiverRole,
                        name: res.data.fullName || receiverId,
                        avatar: res.data.avatar || '/default-avatar.png',
                    };
            }
            return { role: receiverRole, name: receiverId, avatar: '/default-avatar.png' };
        } catch (e) {
            console.error('Error fetching receiver info:', e);
            return { role: receiverRole, name: receiverId, avatar: '/default-avatar.png' };
        }
    };

    const loadMoreChats = async () => {
        if (!user || loading || !hasMore) return;

        setLoading(true);
        try {
            const q = query(
                collection(db, 'chatRooms'),
                where('participants', 'array-contains', user.id),
                orderBy('updatedAt', 'desc'),
                limit(chatsPerPage),
                ...(lastDoc ? [startAfter(lastDoc)] : [])
            );

            const snapshot = await getDocs(q);
            const newChats = [];
            const lastVisible = snapshot.docs[snapshot.docs.length - 1];
            setLastDoc(lastVisible);

            for (const doc of snapshot.docs) {
                const data = doc.data();
                const [senderId, receiverId, roleSender, roleReceiver] = data.participants;

                let receiverIdForInfo, receiverRole;
                if (user.id === senderId) {
                    receiverIdForInfo = receiverId;
                    receiverRole = roleReceiver;
                } else if (user.id === receiverId) {
                    receiverIdForInfo = senderId;
                    receiverRole = roleSender;
                } else {
                    console.error('User ID not found in participants:', user.id, data.participants);
                    continue;
                }

                const receiverInfo = await getReceiverInfo(receiverIdForInfo, receiverRole);

                newChats.push({
                    chatRoomId: doc.id,
                    receiverId: receiverIdForInfo,
                    receiver: receiverInfo,
                    lastMessage: data.lastMessage || null,
                });
            }

            setChatRooms((prev) => [...prev, ...newChats]);
            if (newChats.length < chatsPerPage) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = (e) => {
        const dropdownMenu = e.target;
        if (dropdownMenu.scrollHeight - dropdownMenu.scrollTop <= dropdownMenu.clientHeight + 50) {
            loadMoreChats();
        }
    };

    const handleOpenChat = (receiverId, role) => {
        setReceiver({ id: receiverId, role: role });
        setIsOpen(true);
    };

    const handleToggle = (isOpen) => {
        setIsDropdownOpen(isOpen);
        if (isOpen && chatRooms.length === 0) {
            setChatRooms([]);
            setLastDoc(null);
            setHasMore(true);
            loadMoreChats();
        }
    };

    return (
        <NavDropdown
            title={
                <div className="chat-nav-link">
                    <FontAwesomeIcon icon={faMessage} />
                </div>
            }
            id="chatDropdown"
            onToggle={handleToggle}
        >
            {loading && (
                <div className="loading-spinner">
                    <Spinner animation="border" size="sm" /> Đang tải lịch sử nhắn tin...
                </div>
            )}
            {!loading && (
                <div className="chat-dropdown-menu" onScroll={handleScroll}>
                    {chatRooms.length === 0 ? (
                        <NavDropdown.Item disabled>
                            Chưa có cuộc trò chuyện
                        </NavDropdown.Item>
                    ) : (
                        chatRooms.map((room) => (
                            <NavDropdown.Item
                                key={room.chatRoomId}
                                onClick={() => handleOpenChat(room.receiverId, room.receiver.role)}
                                className="chat-room-item"
                            >
                                <img
                                    src={room.receiver.avatar}
                                    alt={room.receiver.name}
                                    className="chat-avatar"
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '15px' }}
                                />
                                <div className="chat-info">
                                    <div className="chat-header">
                                        <span className="receiver-name">{room.receiver.name}</span>
                                        {room.lastMessage && room.lastMessage.createdAt && (
                                            <span className="message-timestamp">
                                                {new Date(room.lastMessage.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    {room.lastMessage && (
                                        <div className="latest-message">
                                            <span className="message-text">{room.lastMessage.text}</span>
                                            {!room.lastMessage.read && room.lastMessage.senderId !== user.id && (
                                                <span className="unread-dot">●</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </NavDropdown.Item>
                        ))
                    )}
                    {!hasMore && chatRooms.length > 0 && (
                        <NavDropdown.Item disabled>
                            Đã tải hết cuộc trò chuyện
                        </NavDropdown.Item>
                    )}
                </div>
            )}
        </NavDropdown>
    );
};

export default memo(ChatDropdown);