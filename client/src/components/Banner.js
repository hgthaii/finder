/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react'
import YouTube from 'react-youtube'
import ReactPlayer from 'react-player'
import icons from '../ultis/icons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'

import path from '../ultis/path'
import axios from 'axios'
import Video from './Video'
const Banner = ({ banerModal, data, randomMovies, favorite, handlePostFav, handleDeleteFav }) => {
    const { BsFillPlayFill, SlLike, AiOutlinePlus, AiOutlineExclamationCircle, AiOutlineCheck } = icons
    const [showImage, setShowImage] = useState(true)
    const [isFullScreen, setIsFullScreen] = useState(false)

    const handleWrapperRef = (ref) => {
        if (ref) {
            const videoElement = ref.getInternalPlayer()

            if (videoElement) {
                videoElement.style.objectFit = 'cover'
            }
        }
    }

    // Dữ liệu video từ MongoDB
    const videoData = randomMovies?.video
    // const videoRef = useRef(null)
    // useEffect(() => {
    //     let timeoutId
    //     timeoutId = setTimeout(() => {
    //         setShowImage(false)
    //     }, 3000)
    //     return () => clearTimeout(timeoutId)
    // }, [showImage])
    const [showVideo, setShowVideo] = useState(false)

    useEffect(() => {
        let timeout = null
        const currentPath = window.location.pathname
        // Kiểm tra xem props videoData có chứa chuỗi "movie/movieId" hay không.
        const isMoviePath = currentPath.includes('/movie/647')

        // Chạy timeout nếu đường dẫn là movie path
        if (isMoviePath) {
            timeout = setTimeout(() => {
                setShowImage(false)
                setShowVideo(true)
            }, 3000)
        }
    }, [])

    const navigate = useNavigate()

    const onClickVideo = () => {
        let idValue = data?._id
        if (randomMovies) {
            idValue = randomMovies?._id
        }
        navigate(`/video/${idValue}`)
    }
    return (
        <div className="relative">
        {/* <div className={`relative mt-[60px]  h-[400px] flex justify-center mx-[75px] pt-[10px] pb-[80px] sm:h-auto sm:m-0 sm:p-0 ${banerModal ? '!h-auto !m-0 !p-0 ' : ''}`}> */}
            {showImage ? (
                <img
                    src={banerModal ? data?.poster_path?.[0]?.path : randomMovies?.poster_path?.[0]?.path}
                    alt="background"
                    className={`w-full object-cover z-0 rounded-lg  ${banerModal ? '' : 'h-[100%]'}`}
                />
            ) : (
                <div className="relative bg-gradient-left top-0 left-0 bottom-0 z-[0]">
                    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            <ReactPlayer
                                url="https://trailer.vieon.vn/Teaser_HBO_KeThuChung.mp4"
                                style={{ objectFit: 'cover' }}
                                width="100%"
                                height="100%"
                                playing={showVideo}
                                volume={0}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="px-12 absolute top-0 left-0 bottom-0 right-0 z-[2] flex justify-center items-center flex-col bg-gradient-left"></div>
            <div className="px-12 absolute top-0 left-0 bottom-0 right-0 z-[4] flex justify-center items-center flex-col select-none">
                <div className="pb-14">
                    <div className={`md:block  hidden`}>
                        <img
                            src={data?.logo ? data?.logo : randomMovies?.logo}
                            alt="movives"
                            className="w-[500px] h-[100px] object-contain object-left"
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className={`opacity-0 sm:opacity-100 ${banerModal ? '!opacity-100' : ''} text-[#F9F9F9] text-[1rem] font-medium leading-5 my-5 ellipsis3 sm:w-[45%] w-full `}>
                            {data?.overview || randomMovies?.overview}
                        </p>
                        <div className="flex items-center">
                            <div>
                                <button
                                    // onClick={handleButtonClick}
                                    onClick={onClickVideo}
                                    className="  flex items-center justify-center rounded-full  bg-white text-black text-center font-semibold py-2 px-2 mr-2 sm:px-5 sm:rounded-md"
                                >
                                    <BsFillPlayFill size={35} />
                                    <span className={`sm:block  ${banerModal ? 'block' : 'hidden'}`}>Phát</span>
                                </button>
                                <div>
                                    {isFullScreen && (
                                        <div className="video-wrapper">
                                            <ReactPlayer
                                                url={videoData}
                                                ref={handleWrapperRef}
                                                autoPlay
                                                playing
                                                width="100%"
                                                height="100vh"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {banerModal ? (
                                <div className="">
                                    <div className="flex text-center">
                                        {favorite?.isFavorite ? (
                                            <span
                                                onClick={handleDeleteFav}
                                                className="w-[35px] h-[35px] border border-[#ddd] rounded-full flex items-center justify-center mr-1 cursor-pointer "
                                            >
                                                <AiOutlineCheck />
                                            </span>
                                        ) : (
                                            <span
                                                onClick={handlePostFav}
                                                className="w-[35px] h-[35px] border border-[#ddd] rounded-full flex items-center justify-center mr-1 cursor-pointer "
                                            >
                                                <AiOutlinePlus />
                                            </span>
                                        )}
                                        <span className="w-[35px] h-[35px] border border-[#ddd] rounded-full flex items-center justify-center mr-1 cursor-pointer ">
                                            <SlLike />
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <Link
                                        to={`${path.DETAIL_MOVIES}/${randomMovies?._id}`}
                                        className=" gap-2  flex items-center justify-center rounded-full bg-transparent text-white text-center font-bold py-2 px-2 ml-2 border border-white md:px-5 md:rounded-md"
                                    >
                                        <AiOutlineExclamationCircle size={30} color="white" />
                                        <span className='md:block hidden'>Thông tin khác</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gradient-top absolute top-0 bottom-0 left-0 right-0 z-[3]"></div>
        </div>
    )
}

export default Banner
