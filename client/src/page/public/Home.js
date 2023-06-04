import React, { useEffect, useState, useCallback } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useNavigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import io from 'socket.io-client'

import { Section, Banner, Modal } from '../../components'
import * as apis from '../../apis'

const Home = () => {
    const { movies } = useSelector((state) => state.app)

    const [top10Movies, setTop10Movies] = useState(null)
    const [randomMovies, setRandomMovies] = useState([])

    const openModal = (movies) => {
        const socket = io('http://localhost:5000', { transports: ['websocket'] })
        // Gửi sự kiện getComment
        socket.emit('getLatestComments')

        // Lắng nghe sự kiện 'latestComments' từ server và hiển thị các comment
        socket.on('latestComments', (comments) => {
            console.log('Sự kiện latestComments đã được kích hoạt.')
            console.log('Dữ liệu comments:', comments)
        })

        // socket.disconnect() // Ngắt kết nối khi component unmount

    }

    useEffect(() => {
        const top10Movies = async () => {
            const reponse = await apis.top10Movies()
            setTop10Movies(reponse)
        }
        top10Movies()
    }, [])


    let settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 3,
        initialSlide: 0,
        draggable: false,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    infinite: true,
                    dots: false,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: false,
                },
            },

            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                    dots: false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                },
            },
        ],
    }
    useEffect(() => {
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

        fetchData()
    }, [])
    return (
        <div className="flex flex-col w-full ">
            <Banner randomMovies={randomMovies} />
            <div className="px-12 w-full">
                <div className="flex flex-col my-4 ">
                    <h3 className="text-white mb-4 text-[18px]">Mới phát hành</h3>
                    <Slider {...settings}>
                        {movies?.map((item) => (
                            <div key={item?._id}>
                                <Section height={136} data={item} />
                            </div>
                        ))}
                    </Slider>
                </div>
                <div className="flex flex-col my-4 ">
                    <h3 className="text-white mb-4 text-[18px]">Top 10 phim hay nhất</h3>
                    <Slider {...settings}>
                        {top10Movies?.map((item) => (
                            <div key={item?._id}>
                                <Section height={136} data={item} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            <div className="">
                <Outlet />
            </div>
        </div>
    )
}

export default Home
