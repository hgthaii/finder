import axios from 'axios';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ManageNotification = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()


    const [title, setTitle] = useState()
    const [content, setContent] = useState()
    const data = {
        title: title,
        content: content,
    }
    const postNoti = async () => {
        await axios
            .post(`${process.env.REACT_APP_API_URI}/notifications/push`, data, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                toast.success('Gửi thông báo thành công')
            })
            .catch((error) => {
                if (error.response.data && error.response.data.statusCode === 401) {
                    navigate('/expired-token')
                }
                console.error('Lỗi khi gửi thông báo', error)
            })
    }
    return (
        <div className="w-full">
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <h2 className="text-2xl w-full">{t('Manage_Send_noti')}</h2>
            <div>
                <div className="flex items-center">
                    <label className="w-20 ">{t('Manage_Send_noti_title')}</label>
                    <input
                        type="text"
                        className="w-full h-10 mt-3 rounded-md p-3 bg-gray-300 pl-2"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="flex items-center">
                    <label className="w-20 ">{t('Manage_Send_noti_content')}</label>
                    <input
                        type="text"
                        className="w-full h-10 mt-3 rounded-md p-3 bg-gray-300 pl-2"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <button
                    className="bg-[#037AEB] h-10 w-[100px] mt-5 rounded-md font-semibold text-white "
                    onClick={postNoti}
                >
                    {t('btn_Confirm')}
                </button>
            </div>
        </div>
    )
}

export default ManageNotification
