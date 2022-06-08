import MenuManagementAdmin from "../../Components/MenuManagementAdmin"
import Header from "../../Components/Header"
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import clsx from "clsx";
import style from "./allchapters.module.css";
import icon_post_img from './img/camera.png';
import Toast from '../../Components/Toast';

const AllChapters = () => {
    const [chapters, setChapters] = useState([]);
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState([]);
    const [tenChap, setTenChap] = useState('');

    const [notify, setNotify] = useState('none');
    const [message, setMessage] = useState('Thêm chap thành công.');

    const navigate = useNavigate();
    //get all chap
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

    //clean form
    useEffect(() => {
        return () => resetForm();
    }, [])


    const AddChap = async (e) => {
        if (tenChap && image.length > 0) {

            let params = new URLSearchParams(window.location.search);
            let comicId = params.get('comicId');
            let tenTruyen = params.get('tenTruyen');

            let formData = new FormData();
            formData.append('tenChap', tenChap);
            formData.append('comicId', comicId);
            formData.append('tenTruyen', tenTruyen);

            for (let i = 0; i < image.length; i++) {
                formData.append('image', image[i], image[i].name)
            }



            await fetch(process.env.REACT_APP_API_ENDPOINT + '/chapter/add-chapter', {
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('accessTokenAdmin')
                },
                body: formData
            })
                .then(res => res.json())
                .then(async (dataRes) => {
                    if (dataRes.status === 'success') {
                        resetForm();
                        setMessage('Thêm thành công');
                        setNotify('block');
                        setTimeout(() => {
                            setNotify('none');
                        }, 7000)
                    }
                    else {
                        await fetch(process.env.REACT_APP_API_ENDPOINT + '/admin/refresh-token', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                refreshTokenAdmin: localStorage.getItem('refreshTokenAdmin')
                            })
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.status === 'success') {
                                    localStorage.setItem('accessTokenAdmin', data.data.accessTokenAdmin);
                                }
                                else {
                                    alert('Refresh Token gặp lỗi');
                                    localStorage.removeItem('accessTokenAdmin');
                                    navigate('/');
                                }
                            });
                        await fetch(process.env.REACT_APP_API_ENDPOINT + '/chapter/add-chapter', {
                            method: 'POST',
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('accessTokenAdmin')
                            },
                            body: formData
                        })
                            .then(res => res.json())
                            .then(dataRes => {
                                console.log(dataRes)
                                if (dataRes.status === 'success') {
                                    resetForm();
                                    setMessage('Thêm thành công');
                                    setNotify('block');
                                    setTimeout(() => {
                                        setNotify('none');
                                    }, 7000)
                                }
                                else {
                                    alert('Token hết hạn, mời bạn đăng nhập lại');
                                    localStorage.removeItem('accessTokenAdmin');
                                    navigate('/');
                                }
                            }
                            )

                    }
                })









        }
        else {
            alert('Chưa điền đủ thông tin');
        }

    }





    return (
        <>
            <Toast notify={notify} message={message} />
            <Header />
            <MenuManagementAdmin />
            <div className={clsx(style.btn_add_chap)}>
                <button onClick={() => setModal(!modal)} type="button">Thêm chap</button>
            </div>
            <div className={clsx(style.box)}>
                <div className={clsx(style.box_content)}>
                    {chapters.length === 0 ? <h1>Chưa có chap nào</h1> : <></>}
                    {chapters.map((e,index) => {
                        let params = new URLSearchParams(window.location.search);
                        let comicId = params.get('comicId');
                        return <div key={index} className={clsx(style.box_item)}>
                            <Link className={clsx(style.link_chap)} to={`/get-a-chapter?comicId=${comicId}&idChap=${e.idChap}`}>{e.tenChap}</Link>
                            <button className={clsx(style.btn_xoa)} type="button">Xóa</button>
                        </div>
                    })}

                </div>
            </div>


            {modal === true ?
                <div onClick={() => setModal(!modal)} className={clsx(style.modal)}>
                    <div onClick={(e) => e.stopPropagation()} className={clsx(style.modal_content)}>
                        <div style={{ marginTop: '7px' }}>
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
                            <button onClick={AddChap} className={clsx(style.addProduct)} type="button">Thêm chap</button>
                        </div>
                    </div>
                </div>
                : <div></div>}




        </>
    )
}
export default AllChapters