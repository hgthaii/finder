/* eslint-disable */
import React from 'react'
import { useSelector } from 'react-redux'
import { Section } from '../../components'
import { Outlet } from 'react-router-dom'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.min.css'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
SwiperCore.use([Navigation, Pagination])
const Search = () => {
    const { searchData } = useSelector((state) => state.app)
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
        <div className=" mt-[100px]">
            <div className=" w-full">
                <Swiper {...swiperParams}>
                    {searchData?.map((item, index) => (
                        <SwiperSlide key={item._id} className="swiper-scale">
                            <Section data={item} />
                        </SwiperSlide>
                    ))}
                    <div className="swiper-button-next swiper-button-wrapper"></div>
                    <div className="swiper-button-prev swiper-button-wrapper"></div>
                    <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                </Swiper>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Search
