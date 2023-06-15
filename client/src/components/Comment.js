/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/vi'
import icons from '../ultis/icons'
import Button from '@mui/material/Button'
import { MenuItem, Menu } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'

const Comment = ({ displayName, pastTime, content, commentId }) => {
    const { BsThreeDotsVertical, AiTwotoneLike, AiFillDislike, AiFillHeart, FaSmileBeam, BsEmojiAngryFill } = icons
    const [timeAgo, setTimeAgo] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const openn = Boolean(anchorEl)

    useEffect(() => {
        const interval = setInterval(() => {
            const time = moment(pastTime).locale('vi').fromNow()
            setTimeAgo(time)
        }, 1000)
        return () => clearInterval(interval)
    }, [pastTime])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleCloseDetailComment = () => {
        setAnchorEl(null)
    }
    const handleDeleteComment = async () => {
        await axios
            .delete(`${process.env.REACT_APP_API_URI}/movies/comments/${commentId}/delete`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                console.log('xoa comment thanh cong')
            })
            .catch((error) => {
                console.error('Lỗi khi xóa comment', error)
            })
    }

    return (
        <div className="w-full  border-b border-[#404040] py-4 my-4">
            <div className="flex justify-between items-center mb-2">
                <div className="flex ">
                    <img
                        src="https://source.unsplash.com/random"
                        alt="user"
                        className="w-[48px] h-[48px] rounded-full mr-2 "
                    />
                    <div className="flex flex-col ">
                        <span className="font-bold">{displayName}</span>
                        <span>{timeAgo}</span>
                    </div>
                </div>
                <div className="">
                    <Button
                        id="basic-button"
                        aria-controls={openn ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openn ? 'true' : undefined}
                        onClick={handleClick}
                        sx={{ color: '#02e7f5', fontWeight: '500' }}
                    >
                        <BsThreeDotsVertical />
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openn}
                        onClose={handleCloseDetailComment}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleDeleteComment}>
                            <ListItemText>Xóa bình luận</ListItemText>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
            <div className="text-[16px] mb-3">
                <p>{content}</p>
            </div>
            <div className="flex items-end">
                <figure className="image-box">
                    <span className="text-like">Thích</span>
                    <div className="icons">
                        <a href="#">
                            <AiTwotoneLike size={19} color="#1E1E1E" />
                        </a>
                        <a href="#">
                            <AiFillDislike size={19} color="#1E1E1E" />
                        </a>
                        <a href="#">
                            <AiFillHeart size={19} color="#1E1E1E" />
                        </a>
                        <a href="#">
                            <FaSmileBeam size={19} color="#1E1E1E" />
                        </a>
                        <a href="#">
                            <BsEmojiAngryFill size={19} color="#1E1E1E" />
                        </a>
                    </div>
                </figure>
                <span>Phản hồi</span>
            </div>
        </div>
    )
}

export default Comment
