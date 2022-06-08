import MenuManagementAdmin from "../../Components/MenuManagementAdmin"
import Header from "../../Components/Header"
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import clsx from "clsx";
import style from "./allchapters.module.css";
import icon_post_img from './img/camera.png'

const AllChapters = () => {
    const [chapters, setChapters] = useState([]);
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState([]);
    const [tenChap, setTenChap] = useState('');



    useEffect(() => {
        function getChapters() {
            let params = new URLSearchParams(window.location.search);
            let comicId = params.get('comicId');
            axios.get(process.env.REACT_APP_API_ENDPOINT + `/chapter/get-all-chapters?comicId=${comicId}`).then(response => {
                setChapters(response.data);
            });
        }
        getChapters();

        return () => {
            setChapters([]);
        }
    }, [])


    // img
    function resetForm() {
        setImage([]);
        setTenChap('');
    }
    function isFileImage(file) {
        return file && file['type'].split('/')[0] === 'image';
    }
    const handleOnChangeInputImg = (e) => {
        const files = Array.from(e.target.files).filter(f => isFileImage(f) === true)
        files.forEach(element => {
            element.preview = URL.createObjectURL(element);
        });
        setImage(prev => [...prev, ...files]);
    }
    useEffect(() => {
        // clean up image
        return () => {
            image.forEach(e => {
                URL.revokeObjectURL(e.preview);
            })
        }
    }, [image])


    useEffect(() => {
        return () => resetForm();
    }, [])


    



    return (
        <>
            <Header />
            <MenuManagementAdmin />
            <div className={clsx(style.btn_add_chap)}>
                <button onClick={() => setModal(!modal)} type="button">Thêm chap</button>
            </div>
            <div className={clsx(style.box)}>
                <div className={clsx(style.box_content)}>
                    {chapters.length === 0 ? <h1>Chưa có chap nào</h1> : <></>}
                    {chapters.map((e) => {
                        let params = new URLSearchParams(window.location.search);
                        let comicId = params.get('comicId');
                        return <div key={e.idChap} className={clsx(style.box_item)}>
                            <Link className={clsx(style.link_chap)} to={`/get-a-chapter?comicId=${comicId}&idChap=${e.idChap}`}>{e.tenChap}</Link>
                            <button className={clsx(style.btn_xoa)} type="button">Xóa</button>
                        </div>
                    })}

                </div>
            </div>


            {modal === true ?
                <div onClick={() => setModal(!modal)} className={clsx(style.modal)}>
                    <div onClick={(e) => e.stopPropagation()} className={clsx(style.modal_content)}>
                        <div style={{ marginTop: '7px'}}>
                            <input className={clsx(style.inputTenChap)} name="tenChap" value={tenChap} onChange={e => setTenChap(e.target.value)} type='text' placeholder="Tên chap" />
                        </div>

                        <div className={clsx(style.separate)}></div>

                        <div className={style.box_img}>
                            <div className={style.input_img}>
                                <input onChange={handleOnChangeInputImg} id='id_img' name='image' type='file' multiple />
                                <label className={style.label_input_img} htmlFor='id_img'>
                                    <img src={icon_post_img} alt='icon post img' />
                                    <div className={style.button_select_img}>Chọn ảnh</div>
                                </label>
                            </div>
                            <div className={style.preview_img}>
                                {image.map((e, index) => { return <img key={index} src={e.preview} alt='img preview' /> })}
                            </div>
                        </div>
                        <div className={clsx(style.separate)}></div>

                        <div>
                            <button className={clsx(style.addProduct)} type="button">Thêm chap</button>
                        </div>
                    </div>
                </div>
                : <div></div>}




        </>
    )
}
export default AllChapters