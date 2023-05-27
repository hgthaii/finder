import React, { useEffect, useState, useRef } from 'react'
import YouTube from 'react-youtube';

import movies from '../asset/image/logomoives.png'
import background from '../asset/image/background.png'
import icons from '../ultis/icons'
import axios from 'axios'
import mp4 from '../asset/mp4/22.mp4'
import * as apis from '../apis'


const Banner = ({ banerModal, data }) => {
    const { BsFillPlayFill, SlLike, AiOutlinePlus, AiOutlineExclamationCircle } = icons
    const [randomMovies, setRandomMovies] = useState([])
    const [showImage, setShowImage] = useState(false);
    const playerRef = useRef(null);

    const handleVideoEnd = () => {
        // Dừng video
        playerRef.current.internalPlayer.pauseVideo();
        // Xóa video
        playerRef.current.internalPlayer.loadVideoById(null);
        // Hiển thị hình ảnh
        setShowImage(true);
    };

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await apis.apiMoviesRandom()
            setRandomMovies(response)
            // Xử lý dữ liệu nhận được
        } catch (error) {
            // Xử lý lỗi
            console.error(error)
        }
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
    };

    return (
        <div className="relative">
            <img
                src={banerModal ? data?.poster_path?.[0]?.path : randomMovies?.poster_path?.[0]?.path}
                alt="background"
                className={`w-full object-cover z-0  ${banerModal ? '' : 'h-[600px]'}`}
            />

            {/* {showImage ? (
                <img
                    src={banerModal ? data?.poster_path?.[0]?.path : randomMovies?.poster_path?.[0]?.path}
                    alt="background"
                    className={`w-full object-cover z-0  ${banerModal ? '' : 'h-[100vh]'}`} />
            ) : (
                <YouTube
                    videoId="pQh775SP_dA" opts={opts}
                    onReady={(event) => {
                        // Lưu trữ tham chiếu đến trình phát YouTube
                        playerRef.current = event.target;
                    }}
                    onEnd={handleVideoEnd}
                />
            )} */}

            <div className="px-12 absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent  text-white">
                <div className="absolute top-[80px] pt-8 text-white">{/* phim h.hinh */}</div>
                <div className="absolute top-[40%] w-[50%] h-1/4 ">
                    <img src={data?.logo ? data?.logo : randomMovies?.logo} alt="movives" className=" w-full h-full" />
                </div>
                <div className="absolute top-[70%]">
                    <div className="flex flex-col">
                        <p className="w-[45%] text-white text-[20px] leading-5 mb-5 ellipsis3">
                            {data?.overview || randomMovies?.overview}
                        </p>
                        <div className="flex items-center">
                            <button className="  flex items-center justify-center rounded-md bg-white text-black text-center font-semibold py-2 px-5 mr-2 ">
                                <BsFillPlayFill size={35} />
                                Phát
                            </button>

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
                                <button className=" gap-2  flex items-center justify-center rounded-md bg-transparent text-white text-center font-bold py-2 px-5 ml-2 border border-white">
                                    <AiOutlineExclamationCircle size={30} color="white" />
                                    Thông tin khác
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner
