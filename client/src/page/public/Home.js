import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// import { useSelector } from 'react-redux'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.min.css'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import axios from 'axios'

import { Section, Banner } from '../../components'
import * as apis from '../../apis'
import { Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'

SwiperCore.use([Navigation, Pagination])

const Home = () => {
    // const { movies } = useSelector((state) => state.app)
    const { t } = useTranslation()
    const [state, setState] = useState({
        top10Movies: null,
        genreKorean: null,
        genreCriminal: null,
        genreAnime: null,
        genreAction: null,
        genreFamily: null,
        genreAgent: null,
        genreComedy: null,
        genreDocumentary: null,
        genreScienFiction: null,
        randomMovies: [],
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    documentaryResponse,
                    comedyResponse,
                    agentResponse,
                    familyResponse,
                    actionResponse,
                    sciFiResponse,
                    animeResponse,
                    criminalResponse,
                    koreanResponse,
                    top10MoviesResponse,
                    randomMoviesResponse,
                ] = await Promise.all([
                    apis.genreDocumentary(),
                    apis.genreComedy(),
                    apis.genreAgent(),
                    apis.genreFamily(),
                    apis.genreAction(),
                    apis.genreScienFiction(),
                    apis.genreAnime(),
                    apis.genreCriminal(),
                    apis.genreKorean(),
                    apis.top10Movies(),
                    apis.apiMoviesRandom(),
                ])

                setState({
                    genreDocumentary: documentaryResponse,
                    genreComedy: comedyResponse,
                    genreAgent: agentResponse,
                    genreFamily: familyResponse,
                    genreAction: actionResponse,
                    genreScienFiction: sciFiResponse,
                    genreAnime: animeResponse,
                    genreCriminal: criminalResponse,
                    genreKorean: koreanResponse,
                    top10Movies: top10MoviesResponse,
                    randomMovies: randomMoviesResponse,
                })
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [])

    const movieId = state.randomMovies?._id

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
        <div className="">
            <Banner randomMovies={state.randomMovies} handleGetApiUPview={handleGetApiUPview} />
            <div className="relative top-[-10.3125rem] z-[6] bottom-0 left-0 mt-[100px] lg:mt-0">
                <div className="my-4">
                    <h3 className="text-white mb-2 px-[48px] text-[18px] font-bold dark:text-main-300 ">
                        {t('Hot_Movies')}
                    </h3>
                    <Swiper {...swiperParams}>
                        {state.top10Movies?.map((item, index) => (
                            <SwiperSlide key={item._id} className="swiper-scale">
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                    </Swiper>
                </div>
                <div className="my-4">
                    <h3 className="text-white mb-4 px-[48px] text-[18px] font-bold  dark:text-main-300 ">
                        {t('Crime_TV_show')}
                    </h3>
                    <Swiper {...swiperParams}>
                        {state.genreCriminal?.map((item, index) => (
                            <SwiperSlide key={item._id}>
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                    </Swiper>
                </div>
                <div className="my-4">
                    <h3 className="text-white mb-4 px-[48px] text-[18px] font-bold  dark:text-main-300 ">
                        {t('Anime_Series')}
                    </h3>
                    <Swiper {...swiperParams}>
                        {state.genreAnime?.map((item, index) => (
                            <SwiperSlide key={item._id}>
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                    </Swiper>
                </div>
                <div className="my-4">
                    <h3 className="text-white mb-4 px-[48px] text-[18px] font-bold  dark:text-main-300 ">
                        {t('Korean_TV_show')}
                    </h3>
                    <Swiper {...swiperParams}>
                        {state.genreKorean?.map((item, index) => (
                            <SwiperSlide key={item._id}>
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                    </Swiper>
                </div>
                <div className="my-4">
                    <h3 className="text-white mb-4 px-[48px] text-[18px] font-bold  dark:text-main-300 ">
                        {t('Science_fiction_and_fantasy_show')}
                    </h3>
                    <Swiper {...swiperParams}>
                        {state.genreScienFiction?.map((item, index) => (
                            <SwiperSlide key={item._id}>
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                    </Swiper>
                </div>
                <div className="my-4">
                    <h3 className="text-white mb-4 px-[48px] text-[18px] font-bold  dark:text-main-300 ">
                        {t('Children_&_Family_Movies')}
                    </h3>
                    <Swiper {...swiperParams}>
                        {state.genreFamily?.map((item, index) => (
                            <SwiperSlide key={item._id}>
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                    </Swiper>
                </div>
                <div className="my-4">
                    <h3 className="text-white mb-4 px-[48px] text-[18px] font-bold  dark:text-main-300 ">
                        {t('Action_movies')}
                    </h3>
                    <Swiper {...swiperParams}>
                        {state.genreAction?.map((item, index) => (
                            <SwiperSlide key={item._id}>
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                    </Swiper>
                </div>
                <div className="my-4">
                    <h3 className="text-white mb-4 px-[48px] text-[18px] font-bold  dark:text-main-300 ">
                        {t('Spy_action_&_adventure_movies')}
                    </h3>
                    <Swiper {...swiperParams}>
                        {state.genreAgent?.map((item, index) => (
                            <SwiperSlide key={item._id}>
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                    </Swiper>
                </div>
                <div className="my-4">
                    <h3 className="text-white mb-4 px-[48px] text-[18px] font-bold  dark:text-main-300 ">
                        {t('Comedy_movies')}
                    </h3>
                    <Swiper {...swiperParams}>
                        {state.genreComedy?.map((item, index) => (
                            <SwiperSlide key={item._id}>
                                <Section data={item} />
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-pagination"></div> {/* Hiển thị dots */}
                    </Swiper>
                </div>
                <div className="my-4">
                    <h3 className="text-white mb-4 px-[48px] text-[18px] font-bold  dark:text-main-300 ">
                        {t('Documentary_series')}
                    </h3>
                    <Swiper {...swiperParams}>
                        {state.genreDocumentary?.map((item, index) => (
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
