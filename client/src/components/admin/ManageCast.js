import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { InputBase } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Modal } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 600,
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
const ManageCast = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [genres, setGenres] = useState([])
    const [mainusers, setMainUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const getCaster = async () => {
            if (!isLoading) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URI}/casts`, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        },
                    })
                    console.log(response)
                    setGenres(response.data)
                    setMainUsers(response.data)
                } catch (error) {
                    if (error.response.data && error.response.data.statusCode === 401) {
                        navigate('/expired-token')
                    }
                    console.error(error)
                }
            }
        }
        getCaster()
    }, [isLoading])

    const columns = useMemo(
        () => [
            {
                field: '_id',
                renderHeader: () => <p>ID</p>,
                width: 300,
            },
            {
                field: 'name',
                renderHeader: () => <p>{t('Manage_cast_name')}</p>,
                width: 400,
            },
        ],
        [],
    )
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const [openUpdate, setOpenUpdate] = React.useState(false)
    const handleOpenUpdate = () => {
        setOpenUpdate(true)
    }
    const handleCloseUpdate = () => {
        setOpenUpdate(false)
    }
    const [openDelete, setOpenDelete] = React.useState(false)
    const handleOpenDelete = () => {
        setOpenDelete(true)
    }
    const handleCloseDelete = () => {
        setOpenDelete(false)
    }
    const [userIds, setUserIds] = useState([])
    const [disable, setDisable] = useState(true)
    const [disableUpdate, setDisableUpdate] = useState(true)

    const [display, setDisplay] = useState()
    const [role, setRole] = useState()

    const onSelectHandle = (ids) => {
        const selectRowData = ids.map((id) => genres.find((row) => row._id === id))
        setUserIds(selectRowData)
        console.log(JSON.stringify(ids))

        setDisplay(selectRowData.name)
        setRole(selectRowData.roles)

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

    const [name, setName] = useState()
    const onChangeGenres = (event) => {
        const value = event.target.value
        setName(value)
    }
    const onSearchGenres = async () => {
        try {
            const request = await axios.post(
                `${process.env.REACT_APP_API_URI}/casts/find-cast/find`,
                { name: name },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                },
            )
            if (request) {
                setGenres(request.data)
            } else {
                setGenres(mainusers)
            }
        } catch (error) {
            if (error.response.data && error.response.data.statusCode === 401) {
                navigate('/expired-token')
            }
            console.log(error)
            toast.error('Result not found')
            setGenres(mainusers)
        }
    }
    return (
        <div className="w-full">
            <h2 className="text-2xl w-full">Manage Caster</h2>
            <div className="mb-4 flex justify-between w-full">
                <div>
                    <button
                        className="bg-[#3778DA] h-10 w-[170px] mt-5 mr-5 rounded-md text-white"
                        onClick={handleOpen}
                    >
                        {t('Manage_cast_add')}
                    </button>
                    <button
                        className={`bg-[#24AB62] h-10 w-[170px] mt-5 mr-5 rounded-md text-white ${disableUpdate && 'opacity-50'
                            }`}
                        onClick={handleOpenUpdate}
                        disabled={disableUpdate}
                    >
                        {t('Manage_cast_update')}
                    </button>
                    <button
                        className={`bg-[#E14444] h-10 w-[170px] mt-5 rounded-md text-white ${disable && 'opacity-50'}`}
                        onClick={handleOpenDelete}
                        disabled={disable}
                    >
                        {t('Manage_cast_delete')}
                    </button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={style}>
                            <ModalAddGenres setIsLoading={setIsLoading} onClose={handleClose} />
                        </Box>
                    </Modal>
                    <Modal
                        open={openUpdate}
                        onClose={handleCloseUpdate}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={style}>
                            <ModalUpdateGenres
                                setIsLoading={setIsLoading}
                                onClose={handleCloseUpdate}
                                userIds={userIds}
                            />
                        </Box>
                    </Modal>
                    <Modal
                        open={openDelete}
                        onClose={handleCloseDelete}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={styleModalDelete}>
                            <ModalDeleteGenres
                                setIsLoading={setIsLoading}
                                onClose={handleCloseDelete}
                                userIds={userIds}
                            />
                        </Box>
                    </Modal>
                </div>
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
                        placeholder={t('Manage_cast_search')}
                        onChange={onChangeGenres}
                    />
                    <button
                        className="bg-[#3778DA] h-10 w-[120px] mt-5 ml-5 rounded-md text-white"
                        onClick={onSearchGenres}
                    >
                        <SearchIcon />
                        {t('btn_Search')}
                    </button>
                </div>
            </div>
            <div className="w-full">
                <DataGrid
                    columns={columns}
                    editMode="row"
                    rows={genres}
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
                    labelRowsPerPage={'Your text'}
                    getRowId={(row) => row._id}
                    onRowSelectionModelChange={(ids) => onSelectHandle(ids)}
                />
            </div>
        </div>
    )
}

export default ManageCast
export const ModalAddGenres = ({ onClose, setIsLoading }) => {
    const { t } = useTranslation()

    const [name, setName] = useState()

    const onAddGenres = async () => {
        try {
            setIsLoading(true)
            await axios.post(
                `${process.env.REACT_APP_API_URI}/casts`,
                {
                    name,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                },
            )
            toast.success('Added casts successfully!')
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

    const onChangeGenres = (event) => {
        const value = event.target.value
        setName(value)
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onAddGenres()
        }
    }
    return (
        <div className="bg-main-200  dark:bg-main-100 dark:text-main-300 h-full flex items-center justify-center flex-col text-white">
            <div className="flex flex-col text-white mt-8">
                <h3 className="text-xl font-semibold">{t('Manage_cast_add')}</h3>
                <input
                    type="text"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                    placeholder={t('Manage_cast_name')}
                    onChange={onChangeGenres}
                    onKeyPress={handleKeyPress}
                />
                <button
                    className="bg-[#037AEB] h-12 w-[374px] mt-5 rounded-md p-3 font-semibold "
                    onClick={onAddGenres}
                >
                    {t('btn_Submit')}
                </button>
            </div>
        </div>
    )
}
export const ModalUpdateGenres = (props) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { userIds, setIsLoading, onClose } = props

    const [name, setName] = useState(userIds[0]?.name)

    const onUpdateGenres = async () => {
        try {
            setIsLoading(true)
            const data = {
                name: name,
            }
            const requests = userIds.map((userId) =>
                axios.put(`${process.env.REACT_APP_API_URI}/casts/update/${userId._id}`, data, {
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
            setIsLoading(false)
        }
    }
    const handleUpdateClick = async () => {
        try {
            const result = await onUpdateGenres(userIds)
            toast.success(`Successfully edited ${result.successCount} casts!`)
            onClose()
            setIsLoading(false)
        } catch (error) {
            toast.error('Cast edit failed!')
        }
    }

    const onChangeGenresName = (event) => {
        const value = event.target.value
        setName(value)
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleUpdateClick()
        }
    }

    return (
        <div className="bg-main-100 h-full flex items-center justify-center flex-col text-white">
            <div className="flex flex-col text-white mt-8">
                <h3 className="text-xl font-semibold">{t('Manage_cast_update')}</h3>
                <input
                    type="text"
                    className="w-full h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                    value={name}
                    onChange={onChangeGenresName}
                    onKeyPress={handleKeyPress}
                />
                <button
                    className="bg-[#037AEB] h-12 w-[374px] mt-5 rounded-md p-3 font-semibold "
                    onClick={handleUpdateClick}
                >
                    {t('btn_Submit')}
                </button>
            </div>
        </div>
    )
}
export const ModalDeleteGenres = (props) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { userIds, setIsLoading, onClose } = props
    const ModalDeleteGenres = async (userIds) => {
        try {
            setIsLoading(true)

            const requests = userIds.map((userId) =>
                axios.delete(`${process.env.REACT_APP_API_URI}/casts/${userId._id}`, {
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

            setIsLoading(false)
            return {
                successCount: successCount,
            }
        } catch (error) {
            if (error.response.data && error.response.data.statusCode === 401) {
                navigate('/expired-token')
            }
            setIsLoading(false)
        }
    }
    const handleDeleteClick = async () => {
        try {
            await ModalDeleteGenres(userIds)
            toast.success('Deleted cast successfully!')
            onClose()
        } catch (error) {
            toast.error('Deleted cast failed!')
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