import React, { memo } from 'react'

const Section = ({ height, openModal, data, }) => {
    return (
        <>
            <div onClick={() => openModal(data)} className="cursor-pointer">
                <div className='relative'>
                    <img
                        src={data?.poster_path[0]?.path}
                        alt="movies"
                        className={`w-[240px] object-cover rounded-md h-[${height}px] px-[4px] rounded-md `}
                    />
                    <img src={data?.logo} alt="logo" className='absolute bottom-[10%] ml-3 w-[80px] h-[45px]' />

                </div>
            </div>
        </>
    )
}

export default memo(Section)
