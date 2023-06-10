import React, { useState } from 'react'
import isEmpty from 'validator/lib/isEmpty'
// import isEmail from "validator/lib/isEmail";
// import {  useNavigate } from "react-router-dom";
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import logo from '../../asset/image/logo.png'
const Register = ({ onClose }) => {
    // const [email, setEmail] = useState("");
    const [validationMsg, setValidationMsg] = useState({})

    // const onChangeEmail = (event) => {
    //   const value = event.target.value;
    //   setEmail(value);
    // };

    // const onChangePassword = (event) => {
    //   const value = event.target.value;
    //   setPassword(value);
    // };

    const validateAll = () => {
        const msg = {}
        // if (isEmpty(email)) {
        //     msg.email = 'Vui lòng nhập địa chỉ email'
        // } else if (!isEmail(email)) {
        //     msg.email = 'Không phải là Email vui lòng nhập lại'
        // }

        if (isEmpty(username)) {
            msg.username = 'Vui lòng nhập tài khoản'
        }
        if (isEmpty(password)) {
            msg.password = 'Vui lòng nhập mật khẩu'
        }

        setValidationMsg(msg)

        if (Object.keys(msg).length > 0) return false

        return true
    }

    const onSubmitRegister = async () => {
        const isValid = validateAll()
        if (!isValid) return
         if (!checked) {
             toast.error('Bạn phải đồng ý với điều khoản và điều kiện của Finder')
             return
         }
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URI}/user/signup`, {
                username,
                password,
                confirmPassword,
                displayName,
            })
            if (res.data && res.data.statusCode === 201) {
                onClose()
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error('Đăng ký không thành công')
            console.log(error)
        }
    }
    const [username, setUsername] = useState()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState()
    const [displayName, setDisplayName] = useState()
    const [checked, setChecked] = useState(false)
    const onChangeCheckbox = (event) => {
        setChecked(event.target.checked)
    }
    // const navigate = useNavigate();
    const onChangeUsername = (event) => {
        const value = event.target.value
        setUsername(value)
    }
    const onChangePass = (event) => {
        const value = event.target.value
        setPassword(value)
    }
    const onChangeConfirmPass = (event) => {
        const value = event.target.value
        setConfirmPassword(value)
    }
    const onChangeDisplayName = (event) => {
        const value = event.target.value
        setDisplayName(value)
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSubmitRegister()
        }
    }
    return (
        <div className="bg-[#1E1E1E] h-full">
            {/* <span className="flex justify-end  text-white mr-4 pt-4">
          Đăng nhập
        </span> */}
            <span className="mr-4 pt-4"></span>
            <div className=" flex items-center justify-center flex-col">
                <img src={logo} alt="logo" className="" />
                <div className="flex flex-col text-white mt-8">
                    {/* <span className="text-xs  text-[#fff9]">BƯỚC 1 TRÊN 2</span> */}
                    <h3 className="text-xl font-semibold">ĐĂNG KÝ</h3>
                    <input
                        type="text"
                        className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                        placeholder="Emai hoặc số điện thoại..."
                        onChange={onChangeUsername}
                        onKeyPress={handleKeyPress}
                        required
                    />
                    <p className="text-red-400 text-xs "> {validationMsg.email}</p>

                    <input
                        type="text"
                        className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                        placeholder="Nhập tên hiển thị"
                        onChange={onChangeDisplayName}
                        onKeyPress={handleKeyPress}
                        required
                    />

                    <input
                        type="password"
                        className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB] "
                        placeholder="Mật khẩu"
                        onChange={onChangePass}
                        onKeyPress={handleKeyPress}
                        required
                    />
                    <p className="text-red-400 text-xs "> {validationMsg.password}</p>

                    <input
                        type="password"
                        className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                        placeholder="Nhập lại mật khẩu"
                        onChange={onChangeConfirmPass}
                        onKeyPress={handleKeyPress}
                        required
                    />
                    {/* <p className="text-red-400 text-xs "> {validationMsg.password}</p> */}

                    <div className="mt-3 text-left">
                        <input type="checkbox" checked={checked} onChange={onChangeCheckbox}/>
                        <label htmlFor="" className="text-[12px] pl-2">
                            Tôi đồng ý với điều khoản & điều kiện của Finder
                        </label>
                    </div>

                    <button
                        className="bg-[#037AEB] h-12 w-[374px] mt-5 rounded-md p-3 font-semibold "
                        onClick={onSubmitRegister}
                    >
                        TIẾP TỤC
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Register
