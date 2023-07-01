/* eslint-disable */
import React, { useState, useEffect, useSelector } from 'react'

import * as apis from '../../apis'
import { Outlet } from 'react-router-dom'
import { Section, Banner, Modal } from '../../components'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.min.css'
import { Swiper, SwiperSlide } from 'swiper/react'

SwiperCore.use([Navigation, Pagination])
const Movies = () => {
    const [randomMovies, setRandomMovies] = useState([])
    const [top10Movies, setTop10Movies] = useState(null)

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

    const swiperParams = {
        slidesPerView: 5,
        slidesPerGroup: 1,
        spaceBetween: 10,
        initialSlide: 0,
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
        <div className="flex flex-col w-full dark:text-main-300 ">
            <Banner randomMovies={randomMovies} />
            <div className="relative top-[-10.3125rem] z-[6] bottom-0 left-0 mt-[100px] lg:mt-0">
                <div className=" w-full mt-3">
                    <Swiper {...swiperParams}>
                        {top10Movies?.map((item, index) => (
                            <SwiperSlide key={item._id} className="swiper-scale">
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next swiper-button-wrapper"></div>
                        <div className="swiper-button-prev swiper-button-wrapper"></div>
                        <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                    </Swiper >
                </div>
            </div>

            <div className="">
                <Outlet />
            </div>
        </div>
    )
}

export default Movies

