import style from './SignIn.module.css'
import clsx from 'clsx'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react'

function Admin() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const formSubmit = (e) => {
        e.preventDefault();
        axios.post(process.env.REACT_APP_API_ENDPOINT+'/admin/signin', {
            username: username.trim(),
            password: password.trim()
        })
            .then(function (response) {
                localStorage.setItem('accessTokenAdmin', response.data.accessTokenAdmin);
                localStorage.setItem('refreshTokenAdmin', response.data.refreshTokenAdmin);
                navigate('/all-comics');
            })
            .catch(function (error) {
                alert('Sai tài khoản hoặc mật khẩu.');
            });
    }

    return (
        <>
            <div className={style.container}>
                <div className={clsx(style.form, style.formSignIn)}>
                    <form onSubmit={formSubmit} className={style.form_log} method='POST' action={process.env.REACT_APP_API_ENDPOINT + '/admin/signin'}>
                        <input value={username} onChange={e => setUsername(e.target.value)} className={style.input} type='text' name='username' autoComplete='off' placeholder='Tài khoản quản trị viên' />
                        <input value={password} onChange={e => setPassword(e.target.value)} className={style.input} type='password' name='password' autoComplete='off' placeholder='Mật khẩu' />
                        <button className={style.button} type='submit'>Đăng nhập</button>
                    </form>

                </div>



            </div>
        </>
    )
}

export default Admin