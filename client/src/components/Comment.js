import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/vi';
import icons from '../ultis/icons'
const Comment = ({ displayName, pastTime, content }) => {
    const { BsThreeDotsVertical, AiTwotoneLike, AiFillDislike, AiFillHeart, FaSmileBeam, BsEmojiAngryFill } = icons
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const time = moment(pastTime).locale('vi').fromNow();
            setTimeAgo(time);
        }, 1000);
        return () => clearInterval(interval);
    }, [pastTime]);
    return (
        <div className="w-full  border-b border-[#404040] py-4 my-4">
            <div className="flex justify-between items-center mb-2">
                <div className="flex ">
                    <img
                        src="https://source.unsplash.com/random"
                        alt="user"
                        className="w-[48px] h-[48px] rounded-full mr-2 "
                    />
                    <div className="flex flex-col ">
                        <span className="font-bold">{displayName}</span>
                        <span>{timeAgo}</span>
                    </div>
                </div>
                <div className="">
                    <BsThreeDotsVertical />
                </div>
            </div>
            <div className="text-[16px] mb-3">
                <p>{content}</p>
            </div>
            <div className="flex items-end">
                <figure class="image-box">
                    <span class="text-like">Thích</span>
                    <div class="icons">
                        <a href="#">
                            <AiTwotoneLike size={19} color="#1E1E1E" />
                        </a>
                        <a href="#">
                            <AiFillDislike size={19} color="#1E1E1E" />
                        </a>
                        <a href="#">
                            <AiFillHeart size={19} color="#1E1E1E" />
                        </a>
                        <a href="#">
                            <FaSmileBeam size={19} color="#1E1E1E" />
                        </a>
                        <a href="#">
                            <BsEmojiAngryFill size={19} color="#1E1E1E" />
                        </a>
                    </div>
                </figure>
                <span>Phản hồi</span>
            </div>
        </div>
    )
}

export default Comment
