import React from 'react'

const Modalsection = ({ episodes, index }) => {
    return (
        <div className="p-4 flex text-white items-center justify-between  w-full ">
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
