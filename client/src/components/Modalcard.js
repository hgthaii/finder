/* eslint-disable */
import React from 'react'
import { Link } from 'react-router-dom'
import path from '../ultis/path'

import icons from '../ultis/icons'

const Modalcard = ({ data, idMovie, favorite, handlePostFav, handleDeleteFav }) => {
    const { AiOutlinePlus, AiOutlineCheck } = icons

    return (
        <Link to={`/${path.DETAIL_MOVIES}/${idMovie}`}>
            <div className="flex flex-col h-[450px]  overflow-hidden border border-white dark:border dark:border-main-300 bg-main-200 text-white dark:bg-main-100 dark:text-main-300">
                <img src={data?.poster_path?.[0]?.path} alt="card" className="w-full object-contain" />
                <div className="p-2">
                    <div className=" flex p-[14px] gap-2 justify-between items-center">
                        <div className="flex flex-col text-base mt-[18px]">
                            <div className=" text-[#46D369] text-sm mb-1">{data?.title}</div>
                            <div className="flex  items-center justify-center">
                                <span className="mr-2 ">{data?.release_date ? data?.release_date : ''}</span>
                                <span className="mr-2  px-[0.4rem] border  border-white dark:border-main-300 bg-transparent flex justify-center items-center">
                                    HD
                                </span>
                                {/* <span  className="w-10 h-10 rounded-full border border-white bg-transparent flex items-center justify-center ">
                                    <AiOutlinePlus color="white" />
                                </span> */}

                                {/* <div className="flex text-center ">
                                    {favorite?.isFavorite ? (
                                        <span
                                            onClick={handleDeleteFav}
                                            className="w-10 h-10 rounded-full border border-white bg-transparent flex items-center justify-center "
                                        >
                                            <AiOutlineCheck color="white" />
                                        </span>
                                    ) : (
                                        <span
                                            onClick={handlePostFav}
                                            className="w-10 h-10 rounded-full border border-white bg-transparent flex items-center justify-center"
                                        >
                                            <AiOutlinePlus color="white" />
                                        </span>
                                    )}

                                </div> */}
                            </div>
                        </div>
                    </div>

                    <div>
                        <p>{data?.overview}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Modalcard
