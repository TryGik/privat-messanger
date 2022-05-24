import React from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../context/auth';
import { useNavigate } from 'react-router-dom';

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
                <Link to="/">Messenger</Link>
            </h3>
            <div>
                {user ?
                    <>
                        <Link to="/profile">Profile</Link>
                        <button className="btn" onClick={handlerSignOut}>Logout</button>
                    </>
                    :
                    <>
                        <Link to='/registration'>Registration</Link>
                        <Link to='/login'>Login</Link>
                    </>
                }
            </div>

        </nav>
    )
}

export default Navbar