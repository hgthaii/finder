import React, { useEffect, useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useSelector } from 'react-redux'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.min.css'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import axios from 'axios'

import { Section, Banner } from '../../components'
import * as apis from '../../apis'
import { Outlet } from 'react-router'

SwiperCore.use([Navigation, Pagination])

const Home = () => {
    const { movies } = useSelector((state) => state.app)
    const [top10Movies, setTop10Movies] = useState(null)
    const [randomMovies, setRandomMovies] = useState([])
    const [isNextClicked, setIsNextClicked] = useState(false)
    const prevRef = useRef(null)
    const movieId = randomMovies?._id
    const handleNextClick = () => {
        setIsNextClicked(true)
    }

    useEffect(() => {
        const fetchTop10Movies = async () => {
            const response = await apis.top10Movies()
            setTop10Movies(response)
        }
        fetchTop10Movies()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apis.apiMoviesRandom()
                setRandomMovies(response)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [])

    const handleGetApiUPview = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URI}/movies/${movieId}/view`)
            console.log(response);
        } catch (error) {
            console.error(error)
        }
    }

    const swiperParams = {
        slidesPerView: 5,
        slidesPerGroup: 5,
        spaceBetween: 10,
        initialSlide: 0,
        loopPreventsSliding: true,
        preventClicks: true,
        speed: 1000,
        autoHeight: false,
        centeredSlides: false,
        loop: true,
        pagination: {
            el: '.swiper-pagination', // CSS selector cho phần tử hiển thị dots
            clickable: true, // Cho phép người dùng nhấp vào dots để chuyển đến slide tương ứng
            // dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            // when window width is >= 600px
            100: {
                slidesPerView: 1,
                centeredSlides: true,

            },
            480: {
                slidesPerView: 2,
                centeredSlides: true,

            },
            768: {
                slidesPerView: 3,
                centeredSlides: false,
            },
            // when window width is >= 900px
            900: {
                slidesPerView: 4,
                centeredSlides: false,
            },

        },
    }

    return (
        <div className="">
            <Banner randomMovies={randomMovies} handleGetApiUPview={handleGetApiUPview} />
            <div className="relative top-[-10.3125rem] z-[6] bottom-0 left-0 mt-[100px] lg:mt-0">
                <div className="my-4">
                    <h3 className="text-white mb-2 px-[48px] text-[18px] font-bold dark:text-main-300 ">Mới phát hành</h3>
                    <Swiper {...swiperParams}>
                        {movies?.map((item, index) => (
                            <SwiperSlide key={item._id} className="swiper-scale">
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next" onClick={handleNextClick}></div>
                        {isNextClicked && <div className="swiper-button-prev" ref={prevRef}></div>}
                        <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                    </Swiper>
                </div>
                <div className="my-4">
                    <h3 className="text-white mb-4 px-[48px] text-[18px] font-bold  dark:text-main-300 ">Đang thịnh hành</h3>
                    <Swiper {...swiperParams}>
                        {top10Movies?.map((item, index) => (
                            <SwiperSlide key={item._id}>
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next" onClick={handleNextClick}></div>
                        {isNextClicked && <div className="swiper-button-prev" ref={prevRef}></div>}
                        <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                    </Swiper>
                </div>
            </div>
            <div className="">
                <Outlet />
            </div>
        </div>
    )
}

export default Home
