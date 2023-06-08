import React, { useEffect, useState } from 'react'
import { Modalsection, Banner, Modalcard, Comment } from './'
import icons from '../ultis/icons'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import * as actions from '../store/actions'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
// import io from 'socket.io-client'

const Modalcontainer = ({ data, closeModal }) => {
    // console.log(data?.release_date[0]);
    const { AiOutlineClose, FaBold, FaItalic, AiOutlineLink } = icons
    const navigate = useNavigate()
    const [genre, setGenre] = useState([])
    const idGenre = data?.genres[0]._id
    const [comment, setComment] = useState('');
    const { movieId } = useParams()
    const displayName = localStorage.getItem("displayName");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/movies/genre/${idGenre}`)
                if (response.status === 200) {
                    setGenre(response.data)
                }
                // Xử lý dữ liệu nhận được
            } catch (error) {
                // Xử lý lỗi
                console.error(error)
            }
        }

        fetchData()
    }, [idGenre])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1//movies/${movieId}/comments`, {
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
        fetchData()
    }, [movieId])


    // const handleInputChange = (event) => {
    //     setComment(event.target.value);
    // };

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     // Gửi bình luận lên server hoặc xử lý bình luận ở đây
    //     console.log(comment);
    //     setComment('');
    // };

    return (
        <div className="max-w-[850px] w-full bg-[#030014] text-white !rounded-xl">
            <div className="relative ">
                <Banner banerModal data={data} />
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
                <div className="">
                    {data?.episodes?.length !== 0 && (
                        <div className="flex items-center justify-between mt-[31px] mb-[16px] font-bold">
                            <h3 className="w-[70%] text-white text-2xl">Tập </h3>
                            <span className="w-[30%] text-white text-lg text-right">{data?.duration}</span>
                        </div>
                    )}
                    {data?.episodes?.map((item, index) => (
                        <Modalsection episodes={item} key={item?._id} index={index} />
                    ))}
                </div>

                <div className="">
                    <h3 className="text-white text-2xl mt-12 mb-5 font-bold">Nội dung tương tự</h3>
                    <div className="flex flex-wrap w-full gap-3">
                        {genre &&
                            genre.map((item) => (
                                <div key={item._id} className="w-[45%] min-[1024px]:w-[30%] rounded-lg">
                                    <Modalcard data={item} />
                                </div>
                            ))}
                    </div>
                </div>

                <div className="w-full mt-4">
                    <div className="w-full bg-[#333333] p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <img
                                src="https://source.unsplash.com/random"
                                alt="user"
                                className="w-12 h-12 rounded-full "
                            />
                            <span>{displayName}</span>
                        </div>
                        <div className="border-b border-[#BCBCBC]">
                            {/* onSubmit={handleSubmit} */}
                            <form >
                                <textarea
                                    placeholder="Bạn nghĩ gì về bộ phim này..."
                                    // value={comment}
                                    // onChange={handleInputChange}
                                    className=" w-full bg-[#333333] outline-none pt-2 min-h-[100px]"
                                ></textarea>
                            </form>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                            <div className="flex gap-2">
                                <span className="cursor-pointer">
                                    <FaBold />
                                </span>
                                <span className="cursor-pointer">
                                    <FaItalic />
                                </span>
                                <span className="cursor-pointer">
                                    <AiOutlineLink size={20} />
                                </span>
                            </div>
                            <button type="submit" className="w-[100px] h-[40px] text-black rounded-md bg-white ">
                                Bình luận
                            </button>
                        </div>
                    </div>
                    <div>
                        {comment && comment.map((item) => (
                            <Comment data={item} key={item._id} />
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
