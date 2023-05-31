import React, { useEffect, useState, memo } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import * as actions from '../store/actions'

import icons from '../ultis/icons'
import { useDebounce } from '../hook'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const Search = () => {
    const { BiSearchAlt2, } = icons
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
    }

    const clearSearch = () => {
        setSearchValue('')
        navigate('/')
    }

    const handleChange = (event) => {
        const value = event.target.value
        dispatch(actions.search(value))
        setSearchValue(value)
        navigate(`search`)
    }

    return (
        <div
            className={`flex  items-center  cursor-pointer ${isSearchOpen ? `w-[300px] border border-white bg-[#141414]` : ''
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

        </div>
    )
}

export default memo(Search)
