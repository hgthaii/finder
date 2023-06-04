import React, { useEffect, useState, useRef } from 'react'
import YouTube from 'react-youtube'
import ReactPlayer from 'react-player'
import icons from '../ultis/icons'
import Modal from './Modal'

const Banner = ({ banerModal, data, randomMovies }) => {
    const { BsFillPlayFill, SlLike, AiOutlinePlus, AiOutlineExclamationCircle } = icons
    const [showImage, setShowImage] = useState(true)
    const playerRef = useRef(null)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)
    //
    const handlePlayFullScreen = () => {
        setIsPlaying(true)
        setIsFullScreen(true)
    }

    const handlePause = () => {
        setIsPlaying(false)
    }

    const opt = {
        width: '100%',
        height: '100%',
        playerVars: {
            autoplay: 1,
        },
    }

    // useEffect(() => {
    //     let timeoutId
    //     let intervalId

    //     if (showImage) {
    //         timeoutId = setTimeout(() => {
    //             setShowImage(false)
    //             setIsPlaying(true)
    //         }, 5000)
    //     } else {
    //         intervalId = setInterval(() => {
    //             const videoElement = videoRef.current.getInternalPlayer()
    //             console.log(videoElement)
    //             if (videoElement && videoElement.paused) {
    //                 setShowImage(true)
    //                 setIsPlaying(false)
    //                 clearInterval(intervalId)
    //             }
    //         }, 1000)
    //     }

    //     return () => {
    //         clearTimeout(timeoutId)
    //         clearInterval(intervalId)
    //     }
    // }, [showImage])

    // const handleVideoEnded = () => {
    //     setShowImage(true)
    //     setIsPlaying(false)
    // }

    const handleWrapperRef = (ref) => {
        if (ref) {
            const videoElement = ref.getInternalPlayer()

            if (videoElement) {
                videoElement.style.objectFit = 'cover'
            }
        }
    }

    const openModal = (movies) => {
        setSelectedProduct(movies)
        setModalIsOpen(true)
    }
    const closeModal = () => {
        setModalIsOpen(false)
    }

    const opts = {
        height: '600',
        width: '100%',
        host: 'https://www.youtube.com',
        playerVars: {
            autoplay: 1,
            controls: 0,
            autohide: 1,
            wmode: 'opaque',
            origin: 'https://localhost:3000',
        },
    }

    const handleButtonClick = () => {
        setIsFullScreen(true)
    }

    // Dữ liệu video từ MongoDB
    const videoData = randomMovies?.video
    // const videoRef = useRef(null)
    // useEffect(() => {
    //     let timeoutId
    //     if (!showImage) {
    //         videoRef.current.play()
    //     } else {
    //         timeoutId = setTimeout(() => {
    //             setShowImage(false)
    //         }, 3000)
    //     }
    //     return () => clearTimeout(timeoutId)
    // }, [showImage])
    const [showVideo, setShowVideo] = useState(false)

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         setShowImage(false)
    //         setShowVideo(true)
    //     }, 3000)

    //     // Xóa timeout khi component unmount hoặc khi state `showVideo` thay đổi
    //     return () => clearTimeout(timeout)
    // }, [])
    return (
        <div className="relative">
            {/* <img
                src={banerModal ? data?.poster_path?.[0]?.path : randomMovies?.poster_path?.[0]?.path}
                alt="background"
                className={`w-full object-cover z-0  ${banerModal ? '' : 'h-[100vh]'} `}
            /> */}
            {showImage ? (
                <div>
                    <img
                        src={banerModal ? data?.poster_path?.[0]?.path : randomMovies?.poster_path?.[0]?.path}
                        // ref={imageRef}
                        alt="background"
                        className={`w-full object-cover z-0  ${banerModal ? '' : 'h-[100%]'}`}
                    />
                    <div className="bg-gradient-radial absolute top-0 bottom-0 left-0 right-0 z-[1]"></div>
                </div>
            ) : (
                <div className="relative">
                    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            <ReactPlayer
                                url="https://streamable.com/ojpt2p"
                                style={{ objectFit: 'cover' }}
                                width="100%"
                                height="100%"
                                playing={showVideo}
                            />
                            {/* <video width="100%" height="100%" ref={videoRef} muted>
                                <source
                                    src="https://app.simplified.com/preview/ac4a4296-ad65-4ccc-9459-2de3154b0ee1"
                                    type="video/webm"
                                />
                            </video> */}
                        </div>
                    </div>
                </div>
            )}
            <div className="px-12 absolute top-0 left-0 bottom-0 right-0 text-white z-[2] flex justify-center items-center flex-col bg-gradient-left">
                <div className="relative z-[100] top-2">
                    <div>
                        <img
                            src={data?.logo ? data?.logo : randomMovies?.logo}
                            alt="movives"
                            className="w-[500px] h-[100px] object-contain object-left"
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className="w-[45%] text-[#F9F9F9] text-[1rem] leading-5 my-5 ellipsis3">
                            {data?.overview || randomMovies?.overview}
                        </p>
                        <div className="flex items-center">
                            <div>
                                <button
                                    onClick={handleButtonClick}
                                    className="  flex items-center justify-center rounded-md bg-white text-black text-center font-semibold py-2 px-5 mr-2 "
                                >
                                    <BsFillPlayFill size={35} />
                                    Phát
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
                                        <span className="w-[35px] h-[35px] border border-[#ddd] rounded-full flex items-center justify-center mr-1 cursor-pointer ">
                                            {' '}
                                            <AiOutlinePlus />
                                        </span>
                                        <span className="w-[35px] h-[35px] border border-[#ddd] rounded-full flex items-center justify-center mr-1 cursor-pointer ">
                                            <SlLike />
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <button
                                        onClick={() => openModal(randomMovies)}
                                        className=" gap-2  flex items-center justify-center rounded-md bg-transparent text-white text-center font-bold py-2 px-5 ml-2 border border-white"
                                    >
                                        <AiOutlineExclamationCircle size={30} color="white" />
                                        Thông tin khác
                                    </button>
                                    <Modal isOpenModal={modalIsOpen} closeModal={closeModal} data={selectedProduct} />
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
