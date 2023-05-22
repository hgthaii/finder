import React from 'react'

const Section = ({ height, openModal, data }) => {
    return (
        <>
            <div onClick={() => openModal(data)} className="cursor-pointer">
                <img
                    src={data?.poster_path[0]?.path}
                    alt="movies"
                    className={`w-[240px] object-cover rounded-md h-[${height}px] px-[4px] rounded-md `}
                />
            </div>
        </>
    )
}

export default Section
