import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Link from '@mui/material/Link'
import Avatar from '@mui/material/Avatar'
import { DataGrid } from '@mui/x-data-grid'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import axios from 'axios'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Modal } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import { FixedSizeList } from 'react-window'
import Typography from '@mui/material/Typography'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    // height: 600,
    boxShadow: 24,
}
const styleModalDelete = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 350,
    boxShadow: 24,
}
const ManageMovie = () => {
    const [detail, setDetail] = React.useState()
    const [movieId, setMovieId] = React.useState()
    React.useEffect(() => {
        onMovieDetail()
    }, [movieId])
    const onMovieDetail = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/movies/${movieId}`)
            console.log('oke' + JSON.stringify(res.data))
            // [{Id: 1, title:"Avenger"}]
            setDetail(res.data[0])
        } catch (error) {
            console.log(error)
        }
    }
    const [open, setOpen] = React.useState()
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        setMovieId(null)
    }
    const handleClick = (value) => {
        handleOpen()

        setMovieId(value.id)

        console.log('ututut' + JSON.stringify(detail))
    }
    const columns = useMemo(
        () => [
            {
                field: 'poster_path',
                headerName: '',
                width: 300,
                renderCell: (params) => {
                    // console.log(params)
                    return (
                        <>
                            <Avatar
                                sx={{ width: 220, height: 120, margin: 2 }}
                                variant="square"
                                src={params?.value[0].path}
                            />
                        </>
                    )
                },
            },
            {
                field: 'title',
                headerName: 'Title',
                width: 140,
                renderCell: (params) => <Link onClick={() => handleClick(params)}>{params.value}</Link>,
            },
            { field: 'duration', headerName: 'Duration', width: 100 },
            { field: 'release_date', headerName: 'Release Date', width: 100 },
            {
                field: 'genres',
                headerName: 'Genres',
                width: 200,
                renderCell: (params) => {
                    const durationArray = params.value
                    // console.log(JSON.stringify(durationArray))
                    return (
                        <span>
                            {durationArray.map((value) => (
                                <div>{value.name},</div>
                            ))}
                        </span>
                    )
                },
            },
            { field: 'overview', headerName: 'Overview', width: 300 },
        ],
        [],
    )
    const { movies } = useSelector((state) => state.app)
    
    const [openDelete, setOpenDelete] = React.useState(false)
    const handleOpenDelete = () => {
        setOpenDelete(true)
    }
    const handleCloseDelete = () => {
        setOpenDelete(false)
    }
    const [movieIds, setMovieIds] = useState([])

    const onSelectHandle = (ids) => {
        const selectRowData = ids.map((id) => movies.find((row) => row.id === id))
        setMovieIds(selectRowData)
        console.log('oke' + JSON.stringify(selectRowData))
    }
    const [openAdd, setOpenAdd] = React.useState()
    const handleOpenAdd = () => {
        setOpenAdd(true)
    }
    const handleCloseAdd = () => {
        setOpenAdd(false)
    }
    return (
        <div className="w-full">
            <h2 className="text-2xl w-full">Manage movie</h2>
            <div className="mb-4 flex justify-between w-full">
                <div>
                    <button
                        className="bg-[#3778DA] h-10 w-[120px] mt-5 mr-5 rounded-md text-white"
                        onClick={handleOpenAdd}
                    >
                        Add movie
                    </button>
                    <button className="bg-[#24AB62] h-10 w-[120px] mt-5 mr-5 rounded-md text-white">
                        Update movie
                    </button>
                    <button
                        className="bg-[#E14444] h-10 w-[120px] mt-5 rounded-md text-white"
                        onClick={handleOpenDelete}
                    >
                        Delete movie
                    </button>
                </div>
                <Modal
                    open={openAdd}
                    onClose={handleCloseAdd}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box sx={style}>
                        <ModalAddMovie onClose={handleCloseAdd} />
                    </Box>
                </Modal>
                <Modal
                    open={openDelete}
                    onClose={handleCloseDelete}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box sx={styleModalDelete}>
                        <ModalDeleteMovie onClose={handleCloseDelete} movieIds={movieIds} />
                    </Box>
                </Modal>
                <div>
                    <InputBase
                        sx={{
                            mt: '20px',
                            height: 40,
                            border: 1,
                            borderColor: '#D9D9D9',
                            borderRadius: '5px',
                            pl: 1,
                            pr: 1,
                        }}
                        placeholder="Search movie ..."
                    />
                    <button className="bg-[#3778DA] h-10 w-[120px] mt-5 ml-5 rounded-md text-white">
                        <SearchIcon />
                        Search
                    </button>
                </div>
            </div>
            <div className="w-full">
                <DataGrid
                    columns={columns}
                    rows={movies}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    slots={{
                        loadingOverlay: LinearProgress,
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    getRowHeight={() => 'auto'}
                    onRowSelectionModelChange={(ids) => onSelectHandle(ids)}
                />
            </div>
            <DialogMovieDetail open={open} handleClose={handleClose} detail={detail} />
        </div>
    )
}

export default ManageMovie

export const ModalDeleteMovie = (props) => {
    const { movieIds, onClose } = props
    const onDeleteMovie = async (movieIds) => {
        try {
            const requests = movieIds.map((movieId) =>
                axios.delete(`http://localhost:5000/api/v1/movies/${movieId.id}`, {
                    withCredentials: true,
                }),
            )

            const responses = await Promise.all(requests)

            const successCount = responses.reduce((count, response) => {
                if (response.status === 200) return count + 1
                return count
            }, 0)

            return {
                successCount: successCount,
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleDeleteClick = async () => {
        try {
            await onDeleteMovie(movieIds)
            toast.success('Deleted user successfully!')
            onClose()
        } catch (error) {
            toast.error('Deleted user failed!')
            onClose()
        }
    }
    return (
        <div className="bg-[#1E1E1E] h-full flex items-center justify-center flex-col text-white">
            <div className="flex flex-col items-center justify-center text-white mt-4">
                <ErrorOutlineIcon style={{ fontSize: 80 }} />
                <label>Bạn có chắc muốn xóa không!</label>
                <div className="flex flex-col justify-center mt-6">
                    <button
                        className="bg-[#037AEB] h-12 w-[374px] mt-5 rounded-md p-3 font-semibold "
                        onClick={handleDeleteClick}
                    >
                        Xác nhận
                    </button>
                    <button className="bg-[grey] h-12 w-[374px] mt-5 rounded-md p-3 font-semibold " onClick={onClose}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    )
}

export const ModalAddMovie = ({ onClose, setIsLoading }) => {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState()
    const [displayName, setDisplayName] = useState()

    const onAddUser = async () => {
        try {
            setIsLoading(true)
            await axios.post('http://localhost:5000/api/v1/user/signup', {
                username,
                password,
                confirmPassword,
                displayName,
            })
            toast.success('Added user successfully!')
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                console.log(error)
            }
        }
        onClose()
    }
    const onChangeUsername = (event) => {
        const value = event.target.value
        setUsername(value)
    }
    const onChangePass = (event) => {
        const value = event.target.value
        setPassword(value)
    }
    const onChangeConfirmPass = (event) => {
        const value = event.target.value
        setConfirmPassword(value)
    }
    const onChangeDisplayName = (event) => {
        const value = event.target.value
        setDisplayName(value)
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onAddUser()
        }
    }
    return (
        <section className="bg-[#1E1E1E] text-white">
            <div className="px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add Movie</h2>
                <form action="#">
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div className="sm:col-span-2">
                            <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Title
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value="Apple iMac 27&ldquo;"
                                placeholder="Type product name"
                                required=""
                            />
                        </div>
                        <div class="sm:col-span-2">
                            <label for="overview" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Overview
                            </label>
                            <textarea
                                id="overview"
                                rows="4"
                                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Write a product description here..."
                            >
                                Standard glass, 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to
                                5.0GHz, 16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD
                                storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US
                            </textarea>
                        </div>

                        <div className="w-full">
                            <label
                                for="duration"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Duration
                            </label>
                            <input
                                type="text"
                                name="duration"
                                id="duration"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value="Apple"
                                placeholder="Enter duration"
                                required=""
                            />
                        </div>
                        <div className="w-full">
                            <label
                                for="release_date"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Release Date
                            </label>
                            <input
                                type="text"
                                name="release_date"
                                id="release_date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value="2999"
                                placeholder="$299"
                                required=""
                            />
                        </div>
                        <div className="w-full">
                            <label
                                for="trailer"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Trailer
                            </label>
                            <input
                                type="text"
                                name="trailer"
                                id="trailer"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value="Apple"
                                placeholder="Enter trailer"
                                required=""
                            />
                        </div>
                        <div className="w-full">
                            <label for="video" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Video
                            </label>
                            <input
                                type="text"
                                name="video"
                                id="video"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value="2999"
                                placeholder="$299"
                                required=""
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Logo
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value="Apple iMac 27&ldquo;"
                                placeholder="Type product name"
                                required=""
                            />
                        </div>
                        <div className="w-full">
                            <label
                                for="age_rating"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Age rating
                            </label>
                            <input
                                type="text"
                                name="age_rating"
                                id="age_rating"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value="Apple"
                                placeholder="Enter age rating"
                                required=""
                            />
                        </div>
                        <div className="w-full">
                            <label for="item_genre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Item genre
                            </label>
                            <input
                                type="text"
                                name="item_genre"
                                id="item_genre"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value="2999"
                                placeholder="$299"
                                required=""
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            className="text-white bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Update product
                        </button>
                        <button
                            type="button"
                            className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                        >
                            <svg
                                className="w-5 h-5 mr-1 -ml-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export const DialogMovieDetail = (props) => {
    const {open, handleClose, detail} = props;
    const renderRow = ({ index, style }) => {
        const episode = detail?.episodes[index]

        return (
            <ListItem style={style} components="div" disablePadding>
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar variant="square" style={{ width: '80px', height: '80px', marginRight: '15px' }}>
                            <img src={episode?.episode_image} alt={episode?.episode_title} />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <>
                                <span>{episode?.episode_title}</span>
                                <span style={{ float: 'right' }}>{episode?.episode_runtime}</span>
                            </>
                        }
                        secondary={episode?.episode_description}
                    />
                </ListItemButton>
            </ListItem>
        )
    }
    return (
        <Dialog fullWidth={true} maxWidth={'lg'} open={open} onClose={handleClose}>
            <DialogTitle>Movie Details</DialogTitle>
            <DialogContent sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="grid">
                    {/* <img
                            src="https://occ-0-325-58.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABRJaoY3PlYTejc06TYiN3vwJ4VZbZSk1wrWevgGRuy7a4fgNPn4HgH4MhEKYeCQjBJafNlOcefIdzX399Vh9hBV1kEJzNMdIsUxx.jpg?r=cbd"
                            alt="image"
                        /> */}
                    <iframe width="580" height="345" src="https://www.youtube.com/embed/lB3SRFPYf98"></iframe>
                    <label className="font-bold">
                        Title: <span className="font-normal">{detail?.title}</span>
                    </label>
                    <label className="font-bold">
                        View: <span className="font-normal">{detail?.views}</span>
                    </label>
                    <label className="font-bold">
                        Age: <span className="font-normal">{detail?.age_rating}</span>
                    </label>
                    <label className="font-bold">
                        Duration: <span className="font-normal">{detail?.duration}</span>
                    </label>
                    <label className="font-bold">
                        Release Date: <span className="font-normal">{detail?.release_date}</span>
                    </label>
                    <label className="font-bold">
                        Overview: <span className="font-normal">{detail?.overview}</span>
                    </label>
                    <div>
                        <span className="font-bold">Genres: </span>
                        {detail?.genres?.length !== 0 &&
                            detail?.genres?.map((item, index) => (
                                <span key={index}>
                                    {`${item.name}${index !== detail.genres.length - 1 ? ', ' : ''}`}
                                </span>
                            ))}
                    </div>
                    <div>
                        <span className="font-bold">Casts: </span>
                        {detail?.casts?.length !== 0 &&
                            detail?.casts?.map((item, index) => (
                                <span key={index}>
                                    {`${item.name}${index !== detail.casts.length - 1 ? ', ' : ''}`}
                                </span>
                            ))}
                    </div>
                </div>
                <div>
                    <label>Episodes:</label>
                    {detail?.episodes.length > 0 ? (
                        <Box sx={{ width: '100%', height: 500, maxWidth: 550, bgcolor: 'background.paper' }}>
                            <FixedSizeList
                                height={500}
                                width={550}
                                itemSize={120}
                                itemCount={detail?.episodes.length}
                                overscanCount={5}
                            >
                                {renderRow}
                            </FixedSizeList>
                        </Box>
                    ) : (
                        <Typography>No Episodes Available</Typography>
                    )}

                    <div>
                        <span className="font-bold">Poster: </span>
                        <div className="grid grid-cols-2 gap-4">
                            {detail?.poster_path?.map((item) => (
                                <img src={item.path} alt="poster" />
                            ))}
                        </div>
                    </div>
                    <div>
                        <span className="font-bold">Program Type: </span>
                        {detail?.program_type?.length !== 0 &&
                            detail?.program_type?.map((item, index) => (
                                <span>{`${item.name}${index < 4 ? ', ' : ''}`}</span>
                            ))}
                    </div>
                    <div>
                        <span className="font-bold">Creators: </span>
                        {detail?.creators?.length !== 0 &&
                            detail?.creators?.map((item, index) => (
                                <span>{`${item.name}${index < 4 ? ', ' : ''}`}</span>
                            ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
