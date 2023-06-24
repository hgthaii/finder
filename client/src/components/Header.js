import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { MenuItem, Menu, cardHeaderClasses } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ReviewsIcon from '@mui/icons-material/Reviews'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import axios from 'axios'

import { headerMenu } from '../ultis/menu'
import logo from '../asset/image/logo.png'
import icons from '../ultis/icons'
import { Search } from '../components/'

import Brightness7 from '@mui/icons-material/Brightness7'
import Brightness4 from '@mui/icons-material/Brightness4'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import i18n from '../translation/i18n'
import { useTranslation } from 'react-i18next'


import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import ReactPaginate from 'react-paginate'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import FolderIcon from '@mui/icons-material/Folder'
import DeleteIcon from '@mui/icons-material/Delete'

import Login from '../page/public/Login'
import ModalProfile from '../page/dashboard/ModalProfile'
import Skeleton from '@mui/material/Skeleton'
// Initialization for ES Users
import { Collapse, Dropdown, initTE } from 'tw-elements'

initTE({ Collapse, Dropdown })
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    height: 550,
    boxShadow: 24,
}
const Header = () => {
    const { AiFillBell, BiSearchAlt2, MdDarkMode, MdOutlineDarkMode } = icons
    const accessToken = localStorage.getItem('accessToken')
    const displayNameVal = localStorage.getItem('displayName')

    const tokenParts = accessToken ? accessToken.split('.') : []
    const parsedTokenBody = accessToken ? JSON.parse(atob(tokenParts[1])) : {}
    const checkValueStorage = parsedTokenBody.infor || {}

    const [anchorEl, setAnchorEl] = useState(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const [theme, setTheme] = useState('light')

    const openn = Boolean(anchorEl)

    const ActiveStyle = 'py-2 px-[25px]  text-[16px] text-[#02E7F5] font-bold'
    const noActiveStyle = 'py-2 px-[25px] font-medium text-[16px] text-white  '

    const [isMobile, setIsMobile] = useState(false)


    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

    }, [theme])

    const handleThemeSwitch = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    const handleResize = () => {
        if (window.innerWidth <= 1024) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    function changeLanguage(e) {
        i18n.changeLanguage(e.target.value)
    }

    const { t } = useTranslation()


    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
        navigate('/signin')
    }
    const handleClose = () => {
        setOpen(false)
        navigate('/')
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleCloseAnchorEl = () => {
        setAnchorEl(null)
    }
    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URI}/user/signout`, null, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            localStorage.clear();
            window.location.href = '/'
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset
            if (scrollTop > 0) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])
    const [openProfile, setOpenProfile] = React.useState(false)
    const handleOpenProfile = () => {
        setOpenProfile(true)
    }
    const handleCloseProfile = () => {
        setOpenProfile(false)
    }
    const [openListComment, setOpenListComment] = React.useState(false)
    const handleOpenListComment = () => {
        setOpenListComment(true)
    }
    const handleCloseListComment = () => {
        setOpenListComment(false)
    }

    const openPageAdmin = () => {
        navigate('/home-admin')
    }


    return (
        <div>
            <nav
                className={`flex-no-wrap relative flex w-full items-center justify-between  py-2 lg:flex-wrap lg:justify-start lg:py-4 ${isScrolled ? 'bg-[#030014]  animate-header' : 'bg-gradient-header animate-header'
                    } ${isMobile ? 'bg-[#030014]  animate-header' : ''}`}
                data-te-navbar-ref
            >
                <div className="flex w-full flex-wrap items-center justify-between px-3">
                    <button
                        className="block border-0 bg-transparent px-2 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
                        type="button"
                        data-te-collapse-init
                        data-te-target="#navbarSupportedContent1"
                        aria-controls="navbarSupportedContent1"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="[&>svg]:w-7">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-7 w-7"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </span>
                    </button>

                    <div
                        className="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto"
                        id="navbarSupportedContent1"
                        data-te-collapse-item
                    >
                        <a
                            className="mb-4 mr-2 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0"
                            href="#"
                        >
                            <img src={logo} alt="logo" className="object-cover max-h-20" loading="lazy" />
                        </a>
                        <ul className="list-style-none mr-auto flex flex-col pl-0 lg:flex-row" data-te-navbar-nav-ref>
                            {headerMenu.map((item, index) => (
                                <li className="mb-4 lg:mb-0 lg:pr-2  " data-te-nav-item-ref key={index}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) => (isActive ? ActiveStyle : noActiveStyle)}
                                    >
                                        {item.text}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative flex items-center">
                        <div className="flex items-center gap-4 text-white ">
                            <div className='flex '>
                                <div className="flex items-center mr-2">
                                    <select onChange={changeLanguage} className="text-black">
                                        <option value="vi">vi</option>
                                        <option value="en">en</option>
                                    </select>
                                </div>
                                <div onClick={handleThemeSwitch} className='cursor-pointer'>
                                    {theme === 'dark' ? <MdDarkMode size={30} /> : <MdOutlineDarkMode color='white' size={30} />}
                                </div>
                            </div >
                            <Search />
                            {theme === 'dark' ? <AiFillBell size={25} /> : <AiFillBell color='white' size={25} />}
                            {accessToken ? (
                                <div>
                                    <Button
                                        id="basic-button"
                                        aria-controls={openn ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={openn ? 'true' : undefined}
                                        onClick={handleClick}
                                        sx={{ color: '#02e7f5', fontWeight: '500' }}
                                    >
                                        {t('Hello')}, {displayNameVal}
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={openn}
                                        onClose={handleCloseAnchorEl}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        {parsedTokenBody.roles === 'admin' ? (
                                            [
                                                <MenuItem key="page-admin" onClick={openPageAdmin}>
                                                    <ListItemIcon>
                                                        <AdminPanelSettingsIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText>Trang quản trị</ListItemText>
                                                </MenuItem>,
                                                <MenuItem key="manage-userAdmin" onClick={handleOpenProfile}>
                                                    <ListItemIcon>
                                                        <ManageAccountsIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText>Quản lý tài khoản</ListItemText>
                                                </MenuItem>,
                                                <MenuItem key="comment-movie" onClick={handleOpenListComment}>
                                                    <ListItemIcon>
                                                        <ReviewsIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText>Bình luận của bạn</ListItemText>
                                                </MenuItem>,
                                                <MenuItem key="logout" onClick={handleLogout}>
                                                    <ListItemIcon>
                                                        <MeetingRoomIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText>Đăng xuất</ListItemText>
                                                </MenuItem>,
                                            ]
                                        ) : (
                                            [
                                                <MenuItem key="manage-user" onClick={handleOpenProfile}>
                                                    <ListItemIcon>
                                                        <ManageAccountsIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText>Quản lý tài khoản</ListItemText>
                                                </MenuItem>,
                                                <MenuItem key="comment-movieUser" onClick={handleOpenListComment}>
                                                    <ListItemIcon>
                                                        <ReviewsIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText>Bình luận của bạn</ListItemText>
                                                </MenuItem>,
                                                <MenuItem key="logout-user" onClick={handleLogout}>
                                                    <ListItemIcon>
                                                        <MeetingRoomIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText>Đăng xuất</ListItemText>
                                                </MenuItem>,
                                            ]
                                        )}
                                    </Menu>
                                    <Modal
                                        open={openProfile}
                                        onClose={handleCloseProfile}
                                        aria-labelledby="parent-modal-title"
                                        aria-describedby="parent-modal-description"
                                    >
                                        <Box sx={style}>
                                            <ModalProfile onClose={handleCloseProfile} />
                                        </Box>
                                    </Modal>
                                    <Modal
                                        open={openListComment}
                                        onClose={handleCloseListComment}
                                        aria-labelledby="parent-modal-title"
                                        aria-describedby="parent-modal-description"
                                    >
                                        <Box sx={style}>
                                            <ModalListComment onClose={handleCloseListComment} />
                                        </Box>
                                    </Modal>
                                </div>
                            ) : (
                                <div>
                                    <Button
                                        onClick={handleOpen}
                                        sx={{ color: 'black', background: 'white', fontWeight: 'bold' }}
                                    >
                                        Đăng nhập
                                    </Button>
                                    <Modal
                                        aria-labelledby="transition-modal-title"
                                        aria-describedby="transition-modal-description"
                                        open={open}
                                        onClose={handleClose}
                                        closeAfterTransition
                                        slots={{ backdrop: Backdrop }}
                                        slotProps={{
                                            backdrop: {
                                                timeout: 500,
                                            },
                                        }}
                                    >
                                        <Fade in={open}>
                                            <Box sx={style}>
                                                <Login onClose={handleClose} />
                                            </Box>
                                        </Fade>
                                    </Modal>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header

export const ModalListComment = () => {
    const accessToken = localStorage.getItem('accessToken')
    const tokenParts = accessToken ? accessToken.split('.') : []
    const parsedTokenBody = accessToken ? JSON.parse(atob(tokenParts[1])) : {}
    const checkValueStorage = parsedTokenBody.infor.id || {}
    const [reviews, setReviews] = useState([])
    useEffect(() => {
        const getReview = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URI}/movies/comments/${checkValueStorage}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                })
                setReviews(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getReview()
    }, [])

    const [currentPage, setCurrentPage] = React.useState(0)
    const PER_PAGE = 3
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected)
    }

    const offset = currentPage * PER_PAGE
    const currentPageData = reviews.slice(offset, offset + PER_PAGE)
    const [movieDetails, setMovieDetails] = React.useState({})
    const displayReviews = () => {
        return currentPageData.map((x, index) => {
            const movie = movieDetails[x.movieId]
            const title = movie ? movie[0]?.title : ''
            const poster = movie ? movie[0]?.poster_path[0].path : ''

            return (
                <div key={index} className="flex items-center my-4">
                    <img src={poster} alt="poster" className="mr-4 w-40" />
                    <div className="w-2/5">
                        <h3 className="text-lg font-bold">{title}</h3>
                        <p className="text-gray-500">Lượt thích: {x.likes.length}</p>
                        <p className="text-gray-500">Bình luận: {x.content}</p>
                    </div>
                    <button
                        className="text-white hover:bg-red-800 bg-red-700 rounded p-2 ml-24"
                        onClick={() => onDeleteReview(x._id)}
                    >
                        <DeleteIcon /> Xóa bình luận
                    </button>
                </div>
            )
        })
    }
    const onDeleteReview = async (reviewId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URI}/movies/comments/${reviewId}/delete`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            // gọi lại danh sách
            const res = await axios.get(`${process.env.REACT_APP_API_URI}/movies/comments/${checkValueStorage}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            setReviews(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchMovieDetails = async (movieId) => {
        const res = await axios.get(`${process.env.REACT_APP_API_URI}/movies/${movieId}`, {
            withCredentials: true,
        })
        const movie = res.data
        setMovieDetails((prev) => ({ ...prev, [movieId]: movie })) // lưu trữ thông tin người dùng mới với thuộc tính key là userId
    }
    useEffect(() => {
        // lấy thông phim cho từng `movieId` trong `currentPageData`
        currentPageData.forEach((x) => {
            if (!movieDetails[x.movieId]) {
                fetchMovieDetails(x.movieId)
            }
        })
    }, [currentPageData, movieDetails])
    return (
        <div className="bg-[#1E1E1E] h-full flex items-center flex-col text-white">
            <div className="flex flex-col text-white mt-8 w-4/5">
                <h3 className="text-xl font-semibold mb-4 text-center">Danh sách bình luận</h3>
                {reviews?.length > 0 ? (
                    <>
                        <div className="w-full grid grid-cols-1 gap-2">{displayReviews()}</div>
                        <ReactPaginate
                            pageCount={Math.ceil(reviews.length / PER_PAGE)}
                            onPageChange={handlePageChange}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                        />
                    </>
                ) : (
                    <h2>Not found review</h2>
                )}
            </div>
        </div>
    )
}
