import React from 'react'

import icons from '../ultis/icons'

const Modalcard = () => {
    const { BsFillPlayFill, FaUsers, AiOutlinePlus, BsInfoLg } = icons
    return (
        <div className="flex flex-col  bg-[#1A1D29] ">
            <img src="https://source.unsplash.com/random" alt="card" className="w-full object-contain" />
            <div className=" flex p-[14px] gap-2">
                <span className=" w-10 h-10 rounded-full border border-white bg-white flex items-center justify-center ">
                    <BsFillPlayFill color="black" size={30} />
                </span>
                <span className="w-10 h-10 rounded-full border border-white bg-transparent flex items-center justify-center ">
                    <FaUsers color="white" />
                </span>
                <span className="w-10 h-10 rounded-full border border-white bg-transparent flex items-center justify-center ">
                    <AiOutlinePlus color="white" />
                </span>
                <span className="w-10 h-10 rounded-full border border-white bg-transparent flex items-center justify-center ">
                    <BsInfoLg color="white" />
                </span>
            </div>

            <div className="text-white px-[14px] pb-[14px]">
                <p>
                    Bộ phim "Luca" của Disney và Pixar lấy bối cảnh tại một thị trấn trên bờ biển Ý và kể câu chuyện về
                    một thiếu niên trải qua một mùa hè khó quên với đầy những cuộc phiêu lưu cùng với người bạn mới
                    Alberto.
                </p>
            </div>
        </div>
    )
}

export default Modalcard
