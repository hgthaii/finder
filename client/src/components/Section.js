import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import path from '../ultis/path'
const Section = ({ data }) => {
    return (
        <>
            <div className="cursor-pointer">
                <Link to={`${path.DETAIL_MOVIES}/${data?._id}`}>
                    <div className="relative">
                        <img
                            src={data?.poster_path[0]?.path}
                            alt="movies"
                            className={`w-[240px] object-cover rounded-md h-[136px] px-[4px]  `}
                        />
                        <img src={data?.logo} alt="logo" className="absolute bottom-[10%] ml-3 w-[120px] h-[70px]" />
                    </div>
                </Link>
            </div>
        </>
    )
}

export default memo(Section)
