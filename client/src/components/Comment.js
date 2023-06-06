import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'

import icons from '../ultis/icons'
const Comment = () => {

    const { BsThreeDotsVertical } = icons
    const { movieId } = useParams()
    const [comment, setComment] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1//movies/${movieId}/comments`, {
                    withCredentials: true,
                })
                if (response.status === 200) {
                    setComment(response.data)
                }
                // Xử lý dữ liệu nhận được
            } catch (error) {
                // Xử lý lỗi
                console.error(error)
            }
        }

        fetchData()
    }, [movieId])
    console.log(comment);
    return (
        <div className='w-full  border-b border-[#404040] py-4 my-4'>
            <div className="flex justify-between items-center mb-2">
                <div className='flex '>
                    <img src="https://source.unsplash.com/random" alt="user" className='w-[48px] h-[48px] rounded-full mr-2 ' />
                    <div className="flex flex-col ">
                        <span className='font-bold'>Tung</span>
                        <span>5 phút trước</span>
                    </div>
                </div>
                <div className="">
                    <BsThreeDotsVertical />
                </div>
            </div>
            <div className="text-[16px] mb-3">
                <p>Bộ phim "Inception" là một tác phẩm điện ảnh đầy hấp dẫn và đặc biệt. Được đạo diễn bởi
                    Christopher Nolan, phim mang đến một cuộc phiêu lưu tâm lý đầy bất ngờ và khám phá về giới
                    hạn của hiện thực.
                </p>
            </div>
            <div >
                <span className='mr-3'>Thích</span>
                <span>Phản hồi</span>
            </div>
        </div>
    )
}

export default Comment
