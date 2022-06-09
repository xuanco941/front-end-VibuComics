import MenuManagementAdmin from "../../Components/MenuManagementAdmin"
import Header from "../../Components/Header"
import axios from 'axios';
import { useEffect, useState } from 'react';
import style from './listallcomics.module.css'

const AllUsers = () => {


    const [users, setUsers] = useState([]);

    useEffect(() => {
        function getUsers() {
            axios.get(process.env.REACT_APP_API_ENDPOINT + '/user/get-all-users').then(response => {
                setUsers(response.data);
            });
        }

        getUsers();

        return () => {
            setUsers([]);
        }
    }, [])


    return (
        <>
            <Header />
            <MenuManagementAdmin />

            <table className={style.table}>
                <tbody>
                    <tr>
                        <th>Email</th>
                        <th>Tài khoản</th>
                        <th>Mật khẩu</th>
                        <th>Coin</th>
                        <th>Quyền quản trị</th>
                    </tr>
                </tbody>

                {users.length > 0 ? users.map(e => {

                    return <tbody key={e.id}>
                        <tr data-id={e.id} className={style.tr}>
 
                            <td>{e.email}</td>
                            <td>{e.username}</td>
                            <td>{e.password}</td>
                            <td>{e.coin}</td>
                            <td>{e.isAdmin === true ? 'Có' : 'Không'}</td>
                        </tr>
                    </tbody>



                }) : <tbody>

                    <tr><td>Không có người dùng nào</td></tr>
                </tbody>}



            </table>
        </>
    )
}
export default AllUsers