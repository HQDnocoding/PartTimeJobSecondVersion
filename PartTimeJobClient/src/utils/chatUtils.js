import {
  addDoc,
  collection,
  onSnapshot,
  updateDoc,
  query,
  getDocs,
  serverTimestamp,
  setDoc,
  doc,
  orderBy,
  limit,
  startAfter,
  endBefore,
} from 'firebase/firestore';
import { db, storage } from '../configs/FireBaseConfigs';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';




const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

export const getChatRoomId = (userId1, userId2) => {
  if (!userId1 || !userId2) {
    console.error('Invalid user IDs:', { userId1, userId2 });
    throw new Error('Invalid user IDs');
  }
  const roomId = [userId1, userId2].sort().join('_');
  return roomId;
};

export const sendMessage = async (chatRoomId, senderId, message, receiverId, roleSender, roleReceiver, type = 'text', fileUrl = null) => {
  if (!chatRoomId || !senderId || !message || !receiverId || !roleSender || !roleReceiver) {
    console.error('Invalid input:', { chatRoomId, senderId, message, receiverId, roleSender, roleReceiver });
    throw new Error('Invalid input for sendMessage');
  }
  try {
    const messageRef = await addDoc(collection(db, `chatRooms/${chatRoomId}/messages`), {
      senderId,
      message,
      type,
      fileUrl: fileUrl || null,
      createdAt: serverTimestamp(),
      read: false,
    });

    await setDoc(
      doc(db, 'chatRooms', chatRoomId),
      {
        participants: [senderId, receiverId, roleSender, roleReceiver],
        lastMessage: {
          text: message,
          type,
          fileUrl: fileUrl || null,
          senderId: senderId,
          read: false,
          createdAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log('Message sent with ID:', messageRef.id);
  } catch (error) {
    console.error('Send message error:', error.message, error.code);
    throw error;
  }
};

export const fetchRecentMessages = async (chatRoomId, limitCount = 20) => {
  if (!chatRoomId) throw new Error('Invalid chatRoomId');
  const q = query(
    collection(db, `chatRooms/${chatRoomId}/messages`),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .reverse();
};


export const fetchOlderMessages = async (chatRoomId, firstMessage, limitCount = 20) => {
  if (!chatRoomId || !firstMessage) throw new Error('Invalid input for fetchOlderMessages');

  const q = query(
    collection(db, `chatRooms/${chatRoomId}/messages`),
    orderBy('createdAt', 'desc'),
    startAfter(firstMessage.createdAt),
    limit(limitCount)
  );
  const snap = await getDocs(q);

  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .reverse();
};


export const listenMessages = (chatRoomId, lastCreatedAt, callback) => {
  if (!chatRoomId || !callback) return console.error('Invalid input for listenMessages');

  const q = query(
    collection(db, `chatRooms/${chatRoomId}/messages`),
    orderBy('createdAt', 'asc'),
    lastCreatedAt ? startAfter(lastCreatedAt) : startAfter(new Date(0))
  );
  return onSnapshot(q, snap => {
    const newMessages = snap.docChanges()
      .filter(c => c.type === 'added')
      .map(c => ({ id: c.doc.id, ...c.doc.data() }));
    if (newMessages.length) callback(newMessages);
  }, err => console.error('Snapshot error:', err));
};


export const markMessagesAsRead = async (chatRoomId, currentUserId, messages) => {
  if (!chatRoomId || !currentUserId) {
    console.error('Invalid input for markMessagesAsRead:', { chatRoomId, currentUserId });
    throw new Error('Invalid input for markMessagesAsRead');
  }

  try {
    const unreadMessages = messages.filter(
      (msg) => !msg.read && msg.senderId !== currentUserId
    );

    if (unreadMessages.length === 0) {
      console.log('No unread messages to mark as read in room:', chatRoomId);
      return;
    }

    const updatePromises = unreadMessages.map((msg) =>
      updateDoc(doc(db, `chatRooms/${chatRoomId}/messages`, msg.id), { read: true })
    );
    await Promise.all(updatePromises);
    console.log('Marked messages as read in room:', chatRoomId);
  } catch (error) {
    console.error('Error marking messages as read:', error.message, error.code);
    throw error;
  }
};


export const uploadFileToS3 = async (file, path) => {

  console.log(file);
  console.log('AWS Config:', {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
    bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
  });

  if (!file || !path) {
    console.error('Invalid file or path:', { file, path });
    throw new Error('Invalid file or path');
  }

  try {

    const arrayBuffer = await file.arrayBuffer();
    const fileBody = new Uint8Array(arrayBuffer);

    // Upload file to S3
    const uploadParams = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: path,
      Body: fileBody,
      ContentType: file.type,
    };
    await s3Client.send(new PutObjectCommand(uploadParams));

    // Generate signed URL (expires in 7 days)
    const urlParams = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: path,
    };
    const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(urlParams), {
      expiresIn: 7 * 24 * 60 * 60, // 7 days
    });

    console.log('File uploaded to S3:', signedUrl);
    return signedUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error.message);
    throw error;
  }
};