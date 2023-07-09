import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/vi'
import { useTranslation } from 'react-i18next'
import io from 'socket.io-client'
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
        }, 300)
        return () => clearInterval(interval)
    }, [pastTime])
    return (
        <div className="text-white flex flex-col">
            {notify.length !== 0 ? (
                notify?.map((item) => (
                    <div key={item._id} className=" flex flex-col border border-[#404040] px-3 py-2">
                        <h4 className="font-bold text-sm ">{item?.title}</h4>
                        <p className="text-[12px]">{item?.content}</p>
                        <span className="text-[#BCBCBC] text-[12px]">{timeAgo}</span>
                    </div>
                ))
            ) : (
                <h3 className="p-4 text-center">{t('NoNotify')}</h3>
            )}
        </div>
    )
}

export default Notify
