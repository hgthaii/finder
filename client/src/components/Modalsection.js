import React from 'react'
import { useNavigate } from 'react-router-dom'

const Modalsection = ({ episodes, index }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/episodes/${episodes._id}`)
        // console.log('oke ne', episodes._id)
    }
    return (
        <div
            className="p-4 flex items-center justify-between  w-full  bg-main-200 text-white dark:bg-main-100 dark:text-main-300 cursor-pointer"
            onClick={handleClick}
        >
            <h3 className="px-3 text-[24px]">{index + 1}</h3>
            <img src={episodes?.episode_image} alt="image" className="object-contain w-[130px] h-[73px]" />
            <div className="flex flex-col">
                <div className="flex items-center justify-between  px-4 pt-4 pb-[8px]">
                    <span className="text-base font-bold">{episodes?.episode_title}</span>
                    <span className="text-base font-semibold md:block hidden">{episodes?.episode_runtime}</span>
                </div>
                <p className="mx-[14px] mb-[14px] ellipsis3">{episodes?.episode_description}</p>
            </div>
        </div>
    )
}

export default Modalsection
