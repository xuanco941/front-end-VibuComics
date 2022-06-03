import style from './loader.module.css'

const Loader = (props) => {
    return(
    <div style={{
        display: props.loader
    }} className={style.box}>
        <div className={style.loader}></div>
    </div>)

}

export default Loader