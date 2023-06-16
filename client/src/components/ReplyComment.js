import React, { useState } from 'react'
import icons from '../ultis/icons'
import axios from 'axios';

const ReplyComment = ({ commentId }) => {
    const { MdSend, BsArrowReturnRight } = icons
    const [content, setContent] = useState()
    // Like comment
    const handleLikeClick = async () => {
        const data = {
            content: content,
        }

        await axios
            .post(`${process.env.REACT_APP_API_URI}/movies/comments/${commentId}/reply`, data, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                // Xử lý kết quả trả về từ API

                console.log('da phan hoi thanh cong' + response)
                // console.log('da phan hoi thanh cong' + JSON.stringify(response))
            })
            .catch((error) => {
                // Xử lý lỗi nếu có
                console.error(error)
            })
    }
    return (
        <div className="flex justify-between">
            <BsArrowReturnRight size={40} color="grey" className="ml-7 mt-2 mr-2" />
            <div className="flex justify-end w-11/12 mr-8">
                <div className="w-full bg-[#333333] rounded-lg  flex justify-between">
                    <form className="flex justify-between items-center w-full">
                        <img
                            src="https://source.unsplash.com/random"
                            alt="user"
                            className="w-10 h-10 rounded-full mb-12 m-4 "
                        />

                        <div className="border-b border-[#BCBCBC] w-4/5">
                            <textarea
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Bạn muốn phản hồi điều gì..."
                                className="bg-[#333333] outline-none w-full"
                            ></textarea>
                        </div>

                        <MdSend
                            size={25}
                            color="#2d86ff"
                            className=" cursor-pointer m-5"
                            onClick={() => handleLikeClick()}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ReplyComment
