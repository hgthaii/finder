import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment';
import 'moment/locale/vi'
import { useTranslation } from 'react-i18next'

const Notify = ({ content, title, notify, pastTime }) => {
    const [timeAgo, setTimeAgo] = useState('')
    const { t, i18n } = useTranslation()


    useEffect(() => {
        const interval = setInterval(() => {
            if (i18n.language === 'vi') {
                const time = moment(pastTime).locale('vi').fromNow()
                setTimeAgo(time)
            } else {
                const time = moment(pastTime).locale('en').fromNow()
                setTimeAgo(time)
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [pastTime])
    const getNotifyById = () => {
        axios.delete(`${process.env.REACT_APP_API_URI}/notifications/delete-all-notify`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        })
            .then(response => {
                console.log('Xóa thành công!');
                // Thực hiện các hành động khác sau khi xóa thành công
            })
            .catch(error => {
                console.error('Đã xảy ra lỗi khi xóa:', error);
                // Xử lý lỗi nếu cần thiết
            });
    }
    return (
        <div className='text-white flex flex-col'>
            {notify.length !== 0 ? notify?.map((item) => (
                <div key={item._id} className=' flex flex-col border border-[#333] px-3 py-2'>
                    <h4 className='font-bold '>{item?.title}</h4>
                    <p>{item?.content}</p>
                    <span className='text-[#ddd]'>{timeAgo}</span>
                </div>
            ))
                : <h3 className='p-4 text-center'>{t('NoNotify')}</h3>}
            {notify.length !== 0 && <div onClick={getNotifyById} className="border border-[#333] px-3 py-2 flex justify-center items-center cursor-pointer">{t('RemoveAll')}</div>}
        </div>
    )
}

export default Notify
