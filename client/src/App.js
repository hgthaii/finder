import { Route, Routes } from 'react-router-dom'

import { Home, Public, Movies, Movieseris, Mylist, Search, Modal } from './page/public'
import HomePageAdmin from './page/dashboard/HomePageAdmin'
import * as action from './store/actions'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import path from './ultis/path'

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
                    <Route path="" element={<Home />}>
                        <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                    </Route>
                    <Route path="movie" element={<Movies />}>
                        <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                    </Route>
                    <Route path="movieseris" element={<Movieseris />}>
                        <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                    </Route>
                    <Route path="mylist" element={<Mylist />}>
                        <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                    </Route>
                    <Route path="home-admin" element={<HomePageAdmin />} />

                    <Route path="search" element={<Search />}>
                        <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                    </Route>

                </Route>
            </Routes>
        </>
    )
}

export default App
