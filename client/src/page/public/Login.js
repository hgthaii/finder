import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'

import axios from 'axios'

import isEmpty from 'validator/lib/isEmpty'
// import isEmail from 'validator/lib/isEmail'
import logo from '../../asset/image/logo.png'
import { Box, Modal } from '@mui/material'
import Register from './Register'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    height: 550,
    boxShadow: 24,
}
const Login = ({ onClose }) => {
    const [password, setPassword] = useState('')
    const [validationMsg, setValidationMsg] = useState({})
    const [cookies, setCookie] = useCookies(['accessToken', 'refreshToken'])

    // const onChangePassword = (event) => {
    //   const value = event.target.value;
    //   setPassword(value);
    // };

    const validateAll = () => {
        const msg = {}

        if (isEmpty(username)) {
            msg.password = 'Vui lòng nhập tài khoản'
        }
        if (isEmpty(password)) {
            msg.password = 'Vui lòng nhập mật khẩu'
        }

        setValidationMsg(msg)

        if (Object.keys(msg).length > 0) return false

        return true
    }

    const onSubmitLogin = async () => {
        const isValid = validateAll()
        if (!isValid) return
        try {
            const response = await axios.post('http://localhost:5000/api/v1/user/signin', {
                username,
                password,
            })
            // axios.defaults.withCredentials = true //cho phép lấy cookie từ server

            const handleSetTokens = () => {
                const accessTokenExpiration = new Date()
                accessTokenExpiration.setHours(accessTokenExpiration.getHours() + 1) // Hết hạn sau 1 giờ
                const refreshTokenExpiration = new Date()
                refreshTokenExpiration.setHours(refreshTokenExpiration.getHours() + 24) // Hết hạn sau 24 giờ

                const accessTokenOptions = {
                    path: '/',
                    expires: accessTokenExpiration,
                }

                const refreshTokenOptions = {
                    path: '/',
                    expires: refreshTokenExpiration,
                }

                setCookie('accessToken', response.data.access_token, accessTokenOptions)
                setCookie('refreshToken', response.data.refresh_token, refreshTokenOptions)
            }
            handleSetTokens()

            const tokenBody = response.data.access_token.split('.')[1]

            // Giai ma body voi base64
            const decodedTokenBody = atob(tokenBody)

            // Giai ma cac phan tu JSON cua body
            const parsedTokenBody = JSON.parse(decodedTokenBody)
            // localStorage.setItem('infor', JSON.stringify(parsedTokenBody.infor))
            // localStorage.setItem('role', JSON.stringify(parsedTokenBody.roles))

            if (parsedTokenBody.roles === 'admin') {
                toast.success('Đăng nhập thành công')
                navigate('/home-admin')
            } else if (parsedTokenBody.roles === 'user') {
                toast.success('Đăng nhập thành công')
                onClose()
                navigate('/')
            }
        } catch (error) {
            toast.error('Đăng nhập không thành công')
            console.log(error)
        }
    }
    const [username, setUsername] = useState()
    const navigate = useNavigate()
    const onChangeUsername = (event) => {
        const value = event.target.value
        setUsername(value)
    }
    const onChangePass = (event) => {
        const value = event.target.value
        setPassword(value)
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSubmitLogin()
        }
    }

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    return (
        <div className="bg-[#1E1E1E] h-full flex items-center justify-center flex-col">
            <img src={logo} alt="logo" />
            <div className="flex flex-col text-white mt-8">
                <h3 className="text-xl font-semibold">ĐĂNG NHẬP</h3>
                <input
                    type="text"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                    placeholder="Emai hoặc số điện thoại..."
                    onChange={onChangeUsername}
                    onKeyPress={handleKeyPress}
                />
                <p className="text-red-400 text-xs "> {validationMsg.email}</p>
                <input
                    type="password"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB] "
                    placeholder="Mật khẩu"
                    onChange={onChangePass}
                    onKeyPress={handleKeyPress}
                />
                <p className="text-red-400 text-xs "> {validationMsg.password}</p>

                <button
                    className="bg-[#037AEB] h-12 w-[374px] mt-5 rounded-md p-3 font-semibold "
                    onClick={onSubmitLogin}
                >
                    TIẾP TỤC
                </button>
                {/* <span
          className="text-white text-sm cursor-pointer mt-3s"
          onClick={handleOpen}
        >
          Quên mật khẩu!
        </span> */}
                <div className="mt-5  ">
                    <span className="text-[#fff9] mr-1 text-sm">Bạn mới sử dụng Finder ?</span>
                    <span className="text-white text-sm cursor-pointer" onClick={handleOpen}>
                        Đăng kí ngay!
                    </span>
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box sx={style}>
                        <Register onClose={handleClose} />
                    </Box>
                </Modal>
            </div>
        </div>
    )
}

export default Login
