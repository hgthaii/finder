import React, { useEffect, useState } from 'react'
import icons from '../ultis/icons';
import axios from 'axios';
import Button from '@mui/material/Button'
import { MenuItem, Menu } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import moment from 'moment';

const ReplyCommentList = ({ data, commentId, pastTime, like, replyId, handleChangeReplyList }) => {
    const {
        BsThreeDotsVertical,
        AiTwotoneLike,
        AiFillDislike,
        AiFillHeart,
        FaSmileBeam,
        BsEmojiAngryFill,
        FaBold,
        FaItalic,
        AiOutlineLink,
        MdSend,
        BsArrowReturnRight,
    } = icons
    useEffect(() => {
        const interval = setInterval(() => {
            const time = moment(pastTime).locale('vi').fromNow()
            setTimeAgo(time)
        }, 1000)
        return () => clearInterval(interval)
    }, [pastTime])
    const [timeAgo, setTimeAgo] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const openn = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleCloseDetailComment = () => {
        setAnchorEl(null)
    }
    const [successReplyList, setSuccessReplyList] = useState(false)
    const onChangeReplyList = () => {
        handleChangeReplyList(successReplyList)
    }
    const handleDeleteReplyComment = async () => {
        await axios
            .delete(`${process.env.REACT_APP_API_URI}/movies/comments/${commentId}/delete/${replyId}/reply`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                setSuccessReplyList(true)
                onChangeReplyList()
                console.log('xoa comment thanh cong')
            })
            .catch((error) => {
                console.error('Lỗi khi xóa comment', error)
            })
    }
    // Like comment
    const handleLikeClick = async (iconId) => {
        const data = {
            likedIcon: iconId,
        }

        await axios
            .put(`${process.env.REACT_APP_API_URI}/movies/comments/${replyId}/like/reply`, data, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                // Xử lý kết quả trả về từ API
                setSuccessReplyList(true)
                onChangeReplyList()

                console.log('da like thanh cong')
            })
            .catch((error) => {
                // Xử lý lỗi nếu có
                console.error(error)
            })
    }
    // Unlike comment
    const handleDislikeClick = async () => {
        await axios
            .put(`${process.env.REACT_APP_API_URI}/movies/comments/${replyId}/unlike/reply`, null, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                // Xử lý kết quả trả về từ API
                setSuccessReplyList(true)
                onChangeReplyList()

                console.log('unlike thanh cong')
            })
            .catch((error) => {
                // Xử lý lỗi nếu có
                console.error(error)
            })
    }

    //Change Icon like comment
    const handleChangeIconLike = async (iconId) => {
        const data = {
            newLikedIcon: iconId,
        }

        await axios
            .put(`${process.env.REACT_APP_API_URI}/movies/comments/${replyId}/change-liked/reply`, data, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                // Xử lý kết quả trả về từ API
                setSuccessReplyList(true)
                onChangeReplyList()

                console.log('thay doi icon thanh cong')
            })
            .catch((error) => {
                // Xử lý lỗi nếu có
                console.error(error)
            })
    }
    const getIcon = (likedIcon) => {
        switch (likedIcon) {
            case 1100:
                return (
                    <a onClick={() => handleLikeClick(1100)} className="flex gap-1 items-center">
                        <AiTwotoneLike size={19} color="yellow" /> Bạn và
                    </a>
                )
            case 1101:
                return (
                    <a onClick={() => handleLikeClick(1101)} className="flex gap-1 items-center">
                        <AiFillDislike size={19} color="yellow" /> Bạn và
                    </a>
                )
            case 1102:
                return (
                    <a onClick={() => handleLikeClick(1102)} className="flex gap-1 items-center">
                        <AiFillHeart size={19} color="yellow" /> Bạn và
                    </a>
                )
            case 1103:
                return (
                    <a onClick={() => handleLikeClick(1103)} className="flex gap-1 items-center">
                        <FaSmileBeam size={19} color="yellow" /> Bạn và
                    </a>
                )
            case 1104:
                return (
                    <a onClick={() => handleLikeClick(1104)} className="flex gap-1 items-center">
                        <BsEmojiAngryFill size={19} color="yellow" /> Bạn và
                    </a>
                )
            default:
                return null
        }
    }
    return (
        <div className="ml-16 p-2 mr-7">
            <div className="p-2 rounded-lg bg-[#333333] mt-2">
                <div className="flex justify-between items-center mb-2 ">
                    <div className="flex ">
                        <img
                            src="https://source.unsplash.com/random"
                            alt="user"
                            className="w-[40px] h-[40px] rounded-full mr-2 "
                        />
                        <div className="flex flex-col ">
                            <span className="font-bold">{data.user?.displayName}</span>
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
                            <MenuItem onClick={() => handleDeleteReplyComment()}>
                                <ListItemText>Xóa phản hồi</ListItemText>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
                <div className="text-[16px] mb-3">
                    <p>{data.content}</p>
                </div>
                <div className="flex items-end justify-end mr-8">
                    <figure className="image-box">
                        <span className="text-like">
                            <span>Thích</span>
                        </span>
                        <div className="icons">
                            {like
                                .filter((x) => x.userId === localStorage.getItem('userId'))
                                .map((x) => {
                                    switch (x.likedIcon) {
                                        case 1100:
                                            return (
                                                <>
                                                    <a onClick={() => handleDislikeClick(1100)}>
                                                        <AiTwotoneLike size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1101)}>
                                                        <AiFillDislike size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1102)}>
                                                        <AiFillHeart size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1103)}>
                                                        <FaSmileBeam size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1104)}>
                                                        <BsEmojiAngryFill size={19} color="#1E1E1E" />
                                                    </a>
                                                </>
                                            )
                                        case 1101:
                                            return (
                                                <>
                                                    <a onClick={() => handleChangeIconLike(1100)}>
                                                        <AiTwotoneLike size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleDislikeClick(1101)}>
                                                        <AiFillDislike size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1102)}>
                                                        <AiFillHeart size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1103)}>
                                                        <FaSmileBeam size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1104)}>
                                                        <BsEmojiAngryFill size={19} color="#1E1E1E" />
                                                    </a>
                                                </>
                                            )
                                        case 1102:
                                            return (
                                                <>
                                                    <a onClick={() => handleChangeIconLike(1100)}>
                                                        <AiTwotoneLike size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1101)}>
                                                        <AiFillDislike size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleDislikeClick(1102)}>
                                                        <AiFillHeart size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1103)}>
                                                        <FaSmileBeam size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1104)}>
                                                        <BsEmojiAngryFill size={19} color="#1E1E1E" />
                                                    </a>
                                                </>
                                            )
                                        case 1103:
                                            return (
                                                <>
                                                    <a onClick={() => handleChangeIconLike(1100)}>
                                                        <AiTwotoneLike size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1101)}>
                                                        <AiFillDislike size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1102)}>
                                                        <AiFillHeart size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleDislikeClick(1103)}>
                                                        <FaSmileBeam size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1104)}>
                                                        <BsEmojiAngryFill size={19} color="#1E1E1E" />
                                                    </a>
                                                </>
                                            )
                                        case 1104:
                                            return (
                                                <>
                                                    <a onClick={() => handleChangeIconLike(1100)}>
                                                        <AiTwotoneLike size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1101)}>
                                                        <AiFillDislike size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1102)}>
                                                        <AiFillHeart size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleChangeIconLike(1103)}>
                                                        <FaSmileBeam size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleDislikeClick(1104)}>
                                                        <BsEmojiAngryFill size={19} color="#1E1E1E" />
                                                    </a>
                                                </>
                                            )
                                        default:
                                            return (
                                                <>
                                                    <a onClick={() => handleLikeClick(1100)}>
                                                        <AiTwotoneLike size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleLikeClick(1101)}>
                                                        <AiFillDislike size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleLikeClick(1102)}>
                                                        <AiFillHeart size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleLikeClick(1103)}>
                                                        <FaSmileBeam size={19} color="#1E1E1E" />
                                                    </a>
                                                    <a onClick={() => handleLikeClick(1104)}>
                                                        <BsEmojiAngryFill size={19} color="#1E1E1E" />
                                                    </a>
                                                </>
                                            )
                                    }
                                })}
                            {!like.some((x) => x.userId === localStorage.getItem('userId')) && (
                                <>
                                    <a onClick={() => handleLikeClick(1100)}>
                                        <AiTwotoneLike size={19} color="#1E1E1E" />
                                    </a>
                                    <a onClick={() => handleLikeClick(1101)}>
                                        <AiFillDislike size={19} color="#1E1E1E" />
                                    </a>
                                    <a onClick={() => handleLikeClick(1102)}>
                                        <AiFillHeart size={19} color="#1E1E1E" />
                                    </a>
                                    <a onClick={() => handleLikeClick(1103)}>
                                        <FaSmileBeam size={19} color="#1E1E1E" />
                                    </a>
                                    <a onClick={() => handleLikeClick(1104)}>
                                        <BsEmojiAngryFill size={19} color="#1E1E1E" />
                                    </a>
                                </>
                            )}
                        </div>
                    </figure>

                    <span className="cursor-pointer ">Phản hồi</span>
                </div>
                <span className="flex items-center gap-2">
                    {/* {like.length > 0 ? (
                        <>
                            {like.map((x) => {
                                if (x.userId === localStorage.getItem('userId')) {
                                    return getIcon(x.likedIcon)
                                }
                            })}
                        </>
                    ) : null} */}
                    {/* {listIcon ? `${like?.length} người khác` : null} */}
                </span>
            </div>
        </div>
    )
}

export default ReplyCommentList
