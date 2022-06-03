import clsx from 'clsx';
import style from './header.module.css';


const Header = () => {
    return (
        <>
            <header className={clsx(style.header)}>
                <a href='/'>
                    <h1>Vibu Comics</h1>
                </a>
            </header>
        </>
    )
}

export default Header;