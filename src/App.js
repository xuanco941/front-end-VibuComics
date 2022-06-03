import { Route, Routes, useNavigate } from 'react-router-dom'

import Admin from './Pages/Admin'
import AddComic from './Pages/AddComic'
import AllComics from './Pages/AllComics'
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
            </Routes>

        </>
    )
}


export default App