import React from 'react';
import { db, auth, storage } from '../firebase';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    Timestamp,
    orderBy,
    setDoc,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    getDocs
} from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import User from '../components/User';
import Message from '../components/Message';
import MessageForm from '../components/MessageForm';

const Home = () => {
    const [users, setUsers] = React.useState([]);
    const [user, setUser] = React.useState('');
    const [text, setText] = React.useState('');
    const [img, setImg] = React.useState('');
    const [messages, setMessages] = React.useState([]);
    const [bg, setBg] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState('')

    const user1 = auth.currentUser.uid;

    React.useEffect(() => {
        const userRef = collection(db, 'users');
        const q = query(userRef)
        const unsub = onSnapshot(q, querySnapshot => {
            let bg;
            querySnapshot.forEach((doc) => {
                if (user1 === doc.data().uid) {
                    bg = doc.data().sun;
                }
            });
            setBg(bg || false);
        });
        return () => unsub();
    }, [])

    React.useEffect(() => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', 'not-in', [user1]))
        const unsub = onSnapshot(q, querySnapshot => {
            let users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            setUsers(users);
        });
        return () => unsub();
    }, [])

    const selectUser = async (user) => {
        setUser(user);
        const user2 = user.uid
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        const messagesRef = collection(db, 'messages', id, 'chat');
        setDeleteId(id);
        const q = query(messagesRef, orderBy('createdAt', 'asc'));
        onSnapshot(q, querySnapshot => {
            let messages = [];
            querySnapshot.forEach((doc) => {
                messages.push(doc.data());
            });
            setMessages(messages);
        });

        const docSnap = await getDoc(doc(db, 'lastMessage', id))
        if (docSnap.data() && docSnap.data().from !== user1) {
            await updateDoc(doc(db, 'lastMessage', id), {
                unread: false,
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user2 = user.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        let url;
        if (img) {
            const imgRef = ref(
                storage,
                `images/${new Date().getTime()}-${img.name}`
            );
            const snap = await uploadBytes(imgRef, img);
            const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
            setImg('');
            url = dlUrl
        }

        await addDoc(collection(db, 'messages', id, 'chat'), {
            text,
            from: user1,
            to: user2,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || '',
        })

        await setDoc(doc(db, 'lastMessage', id), {
            text,
            from: user1,
            to: user2,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || '',
            unread: true,
        });

        setText('');
    }

    const deleteChat = async (e) => {
        e.stopPropagation()
        const user2 = user.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        const q = query(collection(db, "messages", deleteId, 'chat'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((el) => {
            deleteDoc(doc(db, "messages", id, 'chat', el.id));
        });

        setDoc(doc(db, 'lastMessage', id), {
            text: 'очищено',
            unread: false,
        });
        setText('');
    }

    return (
        <div className={`home_container ${bg ? 'white' : ''}`}>
            <div className="users_container">
                {users.map(item =>
                    <User
                        key={item.uid}
                        user={item}
                        selectUser={selectUser}
                        user1={user1}
                        chat={user}
                        deleteChat={deleteChat}
                    />)}
            </div>
            <div className="messages_container">
                {user ?
                    <>
                        <div className='messages_user'>
                            <h3>{user.name}</h3>
                        </div>
                        <div className="messages">
                            {messages.length ? messages.map((el, i) =>
                                <Message key={i} message={el} user1={user1} />) : null}
                        </div>
                        <MessageForm handleSubmit={handleSubmit}
                            text={text}
                            img={img}
                            setText={setText}
                            setImg={setImg}
                        />
                    </>
                    :
                    <div>
                        <h3 className='no_conv'>Выбери пользователя с кем хотите начать переписку</h3>
                    </div>
                }
            </div>
        </div>
    )
}

export default Home;