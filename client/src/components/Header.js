import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { MenuItem, Menu, cardHeaderClasses } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ReviewsIcon from '@mui/icons-material/Reviews'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import { useCookies } from 'react-cookie'
import axios from 'axios'

import { headerMenu } from '../ultis/menu'
import logo from '../asset/image/logo.png'
import icons from '../ultis/icons'
import { Search } from '../components/'

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
    const { AiFillBell, BiSearchAlt2 } = icons

    const ActiveStyle = 'py-2 px-[25px]  text-[16px] text-[#02E7F5] font-bold'
    const noActiveStyle = 'py-2 px-[25px] font-medium text-[16px] text-white'

    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
        navigate("/signin")
    }
    const handleClose = () => {
        setOpen(false)
        navigate('/')
    }

    const [cookies] = useCookies(['accessToken', 'refreshToken'])
    const accessToken = cookies['accessToken']
    const tokenParts = accessToken ? accessToken.split('.') : []
    const parsedTokenBody = accessToken ? JSON.parse(atob(tokenParts[1])) : {}
    const checkValueStorage = parsedTokenBody.infor || {}

    const [anchorEl, setAnchorEl] = useState(null)
    const [isScrolled, setIsScrolled] = useState(false)

    const openn = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleCloseAnchorEl = () => {
        setAnchorEl(null)
    }
    const handleLogout = async () => {
        await axios.post('http://localhost:5000/api/v1/user/signout', null, { withCredentials: true })
        window.location.href = '/'
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

    localStorage.setItem("displayName", checkValueStorage.displayName);
    return (
        <div
            className={`flex items-center px-[48px] justify-between ${isScrolled ? 'bg-[#030014] animate-header' : 'bg-gradient-header animate-header'
                }`}
        >
            <div className="flex items-center">
                <div className=" ">
                    <img src={logo} alt="logo" className="object-cover max-h-20" />
                </div>
                <div className="">
                    {headerMenu.map((item, index) => (
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => (isActive ? ActiveStyle : noActiveStyle)}
                            key={index}
                        >
                            {item.text}
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 text-white">
                <Search />
                {/* <BiSearchAlt2 size={25} /> */}
                <AiFillBell size={25} />
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
                            Chào, {checkValueStorage?.displayName}
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
                            <MenuItem onClick={handleOpenProfile}>
                                <ListItemIcon>
                                    <ManageAccountsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Quản lý tài khoản</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleOpenListComment}>
                                <ListItemIcon>
                                    <ReviewsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Bình luận của bạn</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <MeetingRoomIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Đăng xuất</ListItemText>
                            </MenuItem>
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
                        <Button onClick={handleOpen} sx={{ color: 'black', background: 'white', fontWeight: 'bold' }}>
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
                {/* <img
            src={user}
            alt="user"
            className="w-[48px] h-12 rounded-full border border-blue-500"
          /> */}
            </div>
        </div>
    )
}

export default Header

export const ModalListComment = () => {
    const [cookies] = useCookies(['accessToken', 'refreshToken'])
    const accessToken = cookies['accessToken']
    const tokenParts = accessToken ? accessToken.split('.') : []
    const parsedTokenBody = accessToken ? JSON.parse(atob(tokenParts[1])) : {}
    const checkValueStorage = parsedTokenBody.infor.id || {}
    const [reviews, setReviews] = useState([])
    useEffect(() => {
        const getReview = async () => {

            try {
                const res = await axios.get(`http://localhost:5000/api/v1/movies/comments/${checkValueStorage}`, {
                    withCredentials: true,
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
            await axios.delete(`http://localhost:5000/api/v1/movies/comments/${reviewId}/delete`, { withCredentials: true })
            // gọi lại danh sách
            const res = await axios.get(`http://localhost:5000/api/v1/movies/comments/${checkValueStorage}`, {
                withCredentials: true,
            })
            setReviews(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchMovieDetails = async (movieId) => {
        const res = await axios.get(`http://localhost:5000/api/v1/movies/${movieId}`, {
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