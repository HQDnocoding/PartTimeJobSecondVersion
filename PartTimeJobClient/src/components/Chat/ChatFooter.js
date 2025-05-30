import React from 'react';
   import { toast } from 'react-toastify';
   import { Button } from 'react-bootstrap';
   import { sendMessage, uploadFileToS3 } from '../../utils/chatUtils';

   const ChatFooter = ({
     chatRoomId,
     user,
     receiver,
     newMessage,
     setNewMessage,
     selectedFiles,
     setSelectedFiles,
     fileInputRef,
     imageInputRef,
     loading,
     setLoading,
     scrollToBottom,
     setShouldScrollToBottom,
   }) => {
     const handleFileSelect = (event, type) => {
       const files = Array.from(event.target.files);
       const maxFileSize = 5 * 1024 * 1024; // 5MB
       const validFiles = files.filter((file) => {
         if (file.size > maxFileSize) {
           toast.error(`File ${file.name} quá lớn! Vui lòng chọn file dưới 5MB.`);
           return false;
         }
         if (type === 'image') {
           return file.type.startsWith('image/');
         }
         return true;
       });

       if (validFiles.length !== files.length) {
         toast.warn('Một số file không hợp lệ đã bị bỏ qua.');
       }

       setSelectedFiles((prev) => [
         ...prev,
         ...validFiles.map((file) => ({
           file,
           type,
           preview: type === 'image' ? URL.createObjectURL(file) : null,
         })),
       ]);

       event.target.value = null;
     };

     const handleRemoveFile = (index) => {
       setSelectedFiles((prev) => {
         const newFiles = prev.filter((_, i) => i !== index);
         if (prev[index].preview) {
           URL.revokeObjectURL(prev[index].preview);
         }
         return newFiles;
       });
     };

     const handleSend = async () => {
       if (!user || !user.id) {
         toast.error('Vui lòng đăng nhập để gửi tin nhắn!');
         return;
       }

       if (!newMessage.trim() && selectedFiles.length === 0) {
         toast.error('Vui lòng nhập tin nhắn hoặc chọn file!');
         return;
       }

       if (!user.role || !receiver?.role) {
         toast.error('Thông tin người dùng hoặc người nhận không hợp lệ!');
         return;
       }

       setLoading(true);
        setNewMessage('');
       try {
         if (newMessage.trim()) {
           await sendMessage(
             chatRoomId,
             user.id,
             newMessage,
             receiver.id,
             user.role,
             receiver.role
           );
          
         }

         for (const { file, type } of selectedFiles) {
           const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
           const storagePath = `chat_files/${chatRoomId}/${Date.now()}_${safeFileName}`;
           const fileUrl = await uploadFileToS3(file, storagePath);
           await sendMessage(
             chatRoomId,
             user.id,
             file.name,
             receiver.id,
             user.role,
             receiver.role,
             type,
             fileUrl
           );
         }

         selectedFiles.forEach(({ preview }) => {
           if (preview) URL.revokeObjectURL(preview);
         });
         setSelectedFiles([]);
         setShouldScrollToBottom(true);
         scrollToBottom();
       } catch (error) {
         console.error('Failed to send:', error);
       } finally {
         setLoading(false);
       }
     };

     return (
       <div className="chat-footer">
         <div className="container-footer">
           {selectedFiles.length > 0 && (
             <div className="selected-files">
               {selectedFiles.map((fileObj, index) => (
                 <div key={index} className="file-preview">
                   {fileObj.type === 'image' ? (
                     <img
                       src={fileObj.preview}
                       alt={fileObj.file.name}
                       className="file-preview-image"
                     />
                   ) : (
                     <span className="file-preview-name">{fileObj.file.name}</span>
                   )}
                   <button
                     className="remove-file-btn"
                     onClick={() => handleRemoveFile(index)}
                     aria-label="Xóa file"
                   >
                     <i className="bi bi-x-circle"></i>
                   </button>
                 </div>
               ))}
             </div>
           )}
           <div>
             <div className="action-buttons">
               <input
                 type="file"
                 ref={fileInputRef}
                 style={{ display: 'none' }}
                 onChange={(e) => handleFileSelect(e, 'file')}
                 multiple
               />
               <button
                 className="icon-btn"
                 onClick={() => fileInputRef.current.click()}
                 title="Gửi file"
               >
                 <i className="bi bi-file-earmark-arrow-up"></i>
               </button>
               <input
                 type="file"
                 ref={imageInputRef}
                 style={{ display: 'none' }}
                 accept="image/*"
                 onChange={(e) => handleFileSelect(e, 'image')}
                 multiple
               />
               <button
                 className="icon-btn"
                 onClick={() => imageInputRef.current.click()}
                 title="Gửi hình"
               >
                 <i className="bi bi-image"></i>
               </button>
             </div>
             <div className="message-input-container">
               <input
                 type="text"
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 placeholder="Nhập tin nhắn..."
                 className="message-input"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     handleSend();
                   }
                 }}
               />
               <Button
                 variant="primary"
                 onClick={handleSend}
                 disabled={loading || (!newMessage.trim() && selectedFiles.length === 0)}
               >
                 Gửi
               </Button>
             </div>
           </div>
         </div>
       </div>
     );
   };

   export default ChatFooter;