import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Section, } from '../../components'
import { Outlet } from 'react-router-dom'
const Search = () => {
    const { searchData } = useSelector((state) => state.app)
    console.log(searchData)


    return (
        <>
            <div className="mt-[80px] flex flex-wrap w-full px-[48px] ">
                {searchData &&
                    searchData?.map((item) => (
                        <div key={item?._id} className="pt-[34px]">
                            <Section height={136} data={item} className="w-[25%] rounded-lg " />
                        </div>
                    ))}
            </div>
            <div className="">
                <Outlet />
            </div>
        </>
    )
}

export default Search
