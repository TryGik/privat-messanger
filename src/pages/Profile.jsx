import React from 'react';
import { useNavigate } from 'react-router-dom';
import { storage, db, auth } from '../firebase';
import { uploadBytes, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import Camera from '../components/svg/Camera';
import Trash from '../components/svg/Trash';
import defaultAva from '../assets/avatar.jpg';

const Profile = () => {
    const navigation = useNavigate();
    const [img, setImg] = React.useState('');
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        getDoc(doc(db, 'users', auth.currentUser.uid)).then((docSnap) => {
            if (docSnap.exists) {
                setUser(docSnap.data())
            }
        })
        if (img) {
            const uploadImg = async () => {
                const imgRef = ref(
                    storage,
                    `avatar/${new Date().getTime()} - ${img.name}`
                );
                try {
                    if (user.avatarPath) {
                        await deleteObject(ref(storage, user.avatarPath));
                    }
                    const snap = await uploadBytes(imgRef, img);
                    const url = await getDownloadURL(ref(storage, snap.ref.fullPath))

                    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                        avatar: url,
                        avatarPath: snap.ref.fullPath,
                    });
                    setImg('');
                } catch (error) {
                    alert(error.message);
                }
            }
            uploadImg();
        }
    }, [img])

    const deleteImg = async () => {
        try {
            const confirm = window.confirm("Вы уверены, что хотите Удалить аватарку");
            if (confirm) {
                await deleteObject(ref(storage, user.avatarPath));
                await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    avatar: '',
                    avatarPath: '',
                });
                navigation('/');
            }
        } catch (error) {
            alert(error.message);
        }
    }

    return user ? (
        <section>
            <div className='profile_container'>
                <div className='img_container'>
                    <img src={user.avatar || defaultAva} alt="avatar" />
                    <div className='overlay'>
                        <div>
                            <label htmlFor="photo">
                                <Camera />
                            </label>
                            {user.avatar ? <Trash deleteImg={deleteImg} /> : null}
                            <input type="file" accept='image/*'
                                style={{ display: 'none' }} id='photo'
                                onChange={e => setImg(e.target.files[0])} />
                        </div>
                    </div>
                </div>
                <div className="text_container">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <hr />
                    <small>Присоединился : {user.createdAt.toDate().toDateString()}</small>
                </div>
            </div>
        </section>
    )
        :
        null
}

export default Profile;