import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, Timestamp } from 'firebase/firestore';

const Registration = () => {
    const navigation = useNavigate();

    //Email & Password
    const [data, setData] = React.useState({
        name: '',
        email: '',
        password: '',
        error: null,
        loading: false
    });


    const { name, email, password, error, loading } = data;

    const changeInput = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const registration = async (e) => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true })
        if (!name || !email || !password) {
            setData({ ...data, error: 'Все поля обязательны для заполнения!' });
        }
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', result.user.uid), {
                uid: result.user.uid,
                name,
                email,
                createdAt: Timestamp.fromDate(new Date()),
                isOnline: true,
                sun: false
            });
            setData({ name: '', email: '', password: '', error: null, loading: false })
            navigation('/');
        } catch (err) {
            setData({ ...data, error: err.message, loading: false })
        }
    }

    return (
        <section>
            <h3>Создать новый аккаунт</h3>
            <form className='form' onSubmit={registration}>
                <div className="input_container">
                    <label htmlFor="name">Имя</label>
                    <input type="text" name='name'
                        value={name}
                        onChange={changeInput}
                    />
                </div>
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
                        {loading ? 'Идет регистрация ...' : 'Регистрация'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default Registration;