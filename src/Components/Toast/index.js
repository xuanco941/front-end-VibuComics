
import style from './toast.module.css'

const Toast = (props) => {

    return(
        <div style={{
            display: props.notify
        }} className={style.toast} >
            <p>{props.message}</p>
        </div>
    )
}

export default Toast