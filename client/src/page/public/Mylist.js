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


    return (
        <div className=" mt-[100px]">
            {favorites.length !== 0 && (
                <div>
                    <h3 className="pl-12 text-white mb-3 text-[18px] font-bold dark:text-main-300">
                        Danh sách của tôi
                    </h3>
                    <div className="flex flex-wrap w-full">
                        {favorites?.map((item) => (
                            <div key={item?._id} className="w-[50%]  min-[1024px]:w-[20%] rounded-lg mt-2 px-1">
                                <Section data={item} />
                            </div>
                        ))}
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
