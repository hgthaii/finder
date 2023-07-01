import React, { useEffect, useState } from 'react'
import icons from '../ultis/icons';
import axios from 'axios';
import Button from '@mui/material/Button'
import { MenuItem, Menu } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

const ReplyCommentList = ({ data, commentId, pastTime, like, replyId, handleChangeReplyList }) => {
    const navigate = useNavigate()

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
    const { t, i18n } = useTranslation()

    useEffect(() => {
        const interval = setInterval(() => {
            if (i18n.language === 'vi') {
                const time = moment(pastTime).locale('vi').fromNow()
                setTimeAgo(time)
            } else {
                const time = moment(pastTime).locale('en').fromNow()
                setTimeAgo(time)
            }
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
                if (error.response.data && error.response.data.statusCode === 401) {
                    navigate('/expired-token')
                }
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
                if (error.response.data && error.response.data.statusCode === 401) {
                    navigate('/expired-token')
                }
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
                if (error.response.data && error.response.data.statusCode === 401) {
                    navigate('/expired-token')
                }
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
                if (error.response.data && error.response.data.statusCode === 401) {
                    navigate('/expired-token')
                }
                console.error(error)
            })
    }
    const getIcon = (likedIcon) => {
        switch (likedIcon) {
            case 1100:
                return (
                    <a onClick={() => handleLikeClick(1100)} className="flex gap-1 items-center">
                        <AiTwotoneLike size={19} color="yellow" /> {t('YouAnd_commen')}
                    </a>
                )
            case 1101:
                return (
                    <a onClick={() => handleLikeClick(1101)} className="flex gap-1 items-center">
                        <AiFillDislike size={19} color="yellow" /> {t('YouAnd_commen')}
                    </a>
                )
            case 1102:
                return (
                    <a onClick={() => handleLikeClick(1102)} className="flex gap-1 items-center">
                        <AiFillHeart size={19} color="yellow" /> {t('YouAnd_commen')}
                    </a>
                )
            case 1103:
                return (
                    <a onClick={() => handleLikeClick(1103)} className="flex gap-1 items-center">
                        <FaSmileBeam size={19} color="yellow" /> {t('YouAnd_commen')}
                    </a>
                )
            case 1104:
                return (
                    <a onClick={() => handleLikeClick(1104)} className="flex gap-1 items-center">
                        <BsEmojiAngryFill size={19} color="yellow" /> {t('YouAnd_commen')}
                    </a>
                )
            default:
                return null
        }
    }
    const isLoggedIn = localStorage.getItem('accessToken') ? true : false

    return (
        <div className="ml-16 p-2 mr-7">
            <div className="p-2 rounded-lg bg-main-200 text-white dark:bg-main-100 dark:text-main-300">
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
                    {isLoggedIn ? (
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
                                    <ListItemText>{t('RemoveRespond_comment')}</ListItemText>
                                </MenuItem>
                            </Menu>
                        </div>
                    ) : null}
                </div>
                <div className="text-[16px] mb-3">
                    <p>{data.content}</p>
                </div>
                {isLoggedIn ? (
                    <div className="flex items-end justify-end mr-8">
                        <figure className="image-box ">
                            <span className="text-like">
                                <span className=" text-white dark:text-main-300">{t('Like')}</span>
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

                        <span className="cursor-pointer ">{t('Feedback_comment')}</span>
                    </div>
                ) : null}
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
