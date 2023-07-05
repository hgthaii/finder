import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Modalcontainer } from '../../components'
const Modal = () => {
    const { movieId } = useParams()
    const navigate = useNavigate()
    const [detailtMovies, setDetailMovie] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URI}/movies/${movieId}`)
                if (response.status === 200) {
                    setDetailMovie(response.data?.[0])
                }
                // Xử lý dữ liệu nhận được
            } catch (error) {
                // Xử lý lỗi
                console.error(error)
            }
        }

        fetchData()
    }, [movieId])
    return (
        <>
            {detailtMovies && (
                <div
                    onClick={() => navigate('/')}
                    onScroll={(e) => e.preventDefault()}
                    className=" fixed top-0  left-0  z-50 w-full h-full overflow-auto bg-[#000000b3]  "
                >
                    <div className="animate-scaleUp ">
                        <div className="relative  flex items-center justify-center mt-[50px] z-50 overflow-hidden min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px] min-[992px]:max-w-[800px] min-[1200px]:max-w-[1140px]">
                            <Modalcontainer data={detailtMovies} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Modal
