/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.min.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import axios from 'axios'

import { Section, Banner } from '../../components'
import * as apis from '../../apis'

SwiperCore.use([Navigation, Pagination])
const Movieseris = () => {
    const [randomMovies, setRandomMovies] = useState([])
    const [top10Movies, setTop10Movies] = useState(null)
    const movieId = randomMovies?._id

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

    useEffect(() => {
        const top10Movies = async () => {
            const reponse = await apis.top10Movies()
            setTop10Movies(reponse)
        }
        top10Movies()
    }, [])
    const handleGetApiUPview = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URI}/movies/${movieId}/view`)
            console.log(response)
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
        speed: 1050,
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
                slidesPerGroup: 4,
                centeredSlides: false,
            },
        },
    }
    return (
        <div className=" ">
            <Banner randomMovies={randomMovies} handleGetApiUPview={handleGetApiUPview} />
            <div className="relative top-[-10.3125rem] z-[6] bottom-0 left-0 mt-[100px] lg:mt-0">
                <div className=" my-4">
                    <h3 className="text-white mb-2 px-[48px] text-[18px] font-bold dark:text-main-300 ">
                        Phim truyền hình mới
                    </h3>
                    <Swiper {...swiperParams}>
                        {top10Movies?.map((item, index) => (
                            <SwiperSlide key={item._id} className="swiper-scale">
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
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

export default Movieseris
