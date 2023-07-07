import React, { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import path from '../ultis/path'

const Section = ({ data }) => {
    const [isActive, setIsActive] = useState(false)

    const handleToggleActive = () => {
        setIsActive(!isActive)
    }
    let idValue = data?._id
    if (data?.movieId) {
        idValue = data.movieId
    }
    return (
        <Link
            to={`${path.DETAIL_MOVIES}/${idValue}`}
            className={`relative ${isActive ? 'active' : ''}  `}
            onClick={handleToggleActive}
        >
            <img
                src={data?.poster_path[0]?.path || data?.poster_path}
                alt="movies"
                className="w-[100%] h-full object-cover rounded-md "
            />
            <img
                src={data?.logo}
                alt="logo"
                className="absolute bottom-2 left-2 object-left object-contain w-[86%] h-[50%]"
            />
        </Link>
    )
}

export default memo(Section)
