import React, { useEffect } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
const ManageComment = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [item, setItem] = React.useState('')
    const [comment, setComment] = React.useState([])
    const handleChange = (event) => {
        setItem(event.target.value)
    }
    const [dataMovie, setDataMovie] = React.useState([])

    useEffect(() => {

        const getMovie = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/movies', { withCredentials: true })
                // console.log('oke ne' + JSON.stringify(res.data))
                setDataMovie(res.data)
            } catch (error) {
                if (error.response.data && error.response.data.statusCode === 401) {
                    navigate('/expired-token')
                }
                console.log(error)
            }
        }
        getMovie()
        if (item) {
            getComments()
        }
    }, [item])
    const getComments = async () => {
        try {
            const movieId = item
            const res = await axios.get(`http://localhost:5000/api/v1/movies/${movieId}/comments`, {
                withCredentials: true,
            })
            setComment(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const [currentPage, setCurrentPage] = React.useState(0)
    const PER_PAGE = 6
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected)
    }

    const offset = currentPage * PER_PAGE
    const currentPageData = comment.slice(offset, offset + PER_PAGE)

    const [userDetails, setUserDetails] = React.useState({})

    const fetchUserDetails = async (userId) => {
        const res = await axios.post(`http://localhost:5000/api/v1/user/info/${userId}`, null, {
            withCredentials: true,
        })
        const user = res.data
        setUserDetails((prev) => ({ ...prev, [userId]: user })) // lưu trữ thông tin người dùng mới với thuộc tính key là userId
    }

    const displayComments = () => {
        return currentPageData.map((x, index) => {
            const user = userDetails[x.userId]
            const displayName = user ? user.displayName : ''
            return (
                <div key={index}>
                    <label htmlFor="">
                        {displayName}:<span> {x.content}</span>
                    </label>
                </div>
            )
        })
    }

    useEffect(() => {
        // lấy thông tin người dùng cho từng `userId` trong `currentPageData`
        currentPageData.forEach((x) => {
            if (!userDetails[x.userId]) {
                fetchUserDetails(x.userId)
            }
        })
    }, [currentPageData, userDetails]) // lưu ý sử dụng `useEffect` để gọi `fetchUserDetails` chỉ khi có `currentPageData` hoặc `userDetails` thay đổi

    return (
        <div className="w-full">
            <h2 className="mb-5 text-2xl w-full">{t('ManageComment')}</h2>
            <div className="grid justify-center gap-6">
                <div className="w-full">
                    <FormControl variant="filled" sx={{ minWidth: 500 }}>
                        <InputLabel id="demo-simple-select-filled-label">{t('ManageComment_selectMovie')}</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={item ? item : ''}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>{t('Movie_none')}</em>
                            </MenuItem>
                            {dataMovie?.map((movie) => (
                                <MenuItem key={movie._id} value={movie._id}>
                                    {movie.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <label htmlFor="">{t('ManageComment_listMovie')}:</label>
                {item && comment?.length > 0 ? (
                    <>
                        <div className="w-full grid grid-cols-2 gap-2">{displayComments()}</div>
                        <ReactPaginate
                            pageCount={Math.ceil(comment.length / PER_PAGE)}
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
                    <h2>{t('Movie_notfound')}</h2>
                )}
            </div>
        </div>
    )
}

export default ManageComment
