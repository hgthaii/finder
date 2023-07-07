/* eslint-disable */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.min.css'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Section } from '../../components'
import { Outlet, useNavigate } from 'react-router-dom'
SwiperCore.use([Navigation, Pagination])
const Mylist = () => {
    const navigate = useNavigate()

    const [favorites, setFavorites] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            axios
                .get(`${process.env.REACT_APP_API_URI}/user/favorites`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                })
                .then((response) => {
                    setFavorites(response.data)
                })
                .catch((error) => {
                    if (error.response.data && error.response.data.statusCode === 401) {
                        navigate('/expired-token')
                    }
                    console.error(error)
                })
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
            900: {
                slidesPerView: 4,
                centeredSlides: false,
            },
        },
    }
    return (
        <div className=" mt-[100px]">
            {favorites.length !== 0 && (
                <div>
                    <h3 className="pl-12 text-white mb-3 text-[18px] font-bold dark:text-main-300">
                        Danh sách của tôi
                    </h3>
                    <div className=" w-full">
                        <Swiper {...swiperParams}>
                            {favorites?.map((item, index) => (
                                <SwiperSlide key={item._id} className="swiper-scale">
                                    <Section data={item} />
                                </SwiperSlide>
                            ))}
                            <div className="swiper-button-next swiper-button-wrapper"></div>
                            <div className="swiper-button-prev swiper-button-wrapper"></div>
                            <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                        </Swiper>
                    </div>
                </div>
            )}
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Mylist
