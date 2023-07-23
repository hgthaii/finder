/* eslint-disable */
import { Route, Routes, Navigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import {
    Home,
    Public,
    Movies,
    Movieseris,
    Mylist,
    Search,
    Modal,
    NotFound,
    Login,
    Register,
    VNPay,
    Help,
    Detailt,
    ContactUs,
    Infomation,
} from './page/public'
import HomePageAdmin from './page/dashboard/HomePageAdmin'
import * as action from './store/actions'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import path from './ultis/path'
import Video from './components/Video'

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(action.getHome())
    }, [])
    const [cookies] = useCookies(['accessToken', 'refreshToken'])
    const accessToken = cookies.accessToken
    const tokenParts = accessToken ? accessToken.split('.') : []
    const base64 = tokenParts[1]?.replace(/-/g, '+')?.replace(/_/g, '/') // Chuẩn hóa chuỗi Base64
    const parsedTokenBody = accessToken ? JSON.parse(decodeURIComponent(escape(atob(base64)))) : {}
    const currentRole = parsedTokenBody.roles || {}

    // check token expired
    const isTokenExpired = new Date(parsedTokenBody.exp * 1000) < new Date()
    return (
        <>
            {isTokenExpired && <Navigate to="/" replace={true} />}
            <Routes>
                <Route
                    path="/home-admin"
                    element={
                        currentRole && currentRole === 'admin' ? <HomePageAdmin /> : <Navigate to="/" replace={true} />
                    }
                />
                <Route path={path.VIDEO_MOVIES__ID} element={<Video />} />
                <Route path={path.EPISODES_MOVIES__ID} element={<Video />} />
                <Route path="/" element={<Public />}>
                    <Route path="/" element={<Home />}>
                        <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                        <Route path="/signin" element={<Login />} />
                        <Route path="/signup" element={<Register />} />
                    </Route>
                    <Route path="/movie" element={<Movies />}>
                        <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                    </Route>
                    <Route path="/movieseris" element={<Movieseris />}>
                        <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                    </Route>
                    <Route path="/mylist" element={<Mylist />}>
                        <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                    </Route>
                    <Route path="/search" element={<Search />}>
                        <Route path={path.DETAIL_MOVIES__ID} element={<Modal />} />
                    </Route>
                    <Route path="/help" element={<Help />}></Route>
                    <Route path="/detailt" element={<Detailt />}></Route>
                    <Route path="/contactus" element={<ContactUs />}></Route>
                    <Route path="/infomation" element={<Infomation />}></Route>
                </Route>
                <Route path="/vnpay_return" element={<VNPay />}></Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}

export default App
