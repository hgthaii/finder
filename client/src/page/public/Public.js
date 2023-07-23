import React, { useState, useEffect, useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { ApiContext } from '../../components/ApiContext'

import { Header, Footer } from '../../components'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CircularProgress from '@mui/material/CircularProgress'

const Public = () => {
    const [theme, setTheme] = useState('light')
    const {
        top10Movies,
        randomMovies,
        genreDocumentary,
        genreComedy,
        genreAgent,
        genreKorean,
        genreAnime,
        genreAction,
        genreFamily,
        genreScienFiction,
        genreCriminal,
    } = useContext(ApiContext)
    const handleThemeSwitch = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
            localStorage.theme = 'dark'
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.theme = 'light'
        }
    }, [theme])
    return (
        <>
            {top10Movies &&
            genreDocumentary &&
            randomMovies &&
            genreComedy &&
            genreAgent &&
            genreKorean &&
            genreAnime &&
            genreAction &&
            genreFamily &&
            genreScienFiction &&
            genreCriminal ? (
                <>
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
                </>
            ) : (
                <>
                    <div className="loading-wrapper absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-main-200">
                        <CircularProgress />
                    </div>
                    <div className="loading-wrapper absolute bottom-7 left-0 right-0 flex flex-col items-center justify-center bg-main-200">
                        <span className="text-gray-500 text-[15px] text-center block">from</span>
                        <span className="text-[#02E7F5] text-center font-bold">Finder</span>
                    </div>
                </>
            )}
        </>
    )
}

export default Public
