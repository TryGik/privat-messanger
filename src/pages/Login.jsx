import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import googleLogo from '../assets/google-logo.svg';

const Login = () => {
    const navigation = useNavigate();

    //Google
    const provider = new GoogleAuthProvider();
    const googleRegister = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                setDoc(doc(db, 'users', result.user.uid), {
                    uid: result.user.uid,
                    name: result.user.displayName,
                    email: result.user.email,
                    createdAt: Timestamp.fromDate(new Date()),
                    isOnline: true
                })
                navigation('/');
            }).catch((error) => {
                const errorCode = error.code;
                alert(errorCode);
                const errorMessage = error.message;
                alert(errorMessage);
                const email = error.customData.email;
                alert(email);
                const credential = GoogleAuthProvider.credentialFromError(error);
                alert(credential);
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
            await updateDoc(doc(db, 'users', result.user.uid), {
                isOnline: true
            });
            setData({ email: '', password: '', error: null, loading: false })
            navigation('/');
        } catch (err) {
            setData({ ...data, error: err.message, loading: false })
        }
    }

    return (
        <section>
            <h3>Войти в аккаунт</h3>
            <form className='form' onSubmit={registration}>
                <div className="input_container">
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email'
                        value={email}
                        onChange={changeInput}
                    />
                </div>
                <div className="input_container">
                    <label htmlFor="password">Пароль</label>
                    <input type="password" name='password'
                        value={password}
                        onChange={changeInput}
                    />
                </div>
                {error ? <p className="error">{error}</p> : null}
                <div className="btn_container">
                    <button className="btn" disabled={loading}>
                        {loading ? 'Ожидайте...' : 'Войти'}
                    </button>
                </div>
            </form>
            <hr />
            <div style={{ textAlign: 'center' }}>или</div>
            <div className='google_container'>
                <button className="btn google_btn" onClick={googleRegister}>
                    <img className='google_logo' src={googleLogo} alt="google-logo" />
                    Войти с помощью Google</button>
            </div>

        </section>
    )
}

export default Login;