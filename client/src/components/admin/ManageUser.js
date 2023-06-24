/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { DataGrid } from '@mui/x-data-grid'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Modal } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

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

const ManageUser = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const [mainusers, setMainUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const getUser = async () => {
            if (!isLoading) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URI}/user/info`, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        },
                    })
                    console.log(response)
                    setUsers(response.data)
                    setMainUsers(response.data)
                } catch (error) {
                    if (error.response.data && error.response.data.statusCode === 401) {
                        navigate('/expired-token')
                    }
                    console.error(error)
                }
            }
        }
        getUser()
    }, [isLoading])

    const columns = useMemo(
        () => [
            {
                field: 'displayName',
                renderHeader: () => <p>{t('Display_name')}</p>,
                width: 200,
            },
            {
                field: 'username',
                renderHeader: () => <p>{t('User_name')}</p>,
                width: 200,
            },
            { field: 'roles', renderHeader: () => <p>{t('User_role')}</p>, width: 200 },
            {
                field: 'createdAt',
                renderHeader: () => <p>{t('Created_at')}</p>,
                width: 250,
                valueFormatter: (params) => {
                    // Tạo đối tượng Date từ chuỗi thời gian
                    const date = new Date(params.value)

                    // Lấy giá trị ngày, tháng, năm
                    const day = date.getDate().toString().padStart(2, '0') // padStart(2, "0") để hiển thị luôn 2 chữ số
                    const month = (date.getMonth() + 1).toString().padStart(2, '0') // Lưu ý là getMonth() trả về giá trị từ 0 - 11 nên cần + 1
                    const year = date.getFullYear()

                    // Kết hợp ngày, tháng và năm thành định dạng dd/mm/yyyy
                    const formattedDateString = `${day}-${month}-${year}`

                    return formattedDateString
                },
            },
            { field: '_id', renderHeader: () => <p>{t('User_id')}</p>, width: 220 },
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
        const selectRowData = ids.map((id) => users.find((row) => row._id === id))
        setUserIds(selectRowData)
        console.log(JSON.stringify(ids))

        setDisplay(selectRowData.displayName)
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

    const [displayName, setDisplayName] = useState()

    const onSearchUser = async () => {
        try {
            const request = await axios.post(
                `${process.env.REACT_APP_API_URI}/user`,
                {
                    displayName,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                },
            )
            if (request) {
                setUsers(request.data)
            } else {
                setUsers(mainusers)
            }
        } catch (error) {
            console.log(error)
            toast.error('Result not found')
            setUsers(mainusers)
        }
    }
    const onChangeDisplayName = (event) => {
        const value = event.target.value
        setDisplayName(value)
    }

    return (
        <div className="w-full">
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
            <h2 className="text-2xl w-full">{t('ManageAccount')}</h2>
            <div className="mb-4 flex justify-between w-full">
                <div>
                    <button
                        className="bg-[#3778DA] h-10 w-[170px] mt-5 mr-5 rounded-md text-white"
                        onClick={handleOpen}
                    >
                        {t('Add_user')}
                    </button>
                    <button
                        className={`bg-[#24AB62] h-10 w-[170px] mt-5 mr-5 rounded-md text-white ${
                            disableUpdate && 'opacity-50'
                        }`}
                        onClick={handleOpenUpdate}
                        disabled={disableUpdate}
                    >
                        {t('Update_user')}
                    </button>
                    <button
                        className={`bg-[#E14444] h-10 w-[170px] mt-5 rounded-md text-white ${disable && 'opacity-50'}`}
                        onClick={handleOpenDelete}
                        disabled={disable}
                    >
                        {t('Delete_user')}
                    </button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={style}>
                            <ModalAddUser setIsLoading={setIsLoading} onClose={handleClose} />
                        </Box>
                    </Modal>
                    <Modal
                        open={openUpdate}
                        onClose={handleCloseUpdate}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={style}>
                            <ModalUpdateUser
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
                            <ModalDeleteUser
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
                        placeholder={t('Search_displayname')}
                        onChange={onChangeDisplayName}
                    />
                    <button
                        className="bg-[#3778DA] h-10 w-[120px] mt-5 ml-5 rounded-md text-white"
                        onClick={onSearchUser}
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
                    rows={users}
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

export default ManageUser

export const ModalDeleteUser = (props) => {
    const { t } = useTranslation()

    const { userIds, setIsLoading, onClose } = props
    const onDeleteUser = async (userIds) => {
        try {
            setIsLoading(true)

            const requests = userIds.map((userId) =>
                axios.delete(`${process.env.REACT_APP_API_URI}/user/${userId._id}`, {
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
            setIsLoading(false)
        }
    }
    const handleDeleteClick = async () => {
        try {
            await onDeleteUser(userIds)
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

export const ModalAddUser = ({ onClose, setIsLoading }) => {
    const { t } = useTranslation()

    const [username, setUsername] = useState()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState()
    const [displayName, setDisplayName] = useState()

    const onAddUser = async () => {
        try {
            setIsLoading(true)
            await axios.post(`${process.env.REACT_APP_API_URI}/user/signup`, {
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
    const [validate, setValidate] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    })

    const onChangeUsername = (event) => {
        const value = event.target.value
        if (value.length >= 4) {
            setUsername(value)
            setValidate({ ...validate, username: '' }) // Cập nhật lại validate.username
        } else {
            setValidate({ ...validate, username: 'Nhập ít nhất 4 ký tự' }) // Cập nhật lại validate.username
        }
    }

    const onChangePass = (event) => {
        const value = event.target.value
        if (value.length >= 4) {
            setPassword(value)
            setValidate({ ...validate, password: '' }) // Cập nhật lại validate.password
        } else {
            setValidate({ ...validate, password: 'Nhập ít nhất 4 ký tự' }) // Cập nhật lại validate.password
        }
    }

    const onChangeConfirmPass = (event) => {
        const value = event.target.value
        setConfirmPassword(value)

        // So sánh confirmPassword với password
        if (value !== password) {
            setValidate({
                ...validate,
                confirmPassword: 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập',
            })
        } else {
            setValidate({ ...validate, confirmPassword: '' })
        }
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
        <div className="bg-[#1E1E1E] h-full flex items-center justify-center flex-col text-white">
            <div className="flex flex-col text-white mt-8">
                <h3 className="text-xl font-semibold">{t('Add_user')}</h3>
                <input
                    type="text"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                    placeholder={t('Placeholder_username')}
                    onChange={onChangeUsername}
                    onKeyPress={handleKeyPress}
                />
                {validate.username && <p className="text-red-400 text-sm ">{validate.username}</p>}
                <input
                    type="text"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                    placeholder={t('Placeholder_displayname')}
                    onChange={onChangeDisplayName}
                    onKeyPress={handleKeyPress}
                />

                <input
                    type="password"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB] "
                    placeholder={t('Placeholder_password')}
                    onChange={onChangePass}
                    onKeyPress={handleKeyPress}
                />
                {validate.password && <p className="text-red-400 text-sm ">{validate.password}</p>}
                <input
                    type="password"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                    placeholder={t('Placeholder_confirmPassword')}
                    onChange={onChangeConfirmPass}
                    onKeyPress={handleKeyPress}
                />
                {validate.confirmPassword && <p className="text-red-400 text-sm ">{validate.confirmPassword}</p>}
                <button className="bg-[#037AEB] h-12 w-[374px] mt-5 rounded-md p-3 font-semibold " onClick={onAddUser}>
                    {t('btn_Submit')}
                </button>
            </div>
        </div>
    )
}

export const ModalUpdateUser = (props) => {
    const { t } = useTranslation()

    const { userIds, setIsLoading, onClose } = props
    const [displayName, setDisplayName] = useState(userIds[0]?.displayName)
    const [roles, setRoles] = useState(userIds[0]?.roles)

    const onUpdateUser = async () => {
        try {
            setIsLoading(true)
            const data = {
                displayName: displayName,
                roles: roles,
            }
            const requests = userIds.map((userId) =>
                axios.put(`${process.env.REACT_APP_API_URI}/user/info/${userId._id}`, data, {
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
            setIsLoading(false)
        }
    }
    const handleUpdateClick = async () => {
        try {
            const result = await onUpdateUser(userIds)
            toast.success(`Successfully edited ${result.successCount} user!`)
            onClose()
            setIsLoading(false)
        } catch (error) {
            toast.error('User edit failed!')
        }
    }
    const onChangeRole = (event) => {
        const value = event.target.value
        setRoles(value)
    }
    const onChangeDisplayName = (event) => {
        const value = event.target.value
        setDisplayName(value)
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleUpdateClick()
        }
    }
    const rol = ['user', 'admin']

    return (
        <div className="bg-[#1E1E1E] h-full flex items-center justify-center flex-col text-white">
            <div className="flex flex-col text-white mt-8">
                <h3 className="text-xl font-semibold">{t('Update_user')}</h3>
                <input
                    type="text"
                    className="w-full h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                    value={displayName}
                    onChange={onChangeDisplayName}
                    onKeyPress={handleKeyPress}
                />

                <FormControl
                    sx={{
                        mt: 2,
                        background: '#31343E',
                        width: 1,
                        height: 52,
                        borderRadius: 3,
                    }}
                >
                    <Select
                        value={roles}
                        onChange={onChangeRole}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ color: '#C8C9CB', border: '1px solid #1E1E1E', height: 52 }}
                    >
                        <MenuItem value={rol[0]}>user</MenuItem>
                        <MenuItem value={rol[1]}>admin</MenuItem>
                    </Select>
                </FormControl>
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
