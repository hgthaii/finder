import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Modalcontainer } from '../../components'
const Modal = () => {
    const { id } = useParams()
    const [detailtMovies, setDetailMovie] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/movies/${id}`)
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
    }, [id])
    return (
        <div className=" fixed top-0  left-0  z-50 w-full h-full overflow-auto  ">
            <div className="animate-scaleUp ">
                <div className="relative min-w-[850px] flex items-center justify-center mt-[30px] z-50  ">
                    <Modalcontainer data={detailtMovies} />
                </div>
            </div>
        </div>
    )
}

export default Modal
