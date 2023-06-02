import React, { useEffect, useState } from 'react'
import { Modalsection, Banner, Modalcard } from './'
import icons from '../ultis/icons'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import * as actions from '../store/actions'
import { useNavigate } from 'react-router-dom'

// import io from 'socket.io-client'

const Modalcontainer = ({ data, closeModal }) => {
    // console.log(data?.release_date[0]);
    const { AiOutlineClose } = icons
    const navigate = useNavigate()
    const [genre, setGenre] = useState([])
    const idGenre = data?.genres[0].id
    console.log(closeModal)
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

    return (
        <div className=" bg-[#181818] text-white rounded-lg ">
            <div className="max-w-[850px] w-full ">
                <div className="relative ">
                    <Banner banerModal data={data} />
                    <button onClick={() => navigate('/')} className="absolute top-[20px] right-[20px] cursor-pointer  ">
                        <span className="w-[36px] h-[36px] rounded-full flex justify-center items-center bg-black  cursor-pointer">
                            {' '}
                            <AiOutlineClose size={25} color="white" />
                        </span>
                    </button>
                </div>

                <div className="px-12">
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
                                            <span key={item.id}>{`${item.name}${index < 4 ? ', ' : ''}`}</span>
                                        ))}
                            </div>
                            <div className=" text-white text-sm  my-[7px] mr-[7px]">
                                <span className="text-[#777]">Thể loại: </span>
                                {data?.genres?.map((item, index) => (
                                    <span key={item.id}> {`${item.name}${index < item?.length ? ', ' : ''}`}</span>
                                ))}
                            </div>
                            <div className="text-sm text-white my-[7px] mr-[7px]">
                                <span className="text-[#777]">Chương trình này : </span>
                                {data?.program_type?.map((item, index) => (
                                    <span key={item.id}> {`${item.name}${index < item?.length ? ', ' : ''}`}</span>
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
                            <Modalsection episodes={item} key={item?.id} index={index} />
                        ))}
                    </div>

                    <div className="">
                        <h3 className="text-white text-2xl mt-12 mb-5 font-bold">Nội dung tương tự</h3>
                        <div className="flex flex-wrap w-full gap-3">
                            {genre &&
                                genre.map((item) => (
                                    <div key={item.id} className="w-[45%] min-[1024px]:w-[30%] rounded-lg">
                                        <Modalcard data={item} />
                                    </div>
                                ))}
                        </div>
                    </div>
                    {/* <div className="">
                        <h3 className="text-white text-2xl mt-12 mb-5 font-bold">Trailer & nội dung khác</h3>

                        <div className="flex flex-wrap w-full gap-3 text-white ">
                            <div className="w-[45%] min-[1024px]:w-[30%] rounded-lg">
                                <img src="https://source.unsplash.com/random" alt="" className="object-cover" />
                                <p className="text-center font-bold text-base">
                                    Mùa 2 (Teaser 2): Sweet Tooth: Cậu bé gạc nai{' '}
                                </p>
                            </div>
                            <div className="w-[45%] min-[1024px]:w-[30%] rounded-lg">
                                <img src="https://source.unsplash.com/random" alt="" className="object-cover" />
                                <p className="text-center font-bold text-base">
                                    Mùa 2 (Teaser 2): Sweet Tooth: Cậu bé gạc nai{' '}
                                </p>
                            </div>
                            <div className="w-[45%] min-[1024px]:w-[30%] rounded-lg">
                                <img src="https://source.unsplash.com/random" alt="" className="object-cover" />
                                <p className="text-center font-bold text-base">
                                    Mùa 2 (Teaser 2): Sweet Tooth: Cậu bé gạc nai{' '}
                                </p>
                            </div>
                            <div className="w-[45%] min-[1024px]:w-[30%] rounded-lg">
                                <img src="https://source.unsplash.com/random" alt="" className="object-cover" />
                                <p className="text-center font-bold text-base">
                                    Mùa 2 (Teaser 2): Sweet Tooth: Cậu bé gạc nai{' '}
                                </p>
                            </div>
                            <div className="w-[45%] min-[1024px]:w-[30%] rounded-lg">
                                <img src="https://source.unsplash.com/random" alt="" className="object-cover" />
                                <p className="text-center font-bold text-base">
                                    Mùa 2 (Teaser 2): Sweet Tooth: Cậu bé gạc nai{' '}
                                </p>
                            </div>
                        </div>
                    </div> */}

                    <div className="flex flex-col pb-[32px] w-full">
                        <div className="text-white mt-12 mb-5 text-2xl flex">
                            <span className="mr-2">Giới thiệu về </span>
                            <h3 className="font-bold">{data?.title} </h3>
                        </div>
                        <div className="text-sm  ">
                            <span className="text-[#777777]">Diễn viên: </span>
                            {data?.casts?.map((item, index) => (
                                <span key={item.id}>{`${item.name}${index < item?.length ? ', ' : ''}`}</span>
                            ))}
                        </div>

                        <div className=" text-sm my-[7px] mr-[7px] w-full ">
                            <span className="text-[#777777]">Thể loại: </span>
                            {data?.genres?.map((item, index) => (
                                <span key={item.id}>{`${item.name}${index < item?.length ? ', ' : ''}`}</span>
                            ))}
                        </div>
                        <div className=" text-sm my-[7px] mr-[7px] ">
                            <span className="text-[#777777]">Chương trình này: </span>
                            {data?.program_type?.map((item, index) => (
                                <span key={item.id}> {`${item.name}${index < item?.length ? ', ' : ''}`}</span>
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
        </div>
    )
}

export default Modalcontainer
