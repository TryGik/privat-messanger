import React from 'react';
import { collection, query, where, onSnapshot, addDoc, Timestamp } from "firebase/firestore";
import { db, auth, storage } from '../firebase';
import User from '../components/User';
import MessageForm from '../components/MessageForm';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';

//getDoc use only once, than have to use onSnapshot
const Home = () => {

    /*const q = query(collection(db, "cities"), where("capital", "==", true));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
});*/

    const [users, setUsers] = React.useState([]);
    const [user, setUser] = React.useState('');
    const [text, setText] = React.useState('');
    const [img, setImg] = React.useState('')

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
    console.log(users);

    const selectUser = (user) => {
        setUser(user);
        // console.log(user);
    }

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
        setText('');
    }

    return (
        <div className='home_container'>
            <div className="users_container">
                {users.map(user => <User key={user.uid} user={user} selectUser={selectUser} />)}
            </div>
            <div className="messages_container">
                {user ?
                    <>
                        <div className='messages_user'>
                            <h3>{user.name}</h3>
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

export default Home