/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Modalsection, Banner, Modalcard, Comment } from './'
import icons from '../ultis/icons'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import * as actions from '../store/actions'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import Login from '../page/public/Login'
import Backdrop from '@mui/material/Backdrop'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
// import io from 'socket.io-client'

const Modalcontainer = ({ data, closeModal }) => {
    // console.log(data?.release_date[0]);
    const { AiOutlineClose, FaBold, FaItalic, AiOutlineLink } = icons
    const navigate = useNavigate()
    const [genre, setGenre] = useState([])
    const idGenre = data?.genres[0]._id
    const [comment, setComment] = useState('')
    const { movieId } = useParams()
    const displayName = localStorage.getItem('displayName')
    const userId = localStorage.getItem('userId')
    const [open, setOpen] = useState(false)
    const [favorite, setFavorite] = useState()
    // const [commentValue, setCommentValue] = useState('')
    const [postComment, setPostComment] = useState({
        content: '',
    })

    // đóng mở modal login
    const handleOpen = () => {
        setOpen(true)
    }
    // đóng mở modal login
    const handleClose = () => {
        setOpen(false)
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900,
        height: 550,
        boxShadow: 24,
    }

    useEffect(() => {
        const getGenreById = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URI}/movies/genre/${idGenre}`, {
                    withCredentials: true,
                })
                if (response.status === 200) {
                    setGenre(response.data)
                }
                // Xử lý dữ liệu nhận được
            } catch (error) {
                // Xử lý lỗi
                console.error(error)
            }
        }

        getGenreById()
    }, [idGenre])

    const checkFavoriteById = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URI}/user/favorites/${movieId}/check`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            if (response.status === 200) {
                setFavorite(response.data)
            }
            // Xử lý dữ liệu nhận được
        } catch (error) {
            // Xử lý lỗi
            console.error(error)
        }
    }

    const getCommentById = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URI}/movies/${movieId}/comments`, {
                withCredentials: true,
            })
            if (response.status === 200) {
                setComment(response.data)
            }
            // Xử lý dữ liệu nhận được
        } catch (error) {
            // Xử lý lỗi
            console.error(error)
        }
    }

    // Xóa bình luận reload list bình luận
    const handleChangeComment = (newVal) => {
        if(newVal){
            console.log(newVal)
            getCommentById();
        }
        getCommentById();
    }

    useEffect(() => {
        // getCommentById()
        handleChangeComment()
        checkFavoriteById()
    }, [movieId])

    const handlePostFav = async () => {
        await axios
            .post(
                `${process.env.REACT_APP_API_URI}/user/favorites`,
                { movieId: movieId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    withCredentials: true,
                },
            )
            .then((response) => {})
            .catch((error) => {
                console.error('Lỗi khi thêm phần tử vào danh sách yêu thích', error)
            })

        checkFavoriteById()
    }

    const handleDeleteFav = async () => {
        await axios
            .delete(`${process.env.REACT_APP_API_URI}/user/favorites/del-favorite`, {
                data: { movieId: movieId },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                withCredentials: true,
            })
            .then((response) => {})
            .catch((error) => {
                console.error('Lỗi khi xóa phần tử khỏi danh sách yêu thích', error)
            })

        checkFavoriteById()
    }

    const handleComment = async () => {
        // Gửi bình luận lên server
        await axios
            .post(
                `${process.env.REACT_APP_API_URI}/movies/comments/`,
                {
                    ...postComment,
                    movieId: movieId,
                    userId: userId,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                },
            )
            .then((response) => {
                getCommentById()
            })
            .catch((error) => {
                console.error('Lỗi khi bình luận', error)
            })
    }

    const handleInputChange = (event) => {
        setPostComment({
            content: event.target.value,
        })
        setContent({
            content: event.target.value,
        })
    }

    const handleSubmit = (event) => {
        handleComment()
        getCommentById()
        setPostComment({
            content: '',
        })
        event.preventDefault()
    }

    const [showAllEpisodes, setShowAllEpisodes] = useState(false)
    const limit = showAllEpisodes ? data?.episodes?.length : 5

      const [content, setContent] = useState('')
      const [fontWeight, setFontWeight] = useState('normal') 
      const [fontStyle, setFontStyle] = useState('normal')
      const [textDecorationLine, setTextDecorationLine] = useState('none')

      const handleBoldClick = () => {
          setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')
      }
      const handleItalicClick = () => {
          setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')
      }
      const handleUnderlineClick = () => {
          setTextDecorationLine(textDecorationLine === 'underline' ? 'none' : 'underline')
      }

      const [formats, setFormats] = React.useState(() => ['bold', 'italic'])

      const handleFormat = (event, newFormats) => {
          setFormats(newFormats)
      }
    return (
        <div className="max-w-[850px] w-full bg-[#030014] text-white !rounded-xl">
            <div className="relative ">
                <Banner
                    banerModal
                    data={data}
                    favorite={favorite}
                    handleDeleteFav={handleDeleteFav}
                    handlePostFav={handlePostFav}
                />
                <button onClick={() => navigate('/')} className="absolute top-[20px] right-[20px] cursor-pointer z-50 ">
                    <span className="w-[36px] h-[36px] rounded-full flex justify-center items-center bg-black  cursor-pointer">
                        {' '}
                        <AiOutlineClose size={25} color="white" />
                    </span>
                </button>
            </div>

            <div className="px-12 relative top-[-18px]">
                <div className="flex">
                    <div className="w-[70%] flex flex-col ">
                        <div className="flex text-base mt-[18px]">
                            {/* <span className="mr-2 text-[#46D369]">Độ trùng: 94%</span> */}
                            <span className="mr-2 text-white">{data?.release_date ? data?.release_date : ''}</span>
                            {data?.episodes?.length !== 0 && (
                                <span className="mr-2 text-white">{`${data?.episodes?.length + 1} Tập`}</span>
                            )}

                            <span className="mr-2  px-[0.4rem] border text-white border-white bg-transparent flex justify-center items-center">
                                HD
                            </span>
                        </div>
                        <div className="flex text-sm mb-[26px]">
                            <span className="  mr-2 px-[0.4rem] border text-white border-white bg-transparent flex justify-center items-center">
                                {data?.age_rating}
                            </span>
                            {/* <span className=" text-white">ngôn ngữ</span> */}
                        </div>
                        <div className="text-sm text-white ">
                            <p className="">{data?.overview}</p>
                        </div>
                    </div>
                    <div className="w-[30%] my-[18px]">
                        <div className=" text-white text-sm mb-[7px] mr-[7px]">
                            <span className="text-[#777]">Diễn viên: </span>
                            {data?.casts?.length !== 0 &&
                                data?.casts
                                    ?.slice(0, 5)
                                    ?.map((item, index) => (
                                        <span key={item._id}>{`${item.name}${index < 4 ? ', ' : ''}`}</span>
                                    ))}
                        </div>
                    </div>
                </div>
                <div className="episodes-gradient">
                    {data?.episodes?.length !== 0 && (
                        <div className="flex items-center justify-between mt-[31px] mb-[16px] font-bold">
                            <h3 className="w-[70%] text-white text-2xl">Tập </h3>
                            <span className="w-[30%] text-white text-lg text-right">{data?.duration}</span>
                        </div>
                    )}
                    {data?.episodes?.slice(0, limit).map((item, index) => (
                        <Modalsection episodes={item} key={item?._id} index={index} />
                    ))}
                    {!showAllEpisodes && data?.episodes?.length > 5 && (
                        <button className="show-more-button" onClick={() => setShowAllEpisodes(true)}>
                            <ExpandMoreIcon fontSize="large" />
                        </button>
                    )}
                    {showAllEpisodes && (
                        <button className="show-more-button" onClick={() => setShowAllEpisodes(false)}>
                            <ExpandLessIcon fontSize="large" />
                        </button>
                    )}
                </div>

                <div className="">
                    <h3 className="text-white text-2xl mt-12 mb-5 font-bold">Nội dung tương tự</h3>
                    <div className="flex flex-wrap w-full gap-3">
                        {genre &&
                            genre?.slice(0, 8).map((item) => (
                                <div key={item._id} className="w-[45%] min-[1024px]:w-[30%] rounded-lg">
                                    <Modalcard data={item} />
                                </div>
                            ))}
                    </div>
                </div>

                <div className="w-full mt-4 ">
                    {displayName === 'undefined' ? (
                        <div className="w-full flex  justify-center items-center">
                            <Button
                                onClick={handleOpen}
                                sx={{ color: 'black', background: 'white', fontWeight: 'bold' }}
                            >
                                Đăng nhập để bình luận
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
                        <div className="w-full bg-[#333333] p-8 rounded-lg">
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://source.unsplash.com/random"
                                    alt="user"
                                    className="w-12 h-12 rounded-full "
                                />
                                <span>{displayName}</span>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="border-b border-[#BCBCBC]">
                                    <textarea
                                        placeholder="Bạn nghĩ gì về bộ phim này..."
                                        value={postComment.content}
                                        onChange={handleInputChange}
                                        className=" w-full bg-[#333333] outline-none pt-2 min-h-[100px]"
                                        style={{ fontWeight, fontStyle, textDecorationLine }}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-[100px] h-[50px] text-black rounded-md bg-white  mt-3 float-right"
                                >
                                    Bình luận
                                </button>
                            </form>

                            <div className="flex justify-between items-center mt-3">
                                {/* <div className="flex gap-2">
                                    <span className="cursor-pointer" onClick={handleBoldClick}>
                                        <FaBold />
                                    </span>
                                    <span className="cursor-pointer" onClick={handleItalicClick}>
                                        <FaItalic />
                                    </span>
                                    <span className="cursor-pointer" onClick={handleUnderlineClick}>
                                        <AiOutlineLink size={20} />
                                    </span>
                                </div> */}
                                <ToggleButtonGroup value={formats} onChange={handleFormat} aria-label="text formatting">
                                    <ToggleButton value={fontWeight} aria-label={fontWeight} onClick={handleBoldClick}>
                                        <FormatBoldIcon />
                                    </ToggleButton>
                                    <ToggleButton value={fontStyle} aria-label={fontStyle} onClick={handleItalicClick}>
                                        <FormatItalicIcon />
                                    </ToggleButton>
                                    <ToggleButton
                                        value={textDecorationLine}
                                        aria-label={textDecorationLine}
                                        onClick={handleUnderlineClick}
                                    >
                                        <FormatUnderlinedIcon />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </div>
                    )}
                    <div>
                        {comment &&
                            comment.map((item) => (
                                <Comment
                                    displayName={item?.user?.displayName}
                                    pastTime={item?.createdAt}
                                    content={item?.content}
                                    key={item._id}
                                    commentId={item._id}
                                    handleChangeComment={handleChangeComment}
                                    like={item?.likes}
                                />
                            ))}
                    </div>
                </div>
                <div className="flex flex-col pb-[32px] w-full">
                    <div className="text-white mt-12 mb-5 text-2xl flex">
                        <span className="mr-2">Giới thiệu về </span>
                        <h3 className="font-bold">{data?.title} </h3>
                    </div>
                    <div className="text-sm  ">
                        <span className="text-[#777777]">Diễn viên: </span>
                        {data?.casts?.map((item, index) => (
                            <span key={item._id}>{`${item.name}${index < item?.length ? ', ' : ''}`}</span>
                        ))}
                    </div>

                    <div className=" text-sm my-[7px] mr-[7px] w-full ">
                        <span className="text-[#777777]">Thể loại: </span>
                        {data?.genres?.map((item, index) => (
                            <span key={item._id}>{`${item.name}${index < item?.length ? ', ' : ''}`}</span>
                        ))}
                    </div>
                    <div className=" text-sm my-[7px] mr-[7px] ">
                        <span className="text-[#777777]">Chương trình này: </span>
                        {data?.program_type?.map((item, index) => (
                            <span key={item._id}> {`${item.name}${index < item?.length ? ', ' : ''}`}</span>
                        ))}
                    </div>
                    <div className="flex text-sm my-[7px] mr-[7px] ">
                        <span className="text-[#777777]">Xếp hạng độ tuổi: </span>
                        <span className=" w-10 h-5 mx-2 px-[0.4rem] border text-white border-white bg-transparent flex justify-center items-center">
                            {data?.age_rating}
                        </span>
                        <span> {`Phù hợp với độ tuổi từ ${data?.age_rating} trở lên`} </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modalcontainer
