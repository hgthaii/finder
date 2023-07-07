/* eslint-disable */
import React from 'react'
import { useSelector } from 'react-redux'
import { Section } from '../../components'
import { Outlet } from 'react-router-dom'
const Search = () => {
    const { searchData } = useSelector((state) => state.app)


    return (
        <div className=" mt-[100px]">

            <div className="flex flex-wrap w-full">
                {searchData?.map((item) => (
                    <div key={item?._id} className="w-[50%]  min-[1024px]:w-[20%] rounded-lg mt-2 px-1">
                        <Section data={item} />
                    </div>

                ))}
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Search
