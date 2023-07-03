import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { Header, Footer } from '../../components'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Public = () => {
    const [theme, setTheme] = useState('light')

    const handleThemeSwitch = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
            localStorage.theme = "dark"
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.theme = "light"
        }

    }, [theme])
    return (
        <div className="flex relative flex-col  min-h-screen  bg-main-200 text-white dark:bg-main-100 dark:text-main-300">
            <ToastContainer
                position="bottom-left"
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
                <Header handleThemeSwitch={handleThemeSwitch} theme={theme} />
            </div>

            <div className="w-full ">
                <Outlet />
            </div>
            <Footer theme={theme} />
        </div>
    )
}

export default Public
