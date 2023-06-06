import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.min.css'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Section, Banner } from '../../components'
import * as apis from '../../apis'

SwiperCore.use([Navigation, Pagination])
const Movieseris = () => {
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
            600: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 5,
                centeredSlides: true,
            },
            // when window width is >= 900px
            900: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 5,
                centeredSlides: false,
            },
            // when window width is >= 1200px
            1200: {
                slidesPerView: 5,
                slidesPerGroup: 1,
                spaceBetween: 10,
                centeredSlides: false,
            },
            // when window width is >= 1500px
            1500: {
                slidesPerView: 5,
                slidesPerGroup: 5,
                spaceBetween: 5,
                centeredSlides: false,
            },
            // when window width is >= 1800px
            1800: {
                slidesPerView: 6,
                slidesPerGroup: 6,
                spaceBetween: 5,
                centeredSlides: false,
            },
        },
    }
    return (
        <div className="flex flex-col w-full ">
            <Banner randomMovies={randomMovies} />
            <div className="pl-12 w-full">
                <Swiper {...swiperParams}>
                    {top10Movies?.map((item, index) => (
                        <SwiperSlide key={item._id} className='swiper-scale'>
                            <Section data={item} />
                        </SwiperSlide>
                    ))}
                    <div className="swiper-button-next swiper-button-wrapper"></div>
                    <div className="swiper-button-prev swiper-button-wrapper"></div>
                    <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                </Swiper>
            </div>
            <div className="">
                <Outlet />
            </div>
        </div>
    )
}

export default Movieseris
