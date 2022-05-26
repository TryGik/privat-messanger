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
    updateDoc
} from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import User from '../components/User';
import Message from '../components/Message';
import MessageForm from '../components/MessageForm';

//getDoc use only once, than have to use onSnapshot
const Home = () => {

    /*const q = query(collection(db, "cities"), where("capital", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
});*/

    //
    const [bg, setBg] = React.useState(false);

    React.useEffect(() => {
        // const id = 'bg-for-per';
        // getDoc(doc(db, 'background', id)).then((docSnap) => {
        //     if (docSnap.exists) {
        //         // console.log(docSnap.data().sun)
        //         setBg(docSnap.data().sun)
        //         // console.log(bg)
        //     }
        // })
        //опять забыл лисанером является снапшот, а не гетдок
        const backgroundRef = collection(db, 'background');
        //создаем обьект запроса не включая юзера1
        const q = query(backgroundRef)
        //достаем запрос
        const unsub = onSnapshot(q, querySnapshot => {
            let bg;
            querySnapshot.forEach((doc) => {
                bg = doc.data().sun;
            });
            setBg(bg);
        });
        return () => unsub();
    }, [])
    console.log(bg)
    //

    const [users, setUsers] = React.useState([]);
    const [user, setUser] = React.useState('');
    const [text, setText] = React.useState('');
    const [img, setImg] = React.useState('');
    const [messages, setMessages] = React.useState([]);

    const user1 = auth.currentUser.uid;

    React.useEffect(() => {
        const usersRef = collection(db, 'users');
        //создаем обьект запроса не включая юзера1
        const q = query(usersRef, where('uid', 'not-in', [user1]))
        //достаем запрос
        const unsub = onSnapshot(q, querySnapshot => {
            let users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            setUsers(users);
        });
        return () => unsub();
    }, [])
    // console.log(users);

    const selectUser = async (user) => {
        setUser(user);
        // console.log(user);

        const user2 = user.uid
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        const messagesRef = collection(db, 'messages', id, 'chat');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));
        onSnapshot(q, querySnapshot => {
            let messages = [];
            querySnapshot.forEach((doc) => {
                messages.push(doc.data());
            });
            setMessages(messages);
        });
        //'New' message functionality also have trouble whith 2 people, whos start conversation
        //in this case we get last message beetwen log in user and select user
        // if (docSnap.data().from !== user1) check exist conv or not

        const docSnap = await getDoc(doc(db, 'lastMessage', id))
        //if last message exist otherwise we will have error also docSnap.data().from !== user1 message belong to select user
        if (docSnap.data() && docSnap.data().from !== user1) {
            await updateDoc(doc(db, 'lastMessage', id), {
                unread: false,
            })
        }
    }
    // console.log(messages);

    //create messages
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user2 = user.uid;
        // messages => id => chat => addDoc()
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        //add media
        let url;
        if (img) {
            const imgRef = ref(
                storage,
                `images/${new Date().getTime()}-${img.name}`
            );
            const snap = await uploadBytes(imgRef, img);
            const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
            url = dlUrl
        }

        await addDoc(collection(db, 'messages', id, 'chat'), {
            text,
            from: user1,
            to: user2,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || '',
        })
        //создаем последнее сообщение in collection can be only 1 last message
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

    return (
        <div className={`home_container ${bg ? 'white' : ''}`}>
            <div className="users_container">
                {users.map(item =>
                    <User
                        key={item.uid}
                        user={item}
                        selectUser={selectUser}
                        user1={user1}
                        chat={user} />)}
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