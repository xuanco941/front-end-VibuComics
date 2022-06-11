import clsx from 'clsx';
import style from './header.module.css';


const Header = () => {
    let location = window.location.href;

    return (
        <>
            <header className={clsx(style.header)}>
                <a href={location}>
                    <h1>Vibu Comics</h1>
                </a>
            </header>
        </>
    )
}

export default Header;