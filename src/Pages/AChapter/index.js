import MenuManagementAdmin from "../../Components/MenuManagementAdmin"
import Header from "../../Components/Header"
import { useState, useEffect } from "react";
import axios from 'axios';
import clsx from "clsx";
import style from "./achapter.module.css";


const AChapter = () => {
    const [aChapter, setAChapter] = useState([]);

    //get a chap
    useEffect(() => {
        async function getChapter() {
            let params = new URLSearchParams(window.location.search);
            let comicId = params.get('comicId');
            let tenChap = params.get('tenChap');
            await axios.get(process.env.REACT_APP_API_ENDPOINT + `/chapter/get-a-chapter?comicId=${comicId}&tenChap=${tenChap}`).then(response => {
                setAChapter(response.data);
            });
        }
        getChapter();

        return () => {
            setAChapter([]);
        }
    }, [])

    console.log(aChapter)

    const LoadIMG = () => {
        aChapter.links.map((e, index) => {
            return <div alt="img" key={index} src={e}> </div>
        })
    }

    return (
        <>
            <Header />
            <MenuManagementAdmin />
            <div className={clsx(style.box)}>
            {aChapter.length !== 0 ? LoadIMG : <h1 style={{ width: '100%', textAlign: 'center' }}>Chưa có ảnh nào</h1>}

                <div className={clsx(style.box_content)}>
                </div>
            </div>

        </>
    )
}
export default AChapter