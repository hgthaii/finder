import React, { useState } from 'react'
import icons from '../ultis/icons';
import axios from 'axios';
import Button from '@mui/material/Button'
import { MenuItem, Menu } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'

const ReplyCommentList = ({ data, commentId }) => {
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
    const [timeAgo, setTimeAgo] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const openn = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleCloseDetailComment = () => {
        setAnchorEl(null)
    }
    const handleDeleteReplyComment = async () => {
        await axios
            .delete(
                `${process.env.REACT_APP_API_URI}/movies/comments/${commentId}/delete/648c2711d64bb08b2e8de769/reply`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                },
            )
            .then((response) => {
                console.log('xoa comment thanh cong')
            })
            .catch((error) => {
                console.error('Lỗi khi xóa comment', error)
            })
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
                            <MenuItem onClick={handleDeleteReplyComment}>
                                <ListItemText>Xóa phản hồi</ListItemText>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
                <div className="text-[16px] mb-3">
                    <p>{data.content}</p>
                </div>
                {/* <div className="flex items-end justify-end mr-8">
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

                  <span onClick={handleClickReply} className="cursor-pointer ">
                      Phản hồi
                  </span>
              </div> */}
            </div>
        </div>
    )
}

export default ReplyCommentList