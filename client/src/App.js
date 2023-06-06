import { Route, Routes } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { Home, Public, Movies, Movieseris, Mylist, Search, Modal, NotFound } from './page/public'
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
    const [cookies] = useCookies(['accessToken', 'refreshToken'])
    const accessToken = cookies['accessToken']
    const tokenParts = accessToken ? accessToken.split('.') : []
    const parsedTokenBody = accessToken ? JSON.parse(atob(tokenParts[1])) : {}
    const currentRole = parsedTokenBody.roles || {}
    return (
        <Routes>
            <Route path="home-admin" element={currentRole !== 'admin' ? <NotFound /> : <HomePageAdmin />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Public />}>
                <Route path="/" element={<Home />}>
                    <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                </Route>
                <Route path="/movie" element={<Movies />}>
                    <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                </Route>
                <Route path="/movieseris" element={<Movieseris />}>
                    <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                </Route>
                <Route path="/mylist" element={<Mylist />} >
                    <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                </Route>
                <Route path="/search" element={<Search />}>
                    <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default App
