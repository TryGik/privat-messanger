import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../context/auth';
import Sun from './svg/Sun';
import Moon from './svg/Moon';


const Navbar = () => {
    const { user } = React.useContext(AuthContext);
    const navigation = useNavigate();
    const [sun, setSun] = React.useState(false)

    //

    const changeBackground = async () => {
        const id = 'bg-for-per';
        await setDoc(doc(db, 'background', id), {
            sun: sun,
        });
        await updateDoc(doc(db, 'background', id), {
            sun: !sun,
        });
        setSun(!sun);
    }

    //


    const handlerSignOut = async () => {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            isOnline: false
        });
        await signOut(auth);
        navigation('/login');
    };

    return (
        <nav>
            <h3>
                <Link to="/">PRIVATE-MSGR</Link>
            </h3>
            <div onClick={() => changeBackground()}>
                {sun ?
                    <Sun />
                    :
                    <Moon />}
            </div>
            <div>
                {user ?
                    <>
                        <Link to="/profile">Профиль</Link>
                        <button className="btn" onClick={handlerSignOut}>Выйти</button>
                    </>
                    :
                    <>
                        <Link to='/registration'>Регистрация</Link>
                        <Link to='/login'>Войти</Link>
                    </>
                }
            </div>

        </nav>
    )
}

export default Navbar