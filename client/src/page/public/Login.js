/* eslint-disable */
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { GoogleLogin } from 'react-google-login'
import { gapi } from 'gapi-script'
import axios from 'axios'

import isEmpty from 'validator/lib/isEmpty'
// import isEmail from 'validator/lib/isEmail'

import logoWhite from '../../asset/image/FinderWhite.svg'
import { Box, Modal } from '@mui/material'
import Register from './Register'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const client_id = '689641141844-dm1eiuln8nqg3rtncacmh64d6mv9skjf.apps.googleusercontent.com'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 800,
    // height: 550,
    padding: '50px',
    background: '#030014',
    boxShadow: 24,
}
const Login = ({ onClose }) => {
    const [password, setPassword] = useState('')
    const [validationMsg, setValidationMsg] = useState()
    const [usernameValidationMsg, setUsernameValidationMsg] = useState()
    const [passwordValidationMsg, setPasswordValidationMsg] = useState()
    const [cookies, setCookie] = useCookies(['accessToken', 'refreshToken'])
    const [loading, setLoading] = useState(false)

    const onSubmitLogin = async () => {
        setUsernameValidationMsg('')
        setPasswordValidationMsg('')
        setValidationMsg('')
        try {
            setLoading(true)
            const response = await axios.post(`${process.env.REACT_APP_API_URI}/user/signin`, {
                username,
                password,
            })

            const handleSetTokens = () => {
                const accessTokenExpiration = new Date()
                accessTokenExpiration.setHours(accessTokenExpiration.getHours() + 24) // Hết hạn sau 1 giờ
                const refreshTokenExpiration = new Date()
                refreshTokenExpiration.setHours(refreshTokenExpiration.getHours() + 72) // Hết hạn sau 24 giờ

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
            const getToken = response.data.access_token
            const getrfToken = response.data.refresh_token
            localStorage.setItem('accessToken', getToken)
            localStorage.setItem('refreshToken', getrfToken)
            const accessToken = localStorage.getItem('accessToken') || cookies.accessToken

            const tokenBody = accessToken.split('.')[1]
            // const tokenBody = response.data.access_token.split('.')[1]
            const base64 = tokenBody?.replace(/-/g, '+')?.replace(/_/g, '/') // Chuẩn hóa chuỗi Base64
            // Giai ma body voi base64
            const decodedTokenBody = decodeURIComponent(escape(atob(base64)))

            // Giai ma cac phan tu JSON cua body
            const parsedTokenBody = JSON.parse(decodedTokenBody)

            localStorage.setItem('displayName', parsedTokenBody.infor.displayName)
            localStorage.setItem('userId', parsedTokenBody.infor.id)
            localStorage.setItem('isVip', parsedTokenBody.infor.isVip)
            if (parsedTokenBody.roles === 'admin') {
                toast.success('Đăng nhập thành công')
                // navigate('/home-admin')
                onClose()
            } else if (parsedTokenBody.roles === 'user') {
                toast.success('Đăng nhập thành công')
                onClose()
                navigate('/')
            }
            setLoading(false)
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message
                const requiredMessage = error.response.data
                if (errorMessage && (errorMessage.includes('Username') || errorMessage.includes('Tài khoản'))) {
                    setUsernameValidationMsg(errorMessage)
                } else if (errorMessage && (errorMessage.includes('password') || errorMessage.includes('mật khẩu'))) {
                    setPasswordValidationMsg(errorMessage)
                } else if (errorMessage && requiredMessage.includes('username')) {
                    console.log('first' + requiredMessage)
                } else {
                    setValidationMsg('Vui lòng nhập tài khoản hoặc mật khẩu!')
                }
            } else {
                toast.error('Đăng nhập không thành công')
            }
        }
    }
    const [username, setUsername] = useState()
    const navigate = useNavigate()
    const onChangeUsername = (event) => {
        setUsernameValidationMsg('')
        const value = event.target.value
        if (value.length >= 4) {
            setUsername(value)
        } else {
            setUsernameValidationMsg('Nhập tối thiểu 4 ký tự')
        }
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
        navigate('/signup')
    }
    const handleClose = () => {
        setOpen(false)
    }
    // useEffect(() => {
    //     function start() {
    //         gapi.client.init({
    //             clientId: client_id,
    //             scope: ""
    //         })
    //     }
    //     gapi.load('client:auth2', start)

    // })

    const onSuccess = (res) => {
        console.log(res)
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API_URI}/user/googlelogin`,
            data: { tokenId: res.tokenId },
        }).then((res) => {
            console.log('Login success', res)
            localStorage.setItem('accessToken', res.data.access_token)
            localStorage.setItem('refreshToken', res.data.refresh_token)
            localStorage.setItem('displayName', res.data.displayName)
            localStorage.setItem('isVip', res.data.isVip)
            console.log(res)
            localStorage.setItem('userId', res.data.userId)
            const accessToken = localStorage.getItem('accessToken')

            const tokenBody = accessToken.split('.')[1]
            const base64 = tokenBody?.replace(/-/g, '+')?.replace(/_/g, '/') // Chuẩn hóa chuỗi Base64
            // Giai ma body voi base64
            const decodedTokenBody = decodeURIComponent(escape(atob(base64)))

            // Giai ma cac phan tu JSON cua body
            const parsedTokenBody = JSON.parse(decodedTokenBody)

            if (parsedTokenBody.roles === 'admin') {
                toast.success('Đăng nhập thành công')
                navigate('/')
            } else if (parsedTokenBody.roles === 'user') {
                toast.success('Đăng nhập thành công')
                onClose()
                navigate('/')
            }
        })
    }

    const onFailure = (res) => {
        console.log('LOGIN FAILURE! res: ', res)
    }

    // const accessToken = gapi.auth.getToken().id_token;

    return (
        <div className="bg-[#030014] h-full px-6 flex items-center justify-center flex-col">
            <img src={logoWhite} alt="logo" className="mt-3" />
            <div className="flex flex-col text-white mt-3">
                <h3 className="text-xl font-semibold uppercase">ĐĂNG NHẬP</h3>
                <p className="text-red-400 text-xs "> {validationMsg}</p>
                <input
                    type="text"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                    placeholder="Emai hoặc số điện thoại..."
                    onChange={onChangeUsername}
                    onKeyPress={handleKeyPress}
                />
                <p className="text-red-400 text-xs "> {usernameValidationMsg}</p>
                <input
                    type="password"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB] "
                    placeholder="Mật khẩu"
                    onChange={onChangePass}
                    onKeyPress={handleKeyPress}
                />
                <p className="text-red-400 text-xs "> {passwordValidationMsg}</p>

                <button
                    className="bg-[#037AEB] h-12 w-[374px] mt-5 rounded-md p-3 font-semibold "
                    onClick={onSubmitLogin}
                >
                    {loading ? (
                        <svg
                            className="animate-spin text-center h-full w-full rounded text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        'TIẾP TỤC'
                    )}
                </button>
                <span className="text-center mt-2 mb-2 uppercase text-[10px]">Hoặc</span>
                <div id="signInButton">
                    <GoogleLogin
                        clientId={client_id}
                        buttonText="Sign in with Google"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy={'single_host_origin'}
                        className="btn-login-gg"
                    />
                </div>
                {/* <span
          className="text-white text-sm cursor-pointer mt-3s"
          onClick={handleOpen}
        >
          Quên mật khẩu!
        </span> */}
                <div className="mt-2 mb-4">
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
