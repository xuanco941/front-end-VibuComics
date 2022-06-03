
import { Link, useNavigate } from 'react-router-dom'
import style from './menufixed.module.css'
import settingimg from './setting.png'
const MenuManagementAdmin = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('accessTokenAdmin');
        localStorage.removeItem('refreshTokenAdmin');
        navigate('/');
        
    } 
    return (
        <div className={style.menu}>
            <img className={style.img} src={settingimg} alt='img' />
            <div className={style.box_item}>
                <Link to='/add-comic' className={style.item}>Thêm sản phẩm</Link>
                <Link to='/all-comics' className={style.item}>Xem sản phẩm</Link>
                <div onClick={handleSignOut} className={style.item}>Đăng xuất</div>
            </div>
        </div>
    )
}


export default MenuManagementAdmin