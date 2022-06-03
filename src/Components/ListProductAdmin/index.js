import axios from 'axios';
import { useEffect, useState } from 'react';
import style from './listproductadmin.module.css'
import { useNavigate } from 'react-router-dom';

const ListProductAdmin = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        function getProduct() {
            axios.get(process.env.REACT_APP_API_ENDPOINT + '/comic/get-all-comics').then(response => {
                setProducts(response.data);
            });
        }

        getProduct();

        return () => {
            setProducts([]);
        }
    }, [])


    async function handleButtonXoa(comicId) {

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
                    localStorage.setItem('accessTokenAdmin', data.accessTokenAdmin);
                }
                else {
                    alert(data.message);
                    localStorage.removeItem('accessTokenAdmin');
                    localStorage.removeItem('refreshTokenAdmin');
                    navigate('/');
                }
            });



        await fetch(process.env.REACT_APP_API_ENDPOINT + '/comic/delete-comic', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('accessTokenAdmin')
            },
            body: JSON.stringify({
                comicId
            })
        }).then(res => res.json()).then(async (data) => {
            if (data.status === 'error') {
                alert(data.message);
                localStorage.removeItem('accessTokenAdmin');
                navigate('/');
            }
            else {
                setProducts(prev => prev.filter(elm => elm._id !== comicId));
            }
        }
        );
    }

    return <table className={style.table}>
        <tbody>
            <tr>
                <th>Ảnh bìa</th>
                <th>Tên truyện</th>
                <th>Thể loại</th>
                <th>Giá chap</th>
                <th>Mô tả</th>
                <th>Tên khác</th>
                <th>Tác giả</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
                <th>Danh sách chap</th>
            </tr>
        </tbody>

        {products.length > 0 ? products.map(e => {

            return <tbody key={e.id}>
                <tr data-id={e.id} className={style.tr}>
                    {/* <td className={style.box_img} >
                        {e.image.map((img, index_img) => {
                            return <img key={index_img} className={style.img} src={img} alt='img' />
                        })}
                    </td> */}
                    <td>img</td>
                    <td>{e.tenTruyen}</td>
                    <td>{e.theLoai}</td>
                    <td>{e.giaChap}</td>
                    <td>{e.moTa}</td>
                    <td>{e.tenKhac}</td>
                    <td>{e.tacGia}</td>
                    <td>{e.daHoanThanh === true ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</td>
                    <td><button onClick={elm => handleButtonXoa(e.id)}>Xóa</button>
                    </td>
                    <td>Xem</td>
                </tr>
            </tbody>



        }) : <tbody>

            <tr><td>Không có truyện nào</td></tr>
        </tbody>}



    </table>
}

export default ListProductAdmin;