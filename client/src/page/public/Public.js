import React from 'react'
import { Outlet } from 'react-router-dom'

import { Header, Footer } from '../../components'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Public = () => {
    return (
        <div className="flex flex-col bg-[#1E1E1E] text-white min-h-screen">
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            <div className="w-full h-[80px] fixed top-0 left-0 right-0 z-10">
                <Header />
            </div>
            <div className="w-full ">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Public
