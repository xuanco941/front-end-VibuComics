import { Route, Routes, useNavigate } from 'react-router-dom'

import Admin from './Pages/Admin'
import AddComic from './Pages/AddComic'
import AllComics from './Pages/AllComics'
import AllChapters from './Pages/AllChapters'
import AChapter from './Pages/AChapter'
import AllUsers from './Pages/AllUsers'
import './App.css'

const App = () => {
    useNavigate();

    return (
        <>
            <Routes>
                <Route path='/' element={localStorage.getItem('accessTokenAdmin') ? <AllComics /> : <Admin/>} />
                <Route path='/add-comic' element={
                    localStorage.getItem('accessTokenAdmin') ? <AddComic /> : <Admin/>} />
                <Route path='/all-comics' element={localStorage.getItem('accessTokenAdmin') ? <AllComics /> : <Admin/>}/>
                <Route path='/all-chapters' element={localStorage.getItem('accessTokenAdmin') ? <AllChapters /> : <Admin/>}/>
                <Route path='/get-a-chapter' element={localStorage.getItem('accessTokenAdmin') ? <AChapter /> : <Admin/>}/>
                <Route path='/all-users' element={localStorage.getItem('accessTokenAdmin') ? <AllUsers /> : <Admin/>}/>


            </Routes>

        </>
    )
}


export default App