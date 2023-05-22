import { Route, Routes } from 'react-router-dom'

import { Home, Public, Movies, Movieseris, Mylist } from './page/public'
import HomePageAdmin from './page/dashboard/HomePageAdmin'
import * as action from './store/actions'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(action.getHome())
    }, [])
    return (
        <>
            <Routes>
                {/* <Route path="login" element={<Login />} /> */}
                {/* <Route path="register" element={<Register />} /> */}
                <Route path="home-admin" element={<HomePageAdmin />} />
                <Route path="/*" element={<Public />}>
                    <Route path="" element={<Home />} />
                    <Route path="movie" element={<Movies />} />
                    <Route path="movieseris" element={<Movieseris />} />
                    <Route path="mylist" element={<Mylist />} />
                    <Route path="home-admin" element={<HomePageAdmin />} />
                </Route>
            </Routes>
        </>
    )
}

export default App
