import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from 'axios';

const NotFound = () => {
    const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken'])
    const [, , removeAllCookies] = useCookies()
    
    const refundHome = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URI}/user/signout`, null, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            localStorage.clear()
            removeAllCookies()
            removeCookie('accessToken')
            removeCookie('refreshToken')
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="h-screen flex flex-col justify-center items-center py-20 bg-gray-300">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
                <p className="text-xl font-medium text-gray-600">Oops! Trang bạn tìm kiếm không được tìm thấy.</p>
                <p className="text-sm font-medium text-gray-600 mb-3">
                    Hoặc do phiên bản đăng nhập bị hết hạn. Vui lòng đăng nhập lại!
                </p>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={refundHome}
                >
                    Go home
                </button>
                <Outlet />
            </div>
        </div>
    )
}

export default NotFound
