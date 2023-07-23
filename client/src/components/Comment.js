/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/vi'
import icons from '../ultis/icons'
import Button from '@mui/material/Button'
import { MenuItem, Menu } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import ReplyComment from './ReplyComment'
import ReplyCommentList from './ReplyCommentList'
import { useTranslation } from 'react-i18next'

const Comment = ({ displayName, pastTime, content, commentId, handleChangeComment, like }) => {
    const navigate = useNavigate()

    const {
        BsThreeDotsVertical,
        AiTwotoneLike,
        AiFillDislike,
        AiFillHeart,
        FaSmileBeam,
        BsEmojiAngryFill,
    } = icons
    const [timeAgo, setTimeAgo] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const openn = Boolean(anchorEl)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pastTime])


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleCloseDetailComment = () => {
        setAnchorEl(null)
    }
    const [success, setSuccess] = useState(false)
    const onChangeComment = () => {
        handleChangeComment(success)
    }
    const handleDeleteComment = async () => {
        await axios
            .delete(`${process.env.REACT_APP_API_URI}/movies/comments/${commentId}/delete`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                setSuccess(true)
                onChangeComment()
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
            .put(`${process.env.REACT_APP_API_URI}/movies/comments/${commentId}/like`, data, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                // Xử lý kết quả trả về từ API
                setSuccess(true)
                onChangeComment()

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
            .put(`${process.env.REACT_APP_API_URI}/movies/comments/${commentId}/unlike`, null, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                // Xử lý kết quả trả về từ API
                onChangeComment()

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
            .put(`${process.env.REACT_APP_API_URI}/movies/comments/${commentId}/change-liked`, data, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                // Xử lý kết quả trả về từ API
                setSuccess(true)
                onChangeComment()

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
    const [listIcon, setListIcon] = useState()
    //Get list icon like of commentId
    useEffect(() => {
        const handleListIconLike = async () => {
            await axios
                .get(`${process.env.REACT_APP_API_URI}/movies/comments/${commentId}/like-count`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                })
                .then((response) => {
                    // Xử lý kết quả trả về từ API
                    // setSuccess(true)
                    // onChangeComment()
                    setListIcon(response.data)
                    console.log('get list icon thanh cong')
                })
                .catch((error) => {
                    // Xử lý lỗi nếu có
                    if (error.response.data && error.response.data.statusCode === 401) {
                        navigate('/expired-token')
                    }
                    console.error(error)
                })
        }
        handleListIconLike()
        getListReply()
        handleChangeReply()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentId])

    const handleChangeReply = (newVal) => {
        if (newVal) {
            console.log(newVal)
            getListReply()
        }
        getListReply()
    }
    const handleChangeReplyList = (newVal) => {
        if (newVal) {
            console.log(newVal)
            getListReply()
        }
        getListReply()
    }

    const getIcon = (likedIcon) => {
        switch (likedIcon) {
            case 1100:
                return (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a onClick={() => handleLikeClick(1100)} className="flex gap-1 items-center">
                        <AiTwotoneLike size={19} color="yellow" /> {t('YouAnd_comment')}
                    </a>
                )
            case 1101:
                return (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a onClick={() => handleLikeClick(1101)} className="flex gap-1 items-center">
                        <AiFillDislike size={19} color="yellow" /> {t('YouAnd_comment')}
                    </a>
                )
            case 1102:
                return (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a onClick={() => handleLikeClick(1102)} className="flex gap-1 items-center">
                        <AiFillHeart size={19} color="yellow" /> {t('YouAnd_comment')}
                    </a>
                )
            case 1103:
                return (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a onClick={() => handleLikeClick(1103)} className="flex gap-1 items-center">
                        <FaSmileBeam size={19} color="yellow" /> {t('YouAnd_comment')}
                    </a>
                )
            case 1104:
                return (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a onClick={() => handleLikeClick(1104)} className="flex gap-1 items-center">
                        <BsEmojiAngryFill size={19} color="yellow" /> {t('YouAnd_comment')}
                    </a>
                )
            default:
                return null
        }
    }
    const [reply, setReply] = useState(false)
    const onClickBtnReply = (bool) => {
        setReply(bool)
    }
    const handleClickReply = () => {
        reply ? onClickBtnReply(false) : onClickBtnReply(true)
    }

    const [listReplyComment, setListReplyComment] = useState()
    // Get list reply in commentId
    const getListReply = async () => {
        await axios
            .get(`${process.env.REACT_APP_API_URI}/movies/comments/${commentId}/like-count/reply`, null, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                // Xử lý kết quả trả về từ API
                setListReplyComment(response.data)
                console.log('lay ds reply thanh cong' + JSON.stringify(response.data))
            })
            .catch((error) => {
                // Xử lý lỗi nếu có
                if (error.response.data && error.response.data.statusCode === 401) {
                    navigate('/expired-token')
                }
                console.error(error)
            })
    }
    const isLoggedIn = localStorage.getItem('accessToken') ? true : false

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
                            <MenuItem onClick={handleDeleteComment}>
                                <ListItemText>{t('RemoveComment_comment')}</ListItemText>
                            </MenuItem>
                        </Menu>
                    </div>
                ) : null}
            </div>
            <div className="text-[16px] mb-3">
                <p>{content}</p>
            </div>
            {isLoggedIn ? (
                <div className="flex items-end justify-end mr-8">
                    <figure className="image-box">
                        <span className="text-like dark:text-main-300 text-white">
                            <span>{t('Like')}</span>
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

                    <span onClick={handleClickReply} className="cursor-pointer ">
                        {t('Feedback_comment')}
                    </span>
                </div>
            ) : null}
            <span className="flex items-center gap-2">
                {like.length > 0 ? (
                    <>
                        {like.map((x) => {
                            if (x.userId === localStorage.getItem('userId')) {
                                return getIcon(x.likedIcon)
                            }
                        })}
                    </>
                ) : null}
                {listIcon ? `${like?.length} ${t('Other_comment')}` : null}
            </span>
            {reply ? <ReplyComment commentId={commentId} handleChangeReply={handleChangeReply} /> : null}
            {listReplyComment && listReplyComment.length > 0 && (
                <div>
                    <span>{t('FeedbackList_comment')}</span>
                    {listReplyComment.map((data) => (
                        <ReplyCommentList
                            like={like}
                            data={data}
                            replyId={data._id}
                            commentId={commentId}
                            pastTime={pastTime}
                            handleChangeReplyList={handleChangeReplyList}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Comment
