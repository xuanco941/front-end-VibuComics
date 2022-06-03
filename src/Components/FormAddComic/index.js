
import { useEffect, useState } from 'react'
import style from './formaddproduct.module.css'
import icon_post_img from './img/camera.png'
import Toast from '../Toast'
import Loader from '../Loader'
import MenuManagementAdmin from '../MenuManagementAdmin'
import { useNavigate } from 'react-router-dom'

const categorys = [
    {
        id: 1,
        name: 'Giầy'
    },
    {
        id: 2,
        name: 'Áo'
    },
    {
        id: 3,
        name: 'Phụ kiện khác'
    }
]

const allSize = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
const FormAddComic = () => {
    const navigate = useNavigate();

    const [image, setImage] = useState([]);
    const [nameProduct, setNameProduct] = useState('');
    const [price, setPrice] = useState(1000);
    const [sale, setSale] = useState(0);
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#ffffff');
    const [checkedCategory, setCheckedCategory] = useState('Giầy');

    const [size, setSize] = useState('36');
    const [amount, setAmount] = useState(1);

    function resetForm() {
        setImage([]);
        setNameProduct('');
        setPrice(1000);
        setSale(0);
        setDescription('');
        setColor('#ffffff');
        setCheckedCategory('Giầy');
        setSize('36');
        setAmount(1);
    }

    const [notify, setNotify] = useState('none');
    const [loader, setLoader] = useState('none');
    const [message, setMessage] = useState('Thêm thành công');

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
        if (nameProduct && description && price !== 0 && image.length > 0) {
            setLoader('block');
            let formData = new FormData();
            formData.append('nameProduct', nameProduct);
            formData.append('price', price);
            formData.append('sale', sale);
            formData.append('color', color);
            formData.append('description', description);
            formData.append('category', checkedCategory);
            formData.append('size', size);
            formData.append('amount', amount);

            for (let i = 0; i < image.length; i++) {
                formData.append('image[]', image[i], image[i].name)
            }

            await fetch(process.env.REACT_APP_API_ENDPOINT + '/product/post-product', {
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('accessTokenAdmin')
                },
                body: formData
            })
                .then(res => res.json())
                .then( async (dataRes) => {
                    if (dataRes.status === 'success') {
                        resetForm();
                        setMessage('Thêm thành công');
                        setNotify('block');
                        setTimeout(() => {
                            setNotify('none');
                        }, 7000)
                    }
                    else {
                        await fetch(process.env.REACT_APP_API_ENDPOINT+'/admin/refresh-token',{
                            method: "POST",
                            headers:{
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                refreshTokenAdmin: localStorage.getItem('refreshTokenAdmin')
                            })
                        })
                        .then(res => res.json())
                        .then(data => {
                            if(data.status === 'success'){
                                localStorage.setItem('accessTokenAdmin', data.data.accessTokenAdmin);
                            }
                            else{
                                alert('Refresh Token gặp lỗi');
                                localStorage.removeItem('accessTokenAdmin');
                                navigate('/admin');                            }
                        });
                        await fetch(process.env.REACT_APP_API_ENDPOINT + '/product/post-product', {
                            method: 'POST',
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('accessTokenAdmin')
                            },
                            body: formData
                        })
                            .then(res => res.json())
                            .then(dataRes => {
                                if (dataRes.status === 'success') {
                                    resetForm();
                                    setMessage('Thêm thành công');
                                    setNotify('block');
                                    setTimeout(() => {
                                        setNotify('none');
                                    }, 7000)
                                }
                                else {
                                    alert('Token het han, moi ban dang nhap lai');
                                    localStorage.removeItem('accessTokenAdmin');
                                    navigate('/admin');
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
                            <input onChange={handleOnChangeInputImg} id='id_img' name='image' placeholder="image" type='file' multiple />
                            <label className={style.label_input_img} htmlFor='id_img'>
                                <img src={icon_post_img} alt='icon post img' />
                                <div className={style.button_select_img}>Chọn ảnh</div>
                            </label>
                        </div>
                        <div className={style.preview_img}>
                            {image.map((e, index) => { return <img key={index} src={e.preview} alt='img preview' /> })}
                        </div>
                    </div>

                    <div className={style.box_input}>

                        <div className={style.box_text}>
                            <span className={style.title_input}>Tên sản phẩm</span>
                            <input value={nameProduct} autoComplete='off' id='nameProduct' onChange={e => setNameProduct(e.target.value)} name='nameProduct' placeholder="nameProduct" type='text' />

                            <span className={style.title_input}>Phân loại</span>
                            <div className={style.box_radio}>

                                {categorys.map(category => {
                                    return <span key={category.id}>
                                        <input checked={checkedCategory === category.name} onChange={e => setCheckedCategory(category.name)} placeholder={category.name} type='radio' id={`id${category.id}`} />
                                        <label htmlFor={`id${category.id}`}>{category.name}</label>
                                    </span>
                                })}
                            </div>


                            <span className={style.title_input}>Giá (VNĐ)</span>
                            <input value={price} onChange={e => setPrice(e.target.value)} name='price' placeholder="price" type='number' />
                            <span className={style.title_input}>Giảm giá (%)</span>
                            <input value={sale} onChange={e => setSale(e.target.value)} name='sale' min='0' max='100' placeholder="sale" type='number' />
                            <span className={style.title_input}>Mô tả </span>
                            <input value={description} onChange={e => setDescription(e.target.value)} name='description' placeholder="description" type='text' />


                            <span className={style.title_input}>Màu sắc</span>
                            <input onChange={e => setColor(e.target.value)} value={color} type='color' />

                        </div>

                        <div className={style.box_type}>
                            <span className={style.title_input}>Kích cỡ & Số lượng</span>
                            <select onChange={e => { setSize(e.target.value) }} defaultValue={size} required>
                                {allSize.map((e, index) => {
                                    return <option key={index} disabled={e === size} value={e}>{e}</option>
                                })}
                            </select>
                            <input onChange={e => setAmount(e.target.value)} value={amount} className={style.input_amount} min='1' autoComplete='off' name='amount' placeholder="amount" type='number' />
                        </div>

                        <button type='submit' className={style.addProduct}>Thêm sản phẩm</button>

                    </div>


                </form>

            </div>
        </>
    )
}

export default FormAddComic