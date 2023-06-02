import React from 'react'

import icons from '../ultis/icons'

const Modalcard = ({ data }) => {
    const { BsFillPlayFill, FaUsers, AiOutlinePlus, BsInfoLg } = icons
    return (
        <div className="flex flex-col h-[450px] bg-[#1A1D29] ">
            <img src={data?.poster_path?.[0]?.path} alt="card" className="w-full object-contain" />
            <div className="p-2">
                <div className=" flex p-[14px] gap-2 justify-between items-center">
                    <div className="flex flex-col text-base mt-[18px]">
                        <span className="mr-2 text-[#46D369]">Độ trùng: 94%</span>
                        <div className="flex  ">
                            <span className="mr-2 text-white">{data?.release_date ? data?.release_date : ''}</span>
                            <span className="mr-2  px-[0.4rem] border text-white border-white bg-transparent flex justify-center items-center">
                                HD
                            </span>
                        </div>
                    </div>
                    <span className="w-10 h-10 rounded-full border border-white bg-transparent flex items-center justify-center ">
                        <AiOutlinePlus color="white" />
                    </span>
                </div>

                <div className="text-white px-[14px] pb-[14px]">
                    <p>{data?.overview}</p>
                </div>
            </div>
        </div>
    )
}

export default Modalcard
