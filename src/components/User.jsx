import React from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import defaultAva from '../assets/avatar.jpg';

const User = ({ user, selectUser, user1, chat, deleteChat }) => {
    const user2 = user?.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const [data, setData] = React.useState('');

    React.useEffect(() => {
        let unsub = onSnapshot(doc(db, 'lastMessage', id), (doc) => {
            setData(doc.data());
        });
        return () => unsub();
    }, [])


    return (
        <div className={`user_wrapper ${chat.name === user.name && 'selected_user'}`}
            onClick={() => selectUser(user)}>
            <div className="user_info">
                <div className="user_detail">
                    <img className='avatar' src={user.avatar || defaultAva} alt="avatar" />
                    <h4>{user.name}</h4>
                    {data?.from !== user1 && data?.unread && <small className='unread'>New</small>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {chat.name === user.name &&
                        <svg
                            className='clear_icon'
                            onClick={deleteChat}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    }
                    <div className={`user_status ${user.isOnline ? 'online' : 'offline'}`}></div>
                </div>

            </div>
            {data && (
                <p style={{ textAlign: 'center' }}
                    className='truncate'><strong>{data.from === user1 ? 'Me:' : null}
                    </strong><i>{data.text}</i>
                </p>
            )}
        </div>
    )
}

export default User;