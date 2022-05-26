import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import googleLogo from '../assets/google-logo.svg';

const Login = () => {
    const navigation = useNavigate();

    //Google

    const provider = new GoogleAuthProvider();
    const googleRegister = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log('Result', result)
                const docSnap = getDoc(doc(db, 'users', result.user.uid));
                if (docSnap.data()) {
                    updateDoc(doc(db, 'users', result.user.uid), {
                        isOnline: true
                    })
                    navigation('/');
                }
                navigation('/registration');
                return;
            }).catch((error) => {
                alert('Чтобы пользоваться PRIVATE-MSGR через Google аккаунты, сперва зарегистрируйтесь')
            });
    }

    //Email & Password
    const [data, setData] = React.useState({
        email: '',
        password: '',
        error: null,
        loading: false
    });


    const { email, password, error, loading } = data;

    const changeInput = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const registration = async (e) => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true })
        if (!email || !password) {
            setData({ ...data, error: 'Все поля обязательны для заполнения!' });
        }
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            // console.log(result.user)
            await updateDoc(doc(db, 'users', result.user.uid), {
                isOnline: true
            });
            //firebase.firestore().collection('users').doc(id).set({}) erlier
            setData({ email: '', password: '', error: null, loading: false })
            navigation('/');
        } catch (err) {
            setData({ ...data, error: err.message, loading: false })
        }
    }

    return (
        <section>
            <h3>Log into your Account</h3>
            <form className='form' onSubmit={registration}>
                <div className="input_container">
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email'
                        value={email}
                        onChange={changeInput}
                    />
                </div>
                <div className="input_container">
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password'
                        value={password}
                        onChange={changeInput}
                    />
                </div>
                {error ? <p className="error">{error}</p> : null}
                <div className="btn_container">
                    <button className="btn" disabled={loading}>
                        {loading ? 'Logining in ...' : 'Login'}
                    </button>
                </div>
            </form>
            <hr />
            <div style={{ textAlign: 'center' }}>or</div>
            <div className='google_container'>
                <button className="btn google_btn" onClick={googleRegister}>
                    <img className='google_logo' src={googleLogo} alt="google-logo" />
                    Login with Google</button>
            </div>

        </section>
    )
}

export default Login;