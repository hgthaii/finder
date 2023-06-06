import React, { useEffect, useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useSelector } from 'react-redux'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.min.css'
import SwiperCore, { Navigation, Pagination } from 'swiper'

import { Section, Banner, } from '../../components'
import * as apis from '../../apis'
import { Outlet } from 'react-router'

SwiperCore.use([Navigation, Pagination])

const Home = () => {
    const { movies } = useSelector((state) => state.app)
    const [top10Movies, setTop10Movies] = useState(null)
    const [randomMovies, setRandomMovies] = useState([])

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
        <div className="">
            <Banner randomMovies={randomMovies} />
            <div className="relative top-[-10.3125rem] z-[6] bottom-0 left-0">
                <div className="my-4">
                    <h3 className="text-white mb-3 text-[18px] font-bold">Mới phát hành</h3>
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
                    <h3 className="text-white mb-4 text-[18px] font-bold">Mới phát hành</h3>
                    <Swiper {...swiperParams}>
                        {top10Movies?.map((item, index) => (
                            <SwiperSlide key={item._id}>
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

export default Home
