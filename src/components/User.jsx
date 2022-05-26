import React from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import defaultAva from '../assets/avatar.jpg';

const User = ({ user, selectUser, user1, chat }) => {
    const user2 = user?.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const [data, setData] = React.useState('');

    React.useEffect(() => {
        let unsub = onSnapshot(doc(db, 'lastMessage', id), (doc) => {
            setData(doc.data());
        });
        return () => unsub();
    }, [])
    // console.log(data);
    return (
        <div className={`user_wrapper ${chat.name === user.name && 'selected_user'}`}
            onClick={() => selectUser(user)}>
            <div className="user_info">
                <div className="user_detail">
                    <img className='avatar' src={user.avatar || defaultAva} alt="avatar" />
                    <h4>{user.name}</h4>
                    {data?.from !== user1 && data?.unread && <small className='unread'>New</small>}
                </div>
                <div className={`user_status ${user.isOnline ? 'online' : 'offline'}`}></div>
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