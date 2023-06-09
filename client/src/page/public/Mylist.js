import React, { useState, useEffect, useCookies } from 'react'
import axios from 'axios'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.min.css'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Section, } from '../../components'
import { Outlet } from 'react-router-dom'
SwiperCore.use([Navigation, Pagination])
const Mylist = () => {
    const [favirites, setFavirites] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            axios.get('http://localhost:5000/api/v1/user/favorites', {
                withCredentials: true,
            })
                .then(response => {
                    setFavirites(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
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
    return <div className=" mt-[100px]">
        <div>
            <h3 className="pl-12 text-white mb-3 text-[18px] font-bold">Danh sách của tôi</h3>
            <div className='pl-12 w-full'>
                <Swiper {...swiperParams}>
                    {favirites?.map((item, index) => (
                        <SwiperSlide key={item._id} className='swiper-scale'>
                            <Section data={item} />
                        </SwiperSlide>
                    ))}
                    <div className="swiper-button-next swiper-button-wrapper"></div>
                    <div className="swiper-button-prev swiper-button-wrapper"></div>
                    <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                </Swiper>
            </div>
        </div>
        <div >
            <Outlet />
        </div>
    </div>
}

export default Mylist
