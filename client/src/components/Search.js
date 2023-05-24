import React, { useEffect, useState, memo } from 'react'
import axios from 'axios'
import Modals from 'react-modal'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import icons from '../ultis/icons'
import { useDebounce } from '../hook'
import { Section, Modal } from './'


const Search = () => {
    const { BiSearchAlt2, GrClose } = icons
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const debounce = useDebounce(searchValue, 500)
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
    }

    const customStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
            zIndex: 1000,
        },
        content: {
            top: '80px',
            left: '0',
            right: '0',
            bottom: '0',
            maxHeight: '100%',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            border: 'none',
            zIndex: 2000,
            // backgroundColor: 'transparent'
        },
    }
    let settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 3,
        initialSlide: 0,
        draggable: false,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    }
    useEffect(() => {
        if (!debounce) {
            setSearchResults([])
            return
        }
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/genres/media/search?title=${debounce}`)
                const data = response.data
                setSearchResults(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [debounce])
    const clearSearch = () => {
        setSearchValue('')
        closeModal()
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSearchValue('')
    }

    const handleChange = (event) => {
        const value = event.target.value
        setSearchValue(value)

        if (value !== '') {
            openModal()
        } else {
            closeModal()
        }
    }

    console.log(searchResults)
    return (
        <div
            className={`flex  items-center  cursor-pointer ${
                isSearchOpen ? `w-[300px] border border-white bg-[#141414]` : ''
            }`}
        >
            <button onClick={toggleSearch} className=" mx-2 ">
                <span>
                    <BiSearchAlt2 size={25} />
                </span>
            </button>
            {isSearchOpen && (
                <div className="flex">
                    <input
                        type="text"
                        className="w-full bg-transparent outline-none px-2 py-1 "
                        placeholder="Phim, diễn viên, thể loại..."
                        value={searchValue}
                        onChange={handleChange}
                    />
                    {searchValue && (
                        <button className="px-2" onClick={clearSearch}>
                            <span className="">X</span>
                        </button>
                    )}
                </div>
            )}
            <Modals
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={customStyles}
                ariaHideApp={false}
                scrollable={true}
            >
                <div className="px-12 w-full">
                    <div className="flex flex-col mt-4">
                        <Slider {...settings}>
                            {searchResults?.map((item) => (
                                <div key={item?.id}>
                                    <Section height={136} data={item} openModal={openModal} />
                                    {/* <Modal isOpenModal={isModalOpen} closeModal={closeModal} data={searchResults} /> */}
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </Modals>
        </div>
    )
}

export default memo(Search)
