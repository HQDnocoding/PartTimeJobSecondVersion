import React from 'react';
import { Button } from 'react-bootstrap';

const ChatHeader = ({ receiverInfo, handleClose }) => {
    return (
        <div className="chat-header">
            <Button variant="close" onClick={handleClose} />
        </div>
    );
};

export default ChatHeader;