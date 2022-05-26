import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../context/auth';


const Navbar = () => {
    const { user } = React.useContext(AuthContext);
    const navigation = useNavigate();

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