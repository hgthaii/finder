/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Link from '@mui/material/Link'
import Avatar from '@mui/material/Avatar'
import { DataGrid } from '@mui/x-data-grid'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
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

import { useTheme } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import { useNavigate } from 'react-router-dom'

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
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [detail, setDetail] = React.useState()
    const [movieId, setMovieId] = React.useState()
    React.useEffect(() => {
        onMovieDetail()
    }, [movieId])
    const onMovieDetail = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URI}/movies/${movieId}`)
            // console.log('oke' + JSON.stringify(res.data))
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
                renderHeader: () => <p>{t('Movie_title')}</p>,
                width: 140,
                renderCell: (params) => <Link onClick={() => handleClick(params)}>{params.value}</Link>,
            },
            { field: 'duration', renderHeader: () => <p>{t('Movie_duration')}</p>, width: 100 },
            { field: 'release_date', renderHeader: () => <p>{t('Movie_release_date')}</p>, width: 100 },
            {
                field: 'genres',
                renderHeader: () => <p>{t('Movie_genres')}</p>,
                width: 200,
                renderCell: (params) => {
                    const durationArray = params.value
                    // console.log(JSON.stringify(durationArray))
                    return (
                        <span>
                            {durationArray.map((value, index) => (
                                <div key={index}>{value.name},</div>
                            ))}
                        </span>
                    )
                },
            },
            { field: 'overview', renderHeader: () => <p>{t('Movie_overview')}</p>, width: 300 },
        ],
        [],
    )

    const [openDelete, setOpenDelete] = React.useState(false)
    const handleOpenDelete = () => {
        setOpenDelete(true)
    }
    const handleCloseDelete = () => {
        setOpenDelete(false)
    }
    const [movieIds, setMovieIds] = useState([])

    const [disable, setDisable] = useState(true)
    const [disableUpdate, setDisableUpdate] = useState(true)
    const onSelectHandle = (ids) => {
        const selectRowData = ids.map((id) => movies.find((row) => row._id === id))
        setMovieIds(selectRowData)

        if (selectRowData.length === 1) {
            setDisable(false)
            setDisableUpdate(false)
        } else if (selectRowData.length > 1) {
            setDisableUpdate(true)
        } else {
            setDisable(selectRowData.length === 0)
            setDisableUpdate(selectRowData.length === 0)
        }
    }
    const [openAdd, setOpenAdd] = React.useState(false)
    const handleOpenAdd = () => {
        setOpenAdd(true)
        listGenres()
    }
    const handleCloseAdd = () => {
        setOpenAdd(false)
        setGenres([])
    }
    const [openUpdate, setOpenUpdate] = React.useState(false)
    const handleOpenUpdate = () => {
        setOpenUpdate(true)
        listGenres()
    }
    const handleCloseUpdate = () => {
        setOpenUpdate(false)
        setGenres([])
    }

    const [genres, setGenres] = React.useState([])

    const listGenres = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URI}/genres`)
            setGenres(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const [searchItem, setSearchItem] = useState()
    // const { movies } = useSelector((state) => state.app)

    const onChangeMovie = (event) => {
        const value = event.target.value
        setSearchItem(value)
    }
    const [movies, setMovies] = useState([])
    const [mainmovies, setMainMovies] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const timeLoading = () => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }
    useEffect(() => {
        timeLoading()
    }, [])
    useEffect(() => {
        const getMovies = async () => {
            if (!isLoading) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URI}/movies`, {
                        withCredentials: true,
                    })

                    setMovies(response.data)
                    setMainMovies(response.data)
                } catch (error) {
                    if (error.response.data && error.response.data.statusCode === 401) {
                        navigate('/expired-token')
                    }
                    console.error(error)
                }
            }
        }
        getMovies()
    }, [isLoading])
    const onSearchMovie = async () => {
        try {
            const request = await axios.get(`${process.env.REACT_APP_API_URI}/genres/media/search?search=${searchItem}`)
            if (request) {
                setMovies(request.data)
            } else {
                setMovies(mainmovies)
            }
        } catch (error) {
            console.log(error)
            // toast.error('Result not found')
            setMovies(mainmovies)
        }
    }
    return (
        <div className="w-full">
            <h2 className="text-2xl w-full">{t('ManageMovie')}</h2>
            <div className="mb-4 flex justify-between w-full">
                <div>
                    <button
                        className="bg-[#3778DA] h-10 w-[170px] mt-5 mr-5 rounded-md text-white"
                        onClick={handleOpenAdd}
                    >
                        {t('Add_movie')}
                    </button>
                    <button
                        className={`bg-[#24AB62] h-10 w-[170px] mt-5 mr-5 rounded-md text-white ${
                            disableUpdate && 'opacity-50'
                        }`}
                        onClick={handleOpenUpdate}
                        disabled={disableUpdate}
                    >
                        {t('Update_movie')}
                    </button>
                    <button
                        className={`bg-[#E14444] h-10 w-[170px] mt-5 rounded-md text-white ${disable && 'opacity-50'}`}
                        onClick={handleOpenDelete}
                        disabled={disable}
                    >
                        {t('Delete_movie')}
                    </button>
                </div>
                <ModalAddMovie
                    handleCloseAdd={handleCloseAdd}
                    open={openAdd || false}
                    genres={genres}
                    setIsLoading={setIsLoading}
                />
                <ModalUpdateMovie
                    handleCloseUpdate={handleCloseUpdate}
                    open={openUpdate || false}
                    movieIds={movieIds}
                    genres={genres}
                    setIsLoading={setIsLoading}
                />
                <Modal
                    open={openDelete || false}
                    onClose={handleCloseDelete}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box sx={styleModalDelete}>
                        <ModalDeleteMovie onClose={handleCloseDelete} movieIds={movieIds} setIsLoading={setIsLoading} />
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
                        placeholder={t('Search_movie')}
                        onChange={onChangeMovie}
                    />
                    <button
                        className="bg-[#3778DA] h-10 w-[120px] mt-5 ml-5 rounded-md text-white"
                        onClick={onSearchMovie}
                    >
                        <SearchIcon />
                        {t('btn_Search')}
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
                    loading={isLoading}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    getRowHeight={() => 'auto'}
                    getRowId={(row) => row._id}
                    onRowSelectionModelChange={(ids) => onSelectHandle(ids)}
                />
            </div>
            <DialogMovieDetail open={open || false} handleClose={handleClose} detail={detail} />
        </div>
    )
}

export default ManageMovie

export const ModalDeleteMovie = (props) => {
    const { t } = useTranslation()

    const { movieIds, setIsLoading, onClose } = props
    console.log('oke' + JSON.stringify(movieIds))
    const onDeleteMovie = async () => {
        try {
            setIsLoading(true)
            const requests = movieIds.map((movieId) =>
                axios.delete(`${process.env.REACT_APP_API_URI}/movies/${movieId._id}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
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
            if (error.response.data && error.response.data.statusCode === 401) {
                navigate('/expired-token')
            }
            console.log(error)
            setIsLoading(false)
        }
    }
    const handleDeleteClick = async () => {
        try {
            await onDeleteMovie(movieIds)
            toast.success('Deleted user successfully!')
            onClose()
            setIsLoading(false)
        } catch (error) {
            toast.error('Deleted user failed!')
            onClose()
        }
    }
    return (
        <div className="bg-main-100 h-full flex items-center justify-center flex-col text-white">
            <div className="flex flex-col items-center justify-center text-white mt-4">
                <ErrorOutlineIcon style={{ fontSize: 80 }} />
                <label>{t('Ask_Delete')}</label>
                <div className="flex flex-col justify-center mt-6">
                    <button
                        className="bg-[#037AEB] h-12 w-[374px] mt-5 rounded-md p-3 font-semibold "
                        onClick={handleDeleteClick}
                    >
                        {t('btn_Confirm')}
                    </button>
                    <button className="bg-[grey] h-12 w-[374px] mt-5 rounded-md p-3 font-semibold " onClick={onClose}>
                        {t('btn_Cancel')}
                    </button>
                </div>
            </div>
        </div>
    )
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    }
}
export const ModalAddMovie = (props) => {
    const { t } = useTranslation()

    const { open, handleCloseAdd, genres, setIsLoading } = props
    const [poster_pathInput, setPoster_pathInput] = useState('')
    const [castsInput, setCastsInput] = useState('')
    const [creatorsInput, setCreatorsInput] = useState('')
    const [program_typeInput, setProgram_typeInput] = useState('')

    const episodesData = [
        {
            episodes_title: '',
            episodes_runtime: '',
            episodes_image: '',
            episodes_description: '',
        },
    ]

    const [movieData, setMovieData] = useState({
        title: '',
        logo: '',
        duration: '',
        release_date: '',
        overview: '',
        trailer: '',
        video: '',
        poster_path: [],
        genres: [],
        episodes: [episodesData],
        casts: [],
        program_type: [],
        creators: [],
        age_rating: '',
        item_genre: '',
    })
    const onAddMovie = async () => {
        try {
            setIsLoading(true)
            const parsedData = {
                ...movieData,
                poster_path: poster_pathInput.split(',').map((path) => ({ path })),
                genres: personName.map((name) => ({ name })),
                casts: castsInput.split(',').map((name) => ({ name })),
                program_type: program_typeInput.split(',').map((name) => ({ name })),
                episodes: movieData.episodes.map((episode) => ({
                    episode_title: episode.episode_title,
                    episode_runtime: episode.episode_runtime,
                    episode_image: episode.episode_image,
                    episode_description: episode.episode_description,
                })),
                creators: creatorsInput.split(',').map((name) => ({ name })),
            }
            await axios.post(`${process.env.REACT_APP_API_URI}/movies`, parsedData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            toast.success('Added movie successfully!')
            setIsLoading(false)
        } catch (error) {
            if (error.response.data && error.response.data.statusCode === 401) {
                navigate('/expired-token')
            }
            console.log(error)
            toast.error('Added movie failed!')
            setIsLoading(false)
        }
        // handleCloseAdd()
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onAddMovie()
        }
    }
    const theme = useTheme()
    const [personName, setPersonName] = React.useState([])

    const handleChange = (event) => {
        const {
            target: { value },
        } = event
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        )
    }

    return (
        <Dialog fullWidth={true} maxWidth={'lg'} open={open || false} onClose={handleCloseAdd}>
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <DialogTitle>{t('Add_movie')}</DialogTitle>
            <section>
                <div className="px-6 mx-auto">
                    <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_title')}
                                    <strong className="text-red-500">*</strong>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
                                    placeholder={t('Movie_placeholder_title')}
                                    required=""
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="overview" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_overview')}
                                </label>
                                <textarea
                                    id="overview"
                                    rows="4"
                                    onChange={(e) => setMovieData({ ...movieData, overview: e.target.value })}
                                    value={movieData.overview}
                                    className="text-black bg-gray-300 block p-2.5 w-full text-sm  rounded-lg border border-gray-300 focus:ring-primary-500 "
                                    placeholder={t('Movie_placeholder_overview')}
                                ></textarea>
                            </div>
                            <div className="w-full">
                                <label htmlFor="duration" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_duration')}
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    id="duration"
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setMovieData({ ...movieData, duration: e.target.value })}
                                    placeholder={t('Movie_placeholder_duration')}
                                    required=""
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="release_date" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_release_date')}
                                </label>
                                <input
                                    type="text"
                                    name="release_date"
                                    id="release_date"
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setMovieData({ ...movieData, release_date: e.target.value })}
                                    placeholder={t('Movie_placeholder_release_date')}
                                    required=""
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="trailer" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_trailer')}
                                </label>
                                <input
                                    type="text"
                                    name="trailer"
                                    id="trailer"
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setMovieData({ ...movieData, trailer: e.target.value })}
                                    placeholder={t('Movie_placeholder_trailer')}
                                    required=""
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="video" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_video')}
                                </label>
                                <input
                                    type="text"
                                    name="video"
                                    id="video"
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setMovieData({ ...movieData, video: e.target.value })}
                                    placeholder={t('Movie_placeholder_video')}
                                    required=""
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_logo')}
                                </label>
                                <input
                                    type="text"
                                    name="logo"
                                    id="logo"
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setMovieData({ ...movieData, logo: e.target.value })}
                                    placeholder={t('Movie_placeholder_logo')}
                                    required=""
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_poster_path')}
                                </label>
                                <input
                                    type="text"
                                    name="logo"
                                    id="logo"
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setPoster_pathInput(e.target.value)}
                                    placeholder={t('Movie_placeholder_poster_path')}
                                    required=""
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_genres')}
                                </label>
                                <FormControl sx={{ width: '100%' }}>
                                    <InputLabel id="demo-multiple-chip-label">{t('Movie_select')}</InputLabel>
                                    <Select
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        multiple
                                        value={personName}
                                        onChange={handleChange}
                                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {genres.map((x) => (
                                            <MenuItem
                                                key={x.name}
                                                value={x.name}
                                                style={getStyles(x.name, personName, theme)}
                                            >
                                                {x.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_episodes')}
                                </label>
                                <div className="grid grid-cols-2 gap-6 mx-4">
                                    <div>
                                        <label htmlFor="" className="text-sm font-medium">
                                            {t('Movie_episodes_title')}
                                        </label>
                                        <input
                                            type="text"
                                            name="episode_title"
                                            id="episode_title"
                                            className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            onChange={(e) =>
                                                setMovieData((prevData) => ({
                                                    ...prevData,
                                                    episodes: prevData.episodes.map((episode, index) =>
                                                        index === 0
                                                            ? { ...episode, episode_title: e.target.value }
                                                            : episode,
                                                    ),
                                                }))
                                            }
                                            placeholder={t('Movie_placeholder_eps_title')}
                                            required=""
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="" className="text-sm font-medium">
                                            {t('Movie_episodes_runtime')}
                                        </label>
                                        <input
                                            type="text"
                                            name="episodes"
                                            id="episodes"
                                            className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            onChange={(e) =>
                                                setMovieData((prevData) => ({
                                                    ...prevData,
                                                    episodes: prevData.episodes.map((episode, index) =>
                                                        index === 0
                                                            ? { ...episode, episode_runtime: e.target.value }
                                                            : episode,
                                                    ),
                                                }))
                                            }
                                            placeholder={t('Movie_placeholder_eps_runtime')}
                                            required=""
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6 mt-3 mx-4">
                                    <div>
                                        <label htmlFor="" className="text-sm font-medium">
                                            {t('Movie_episodes_image')}
                                        </label>
                                        <input
                                            type="text"
                                            name="episodes"
                                            id="episodes"
                                            className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            onChange={(e) =>
                                                setMovieData((prevData) => ({
                                                    ...prevData,
                                                    episodes: prevData.episodes.map((episode, index) =>
                                                        index === 0
                                                            ? { ...episode, episode_image: e.target.value }
                                                            : episode,
                                                    ),
                                                }))
                                            }
                                            placeholder={t('Movie_placeholder_eps_image')}
                                            required=""
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="" className="text-sm font-medium">
                                            {t('Movie_episodes_description')}
                                        </label>
                                        <input
                                            type="text"
                                            name="episodes"
                                            id="episodes"
                                            className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            onChange={(e) =>
                                                setMovieData((prevData) => ({
                                                    ...prevData,
                                                    episodes: prevData.episodes.map((episode, index) =>
                                                        index === 0
                                                            ? { ...episode, episode_description: e.target.value }
                                                            : episode,
                                                    ),
                                                }))
                                            }
                                            placeholder={t('Movie_placeholder_description')}
                                            required=""
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_cast')}
                                </label>
                                <input
                                    type="text"
                                    name="logo"
                                    id="logo"
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setCastsInput(e.target.value)}
                                    placeholder={t('Movie_placeholder_cast')}
                                    required=""
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_program_type')}
                                </label>
                                <input
                                    type="text"
                                    name="logo"
                                    id="logo"
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setProgram_typeInput(e.target.value)}
                                    placeholder={t('Movie_placeholder_program_type')}
                                    required=""
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_creator')}
                                </label>
                                <input
                                    type="text"
                                    name="logo"
                                    id="logo"
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setCreatorsInput(e.target.value)}
                                    placeholder={t('Movie_placeholder_creator')}
                                    required=""
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="age_rating" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_age_rating')}
                                </label>
                                <input
                                    type="text"
                                    name="age_rating"
                                    id="age_rating"
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setMovieData({ ...movieData, age_rating: e.target.value })}
                                    placeholder={t('Movie_placeholder_age_rating')}
                                    required=""
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="item_genre" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_item_genre')}
                                </label>
                                <input
                                    type="text"
                                    name="item_genre"
                                    id="item_genre"
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setMovieData({ ...movieData, item_genre: e.target.value })}
                                    placeholder={t('Movie_placeholder_item_genre')}
                                    required=""
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onAddMovie}
                                type="button"
                                className="bg-[#3778DA] text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4"
                            >
                                {t('btn_Submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </Dialog>
    )
}

export const DialogMovieDetail = (props) => {
    const { t } = useTranslation()

    const { open, handleClose, detail } = props
    const renderRow = ({ index, style }) => {
        const episode = detail?.episodes[index]

        return (
            <ListItem style={style} component={'div'} disablePadding>
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
        <Dialog fullWidth={true} maxWidth={'lg'} open={open || false} onClose={handleClose}>
            <DialogTitle>{t('ManageMovie_details')}</DialogTitle>
            <DialogContent sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="grid">
                    {/* <img
                            src="https://occ-0-325-58.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABRJaoY3PlYTejc06TYiN3vwJ4VZbZSk1wrWevgGRuy7a4fgNPn4HgH4MhEKYeCQjBJafNlOcefIdzX399Vh9hBV1kEJzNMdIsUxx.jpg?r=cbd"
                            alt="image"
                        /> */}
                    <iframe width="580" height="345" src={detail?.trailer} title="trailer"></iframe>
                    <label className="font-bold">
                        {t('Movie_title')}: <span className="font-normal">{detail?.title}</span>
                    </label>
                    <label className="font-bold">
                        {t('Movie_view')}: <span className="font-normal">{detail?.views}</span>
                    </label>
                    <label className="font-bold">
                        {t('Movie_age_rating')}: <span className="font-normal">{detail?.age_rating}</span>
                    </label>
                    <label className="font-bold">
                        {t('Movie_duration')}: <span className="font-normal">{detail?.duration}</span>
                    </label>
                    <label className="font-bold">
                        {t('Movie_release_date')}: <span className="font-normal">{detail?.release_date}</span>
                    </label>
                    <label className="font-bold">
                        {t('Movie_overview')}: <span className="font-normal">{detail?.overview}</span>
                    </label>
                    <div>
                        <span className="font-bold">{t('Movie_genres')}: </span>
                        {detail?.genres?.length !== 0 &&
                            detail?.genres?.map((item, index) => (
                                <span key={index}>
                                    {`${item.name}${index !== detail.genres.length - 1 ? ', ' : ''}`}
                                </span>
                            ))}
                    </div>
                    <div>
                        <span className="font-bold">{t('Movie_cast')}: </span>
                        {detail?.casts?.length !== 0 &&
                            detail?.casts?.map((item, index) => (
                                <span key={index}>
                                    {`${item.name}${index !== detail.casts.length - 1 ? ', ' : ''}`}
                                </span>
                            ))}
                    </div>
                </div>
                <div>
                    <label className="font-bold">{t('Movie_episodes')}:</label>
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
                        <Typography>{t('Movie_notfound')}</Typography>
                    )}

                    <div>
                        <span className="font-bold">{t('Movie_poster_path')}: </span>
                        <div className="grid grid-cols-2 gap-4">
                            {detail?.poster_path?.map((item, index) => (
                                <img key={index} src={item.path} alt="poster" />
                            ))}
                        </div>
                    </div>
                    <div>
                        <span className="font-bold">{t('Movie_program_type')}: </span>
                        {/* {detail?.program_type?.length !== 0 &&
                            detail?.program_type?.map((item, index) => (
                                <span key={index}>{`${item.name}${
                                    index !== detail.program_type.length - 1 ? ', ' : ''
                                }`}</span>
                            ))} */}
                        {detail?.program_type?.length ? (
                            detail?.program_type?.map((item, index) => (
                                <span key={index}>{`${item.name}${
                                    index !== detail.program_type.length - 1 ? ', ' : ''
                                }`}</span>
                            ))
                        ) : (
                            <span>{t('Movie_notfound')}</span>
                        )}
                    </div>
                    <div>
                        <span className="font-bold">{t('Movie_creator')}: </span>
                        {detail?.creators?.length ? (
                            detail?.creators?.map((item, index) => (
                                <span key={index}>{`${item.name}${
                                    index !== detail.creators.length - 1 ? ', ' : ''
                                }`}</span>
                            ))
                        ) : (
                            <span>{t('Movie_notfound')}</span>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const ModalUpdateMovie = (props) => {
    const { t } = useTranslation()

    const { open, handleCloseUpdate, movieIds, genres, setIsLoading } = props

    const [movieDataUpdate, setMovieDataUpdate] = useState({
        title: '',
        logo: '',
        duration: '',
        release_date: '',
        overview: '',
        trailer: '',
        video: '',
        poster_path: [],
        genres: [],
        episodes: [],
        casts: [],
        program_type: [],
        creators: [],
        age_rating: '',
        item_genre: '',
    })
    // console.log(JSON.stringify(movieIds))
    const onUpdateMovie = async () => {
        try {
            setIsLoading(true)

            const movieId = movieIds[0]?._id
            await axios.put(`${process.env.REACT_APP_API_URI}/movies/${movieId}`, movieDataUpdate, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            setIsLoading(false)
        } catch (error) {
            if (error.response.data && error.response.data.statusCode === 401) {
                navigate('/expired-token')
            }
            console.log(error)
            setIsLoading(false)
            // throw new Error(error)
        }
        handleCloseUpdate()
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onUpdateMovie()
        }
    }
    const theme = useTheme()
    const [personName, setPersonName] = React.useState([])
    const handleChange = (event) => {
        const {
            target: { value },
        } = event
        setPersonName(value)
    }

    // Biến đổi mảng genres thành một mảng các tên thể loại duy nhất
    // const genreNames = Array.from(new Set(movieIds[0]?.genres.map((genre) => genre.name)))

    React.useEffect(() => {
        // Nếu đã chọn các thể loại trước đó, sẽ đặt thể loại đã chọn này làm giá trị mặc định cho Select
        const selectedGenres = movieIds[0]?.genres
        if (selectedGenres && selectedGenres.length > 0) {
            const selectedGenreNames = selectedGenres.map((genre) => genre.name)
            setPersonName(selectedGenreNames)
        }
        if (movieIds && movieIds[0]) {
            const firstMovie = movieIds[0]
            const episodesData = firstMovie.episodes.map((episode) => ({
                episode_title: episode.episode_title,
                episode_runtime: episode.episode_runtime,
                episode_image: episode.episode_image,
                episode_description: episode.episode_description,
            }))
            setMovieDataUpdate((prevData) => ({
                ...prevData,
                title: movieIds[0].title,
                logo: movieIds[0].logo,
                duration: movieIds[0].duration,
                release_date: movieIds[0].release_date,
                overview: movieIds[0].overview,
                trailer: movieIds[0].trailer,
                video: movieIds[0].video,
                age_rating: movieIds[0].age_rating,
                item_genre: movieIds[0].item_genre,
                poster_path: firstMovie.poster_path.map((x) => ({ path: x.path })),
                genres: firstMovie.genres.map((x) => ({ name: x.name })),
                casts: firstMovie.casts.map((x) => ({ name: x.name })),
                program_type: firstMovie.program_type.map((x) => ({ name: x.name })),
                creators: firstMovie.creators.map((x) => ({ name: x.name })),
                episodes: episodesData,
            }))
        }
    }, [movieIds])
    return (
        <Dialog fullWidth={true} maxWidth={'lg'} open={open || false} onClose={handleCloseUpdate}>
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <DialogTitle>{t('Update_movie')}</DialogTitle>
            <section>
                <div className="px-6 mx-auto">
                    <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_title')}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={movieDataUpdate.title}
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setMovieDataUpdate({ ...movieDataUpdate, title: e.target.value })}
                                    placeholder={t('Movie_placeholder_title')}
                                    required=""
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="overview" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_overview')}
                                </label>
                                <textarea
                                    id="overview"
                                    rows="4"
                                    value={movieDataUpdate.overview}
                                    onChange={(e) =>
                                        setMovieDataUpdate({ ...movieDataUpdate, overview: e.target.value })
                                    }
                                    className="text-black bg-gray-300 block p-2.5 w-full text-sm  rounded-lg border border-gray-300 focus:ring-primary-500 "
                                    placeholder={t('Movie_placeholder_overview')}
                                ></textarea>
                            </div>
                            <div className="w-full">
                                <label htmlFor="duration" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_duration')}
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    id="duration"
                                    value={movieDataUpdate.duration}
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) =>
                                        setMovieDataUpdate({ ...movieDataUpdate, duration: e.target.value })
                                    }
                                    placeholder={t('Movie_placeholder_duration')}
                                    required=""
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="release_date" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_release_date')}
                                </label>
                                <input
                                    type="text"
                                    name="release_date"
                                    id="release_date"
                                    value={movieDataUpdate.release_date}
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) =>
                                        setMovieDataUpdate({ ...movieDataUpdate, release_date: e.target.value })
                                    }
                                    placeholder={t('Movie_placeholder_release_date')}
                                    required=""
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="trailer" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_trailer')}
                                </label>
                                <input
                                    type="text"
                                    name="trailer"
                                    id="trailer"
                                    value={movieDataUpdate.trailer}
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) =>
                                        setMovieDataUpdate({ ...movieDataUpdate, trailer: e.target.value })
                                    }
                                    placeholder={t('Movie_placeholder_trailer')}
                                    required=""
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="video" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_video')}
                                </label>
                                <input
                                    type="text"
                                    name="video"
                                    id="video"
                                    value={movieDataUpdate.video}
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setMovieDataUpdate({ ...movieDataUpdate, video: e.target.value })}
                                    placeholder={t('Movie_placeholder_video')}
                                    required=""
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_logo')}
                                </label>
                                <input
                                    type="text"
                                    name="logo"
                                    id="logo"
                                    value={movieDataUpdate.logo}
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) => setMovieDataUpdate({ ...movieDataUpdate, logo: e.target.value })}
                                    placeholder={t('Movie_placeholder_logo')}
                                    required=""
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_poster_path')}
                                </label>
                                <input
                                    type="text"
                                    name="poster_path"
                                    id="poster_path"
                                    // value={movieDataUpdate.poster_path.join(', ')}
                                    value={movieDataUpdate.poster_path.map((item) => item.path).join(', ')}
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) =>
                                        setMovieDataUpdate((prevData) => ({
                                            ...prevData,
                                            poster_path: e.target.value.split(', ').map((path) => ({ path })),
                                        }))
                                    }
                                    placeholder={t('Movie_placeholder_poster_path')}
                                    required=""
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_genres')}
                                </label>
                                <FormControl sx={{ width: '100%' }}>
                                    <InputLabel id="demo-multiple-chip-label">{t('Movie_select')}</InputLabel>
                                    <Select
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        multiple
                                        value={personName}
                                        onChange={handleChange}
                                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {genres.map((x) => (
                                            <MenuItem
                                                key={x.name}
                                                value={x.name}
                                                style={getStyles(x.name, personName, theme)}
                                            >
                                                {x.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_episodes')}
                                </label>
                                <div className="grid grid-cols-2 gap-6 mx-4">
                                    <div>
                                        <label htmlFor="" className="text-sm font-medium">
                                            {t('Movie_episodes_title')}
                                        </label>
                                        <input
                                            type="text"
                                            name="episodes"
                                            id="episodes"
                                            value={movieDataUpdate.episodes[0]?.episode_title}
                                            className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            onChange={(e) =>
                                                setMovieDataUpdate((prevData) => ({
                                                    ...prevData,
                                                    episodes: [
                                                        {
                                                            episode_title: e.target.value,
                                                            // episode_runtime: '',
                                                            // episode_image: '',
                                                            // episode_description: '',
                                                        },
                                                    ],
                                                }))
                                            }
                                            placeholder={t('Movie_placeholder_eps_title')}
                                            required=""
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="" className="text-sm font-medium">
                                            {t('Movie_episodes_runtime')}
                                        </label>
                                        <input
                                            type="text"
                                            name="episodes"
                                            id="episodes"
                                            value={movieDataUpdate.episodes[0]?.episode_runtime}
                                            className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            onChange={(e) =>
                                                setMovieDataUpdate((prevData) => ({
                                                    ...prevData,
                                                    episodes: [
                                                        {
                                                            // episode_title: e.target.value,
                                                            episode_runtime: e.target.value,
                                                            // episode_image: '',
                                                            // episode_description: '',
                                                        },
                                                    ],
                                                }))
                                            }
                                            placeholder={t('Movie_placeholder_eps_runtime')}
                                            required=""
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6 mt-3 mx-4">
                                    <div>
                                        <label htmlFor="" className="text-sm font-medium">
                                            {t('Movie_episodes_image')}
                                        </label>
                                        <input
                                            type="text"
                                            name="episodes"
                                            id="episodes"
                                            value={movieDataUpdate.episodes[0]?.episode_image}
                                            className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            onChange={(e) =>
                                                setMovieDataUpdate((prevData) => ({
                                                    ...prevData,
                                                    episodes: [
                                                        {
                                                            // episode_title: e.target.value,
                                                            // episode_runtime: '',
                                                            episode_image: e.target.value,
                                                            // episode_description: '',
                                                        },
                                                    ],
                                                }))
                                            }
                                            placeholder={t('Movie_placeholder_eps_image')}
                                            required=""
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="" className="text-sm font-medium">
                                            {t('Movie_episodes_description')}
                                        </label>
                                        <input
                                            type="text"
                                            name="episodes"
                                            id="episodes"
                                            value={movieDataUpdate.episodes[0]?.episode_description}
                                            className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            onChange={(e) =>
                                                setMovieDataUpdate((prevData) => ({
                                                    ...prevData,
                                                    episodes: [
                                                        {
                                                            // episode_title: e.target.value,
                                                            // episode_runtime: '',
                                                            // episode_image: '',
                                                            episode_description: e.target.value,
                                                        },
                                                    ],
                                                }))
                                            }
                                            placeholder={t('Movie_placeholder_description')}
                                            required=""
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_cast')}
                                </label>
                                <input
                                    type="text"
                                    name="casts"
                                    id="casts"
                                    value={movieDataUpdate.casts.map((item) => item.name).join(', ')}
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) =>
                                        setMovieDataUpdate((prevData) => ({
                                            ...prevData,
                                            casts: e.target.value.split(', ').map((name) => ({ name })),
                                        }))
                                    }
                                    placeholder={t('Movie_placeholder_cast')}
                                    required=""
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_program_type')}
                                </label>
                                <input
                                    type="text"
                                    name="program_type"
                                    id="program_type"
                                    value={movieDataUpdate.program_type.map((item) => item.name).join(', ')}
                                    className="text-black bg-gray-300 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) =>
                                        setMovieDataUpdate((prevData) => ({
                                            ...prevData,
                                            program_type: e.target.value.split(', ').map((name) => ({ name })),
                                        }))
                                    }
                                    placeholder={t('Movie_placeholder_program_type')}
                                    required=""
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_creator')}
                                </label>
                                <input
                                    type="text"
                                    name="creators"
                                    id="creators"
                                    value={movieDataUpdate.creators.map((item) => item.name).join(', ')}
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) =>
                                        setMovieDataUpdate((prevData) => ({
                                            ...prevData,
                                            creators: e.target.value.split(', ').map((name) => ({ name })),
                                        }))
                                    }
                                    placeholder={t('Movie_placeholder_creator')}
                                    required=""
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="age_rating" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_age_rating')}
                                </label>
                                <input
                                    type="text"
                                    name="age_rating"
                                    id="age_rating"
                                    value={movieDataUpdate.age_rating}
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) =>
                                        setMovieDataUpdate({ ...movieDataUpdate, age_rating: e.target.value })
                                    }
                                    placeholder={t('Movie_placeholder_age_rating')}
                                    required=""
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="item_genre" className="block mb-2 text-sm font-medium ">
                                    {t('Movie_item_genre')}
                                </label>
                                <input
                                    type="text"
                                    name="item_genre"
                                    id="item_genre"
                                    value={movieDataUpdate.item_genre}
                                    className="text-black bg-gray-300 border border-gray-300  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={(e) =>
                                        setMovieDataUpdate({ ...movieDataUpdate, item_genre: e.target.value })
                                    }
                                    placeholder={t('Movie_placeholder_item_genre')}
                                    required=""
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onUpdateMovie}
                                type="button"
                                className="bg-[#24AB62] text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4"
                            >
                                {t('btn_Submit')}
                            </button>
                            {/* <button
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
                            </button> */}
                        </div>
                    </form>
                </div>
            </section>
        </Dialog>
    )
}
