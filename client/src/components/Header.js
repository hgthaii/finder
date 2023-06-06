import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { MenuItem, Menu } from '@mui/material'
import { headerMenu } from '../ultis/menu'
import logo from '../asset/image/logo.png'
import icons from '../ultis/icons'
import { Search } from '../components/'

import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import Login from '../page/public/Login'

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

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const checkValueStorage = JSON.parse(localStorage.getItem('infor'))
    const [anchorEl, setAnchorEl] = useState(null)
    const [isScrolled, setIsScrolled] = useState(false)

    const openn = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleCloseAnchorEl = () => {
        setAnchorEl(null)
    }
    const handleLogout = () => {
        localStorage.removeItem('infor')
        localStorage.removeItem('role')
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
    return (
        <div
            className={`flex items-center px-[48px] justify-between ${
                isScrolled ? 'bg-[#030014] animate-header' : 'bg-gradient-header animate-header'
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
                {checkValueStorage === null ? (
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
                ) : (
                    <div>
                        <Button
                            id="basic-button"
                            aria-controls={openn ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openn ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{ color: '#02e7f5' }}
                        >
                            {checkValueStorage.displayName}
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
                            <MenuItem onClick={handleCloseAnchorEl}>Profile</MenuItem>
                            <MenuItem onClick={handleCloseAnchorEl}>My account</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
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
