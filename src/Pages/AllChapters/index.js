import MenuManagementAdmin from "../../Components/MenuManagementAdmin"
import Header from "../../Components/Header"
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import clsx from "clsx";
const AllChapters = () => {
    const [chapters, setChapters] = useState([]);

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
    return (
        <>
            <Header />
            <MenuManagementAdmin />
            <div>
                {chapters.map((e) => {
                    let params = new URLSearchParams(window.location.search);
                    let comicId = params.get('comicId');
                    return <div className={clsx()}>
                        <Link to={`/get-a-chapter?comicId=${comicId}&idChap=${e.idChap}`}>{e.tenChap}</Link>
                        <button type="button">Xoa</button>
                    </div>
                })}
            </div>
        </>
    )
}
export default AllChapters