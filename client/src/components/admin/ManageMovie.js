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

const ManageMovie = () => {
    const [detail, setDetail] = React.useState()
    const [movieId, setMovieId] = React.useState([])
    const onMovieDetail = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/movies/${movieId}`)
            console.log('oke' + JSON.stringify(res.data))
            setDetail(res.data)
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
        setMovieId([])
        handleOpen()
        const movieid = value.id
        console.log('thone' + movieid)
        setMovieId(movieid)

        onMovieDetail()
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
                                src={params.value[1].path}
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
    // console.log(movies)

    return (
        <div className="w-full">
            <h2 className="text-2xl w-full">Manage movie</h2>
            <div className="mb-4 flex justify-between w-full">
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
                <div>
                    <button className="bg-[#3778DA] h-10 w-[120px] mt-5 mr-5 rounded-md text-white">Add movie</button>
                    <button className="bg-[#24AB62] h-10 w-[120px] mt-5 mr-5 rounded-md text-white">
                        Update movie
                    </button>
                    <button className="bg-[#E14444] h-10 w-[120px] mt-5 rounded-md text-white">Delete movie</button>
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
                    // sx={{marginRight:100}}
                />
            </div>
            <Dialog fullWidth={true} maxWidth={'lg'} open={open} onClose={handleClose}>
                <DialogTitle>Movie Details</DialogTitle>
                <DialogContent>
                    <DialogContentText></DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ManageMovie
