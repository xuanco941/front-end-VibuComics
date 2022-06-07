import { useEffect, useState } from 'react'
import style from './formaddproduct.module.css'
import icon_post_img from './img/camera.png'
import Toast from '../Toast'
import Loader from '../Loader'
import MenuManagementAdmin from '../MenuManagementAdmin'
import { useNavigate } from 'react-router-dom'


const FormAddComic = () => {
    const navigate = useNavigate();

    const [image, setImage] = useState([]);
    const [tenTruyen, setTenTruyen] = useState('');
    const [giaChap, setGiaChap] = useState(1000);
    const [tenKhac, setTenKhac] = useState('');
    const [moTa, setMoTa] = useState('');
    const [theLoai, setTheLoai] = useState('');
    const [tacGia, setTacGia] = useState('');

    function resetForm() {
        setImage([]);
        setTenTruyen('');
        setGiaChap(1000);
        setTenKhac('');
        setMoTa('');
        setTheLoai('');
        setTacGia('');
    }

    const [notify, setNotify] = useState('none');
    const [loader, setLoader] = useState('none');
    const [message, setMessage] = useState('Thêm truyện thành công.');

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

    const formSubmit = async (e) => {
        e.preventDefault();
        if (tenTruyen && moTa && giaChap !== 0 && image.length > 0) {
            setLoader('block');
            let formData = new FormData();
            formData.append('tenTruyen', tenTruyen);
            formData.append('moTa', moTa);
            formData.append('giaChap', giaChap);
            formData.append('tenKhac', tenKhac);
            formData.append('theLoai', theLoai);
            formData.append('tacGia', tacGia);


            for (let i = 0; i < image.length; i++) {
                formData.append('image', image[i], image[i].name)
            }

            await fetch(process.env.REACT_APP_API_ENDPOINT + '/comic/add-comic', {
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
                        await fetch(process.env.REACT_APP_API_ENDPOINT + '/comic/add-comic', {
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
                    setLoader('none');
                })
        }
        else {
            setMessage('Chưa điền đủ thông tin');
            setNotify('block');
            setTimeout(() => {
                setNotify('none');
            }, 7000)
        }
    }

    return (
        <>
            <MenuManagementAdmin />
            <div className={style.container} >
                <Loader loader={loader} />
                <Toast notify={notify} message={message} />
                <form onSubmit={e => formSubmit(e)} className={style.formAddProduct} method='POST'>
                    <div className={style.box_img}>
                        <div className={style.input_img}>
                            <input onChange={handleOnChangeInputImg} id='id_img' name='image' type='file' multiple />
                            <label className={style.label_input_img} htmlFor='id_img'>
                                <img src={icon_post_img} alt='icon post img' />
                                <div className={style.button_select_img}>Chọn ảnh bìa truyện</div>
                            </label>
                        </div>
                        <div className={style.preview_img}>
                            {image.map((e, index) => { return <img key={index} src={e.preview} alt='img preview' /> })}
                        </div>
                    </div>

                    <div className={style.box_input}>

                        <div className={style.box_text}>
                            <span className={style.title_input}>*Tên truyện</span>
                            <input value={tenTruyen} autoComplete='off' id='tenTruyen' onChange={e => setTenTruyen(e.target.value)} name='tenTruyen' type='text' />
                            <span className={style.title_input}>Tên khác</span>
                            <input value={tenKhac} autoComplete='off' id='tenKhac' onChange={e => setTenKhac(e.target.value)} name='tenKhac' type='text' />

                            <span className={style.title_input}>*Mô tả</span>
                            <input value={moTa} onChange={e => setMoTa(e.target.value)} name='moTa' type='text' />
                            <span className={style.title_input}>*Giá Chap (VNĐ)</span>
                            <input value={giaChap} onChange={e => setGiaChap(e.target.value)} name='giaChap' type='number' />

                            <span className={style.title_input}>Thể loại</span>
                            <input value={theLoai} onChange={e => setTheLoai(e.target.value)} name='theLoai' type='text' />

                            <span className={style.title_input}>Tác giả</span>
                            <input value={tacGia} onChange={e => setTacGia(e.target.value)} name='tacGia' type='text' />

                        </div>


                        <button type='submit' className={style.addProduct}>Thêm sản phẩm</button>

                    </div>


                </form>

            </div>
        </>
    )
}

export default FormAddComic