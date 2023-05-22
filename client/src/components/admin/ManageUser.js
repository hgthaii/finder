import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
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
    const [users, setUsers] = useState([])
    const [mainusers, setMainUsers] = useState([])
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
        const getUser = async () => {
            if (!isLoading) {
                try {
                    // const config = {
                    //     headers: {
                    //         Authorization: `Bearer ${accessToken}`,
                    //     },
                    // }
                    const response = await axios.get('http://localhost:5000/api/v1/user/info', {
                        withCredentials: true,
                    })
                    // const { accessToken } = response.cookie
                    console.log(response)
                    // axios.defaults.withCredentials = true //cho phép lấy cookie từ server

                    console.log('oke123' + JSON.stringify(response))
                    setUsers(response.data)
                    setMainUsers(response.data)
                } catch (error) {
                    console.error(error)
                }
            }
        }
        getUser()
    }, [isLoading])

    const columns = useMemo(
        () => [
            { field: 'displayName', headerName: 'Display Name', width: 200 },
            {
                field: 'username',
                headerName: 'Username',
                width: 200,
            },
            { field: 'roles', headerName: 'Role', width: 200 },
            {
                field: 'createdAt',
                headerName: 'Created At',
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
            { field: 'id', headerName: 'Id', width: 220 },
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

    const [display, setDisplay] = useState()
    const [role, setRole] = useState()

    const onSelectHandle = (ids) => {
        const selectRowData = ids.map((id) => users.find((row) => row.id === id))
        setUserIds(selectRowData)
        setDisplay(selectRowData.displayName)
        setRole(selectRowData.roles)

        console.log(selectRowData)
        setDisable(selectRowData.length === 0)
    }

    const [displayName, setDisplayName] = useState()

    const onSearchUser = async () => {
        try {
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            const request = await axios.post(
                'http://localhost:5000/api/v1/user/',
                {
                    displayName,
                },
                config,
            )
            if (request) {
                setUsers(request.data)
            } else {
                setUsers(mainusers)
            }
        } catch (error) {
            console.log(error)
            setUsers(mainusers)
        }
    }
    const onChangeDisplayName = (event) => {
        const value = event.target.value
        setDisplayName(value)
    }
    const { t } = useTranslation()

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
                        className="bg-[#3778DA] h-10 w-[120px] mt-5 mr-5 rounded-md text-white"
                        onClick={handleOpen}
                    >
                        Add user
                    </button>
                    <button
                        className={`bg-[#24AB62] h-10 w-[120px] mt-5 mr-5 rounded-md text-white ${
                            disable && 'opacity-50'
                        }`}
                        onClick={handleOpenUpdate}
                        disabled={disable}
                    >
                        Update user
                    </button>
                    <button
                        className={`bg-[#E14444] h-10 w-[120px] mt-5 rounded-md text-white ${disable && 'opacity-50'}`}
                        onClick={handleOpenDelete}
                        disabled={disable}
                    >
                        Delete user
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
                                display={display}
                                role={role}
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
                        placeholder="Search username ..."
                        onChange={onChangeDisplayName}
                    />
                    <button
                        className="bg-[#3778DA] h-10 w-[120px] mt-5 ml-5 rounded-md text-white"
                        onClick={onSearchUser}
                    >
                        <SearchIcon />
                        Search
                    </button>
                </div>
            </div>
            <div className="w-full">
                <DataGrid
                    columns={columns}
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
                    onRowSelectionModelChange={(ids) => onSelectHandle(ids)}
                />
            </div>
        </div>
    )
}

export default ManageUser

export const ModalDeleteUser = (props) => {
    const { userIds, setIsLoading, onClose } = props
    const onDeleteUser = async (userIds) => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            const requests = userIds.map((userId) =>
                axios.delete(`http://localhost:5000/api/v1/user/${userId.id}`, config),
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

export const ModalAddUser = ({ onClose, setIsLoading }) => {
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
        <div className="bg-[#1E1E1E] h-full flex items-center justify-center flex-col text-white">
            <div className="flex flex-col text-white mt-8">
                <h3 className="text-xl font-semibold">Add user</h3>
                <input
                    type="text"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                    placeholder="Enter username"
                    onChange={onChangeUsername}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="text"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                    placeholder="Enter displayname"
                    onChange={onChangeDisplayName}
                    onKeyPress={handleKeyPress}
                />

                <input
                    type="password"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB] "
                    placeholder="Enter password"
                    onChange={onChangePass}
                    onKeyPress={handleKeyPress}
                />
                <input
                    type="password"
                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                    placeholder="Enter confirm password"
                    onChange={onChangeConfirmPass}
                    onKeyPress={handleKeyPress}
                />
                <button className="bg-[#037AEB] h-12 w-[374px] mt-5 rounded-md p-3 font-semibold " onClick={onAddUser}>
                    SUBMIT
                </button>
            </div>
        </div>
    )
}

export const ModalUpdateUser = (props) => {
    const { userIds, setIsLoading, onClose, display, role } = props
    const [displayName, setDisplayName] = useState()
    const [roles, setRoles] = useState('')
    console.log(display)
    console.log(role)

    const onUpdateUser = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            const data = {
                displayName: displayName,
                roles: roles,
            }
            const requests = userIds.map((userId) =>
                axios.put(`http://localhost:5000/api/v1/user/info/${userId.id}`, data, config),
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
    const handleUpdateClick = async () => {
        try {
            const result = await onUpdateUser(userIds)
            toast.success(`Successfully edited ${result.successCount} user!`)
            onClose()
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
                <h3 className="text-xl font-semibold">Update user</h3>
                <input
                    type="text"
                    value={display}
                    className="w-full h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                    placeholder="Enter displayname"
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
                        value={role}
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
                    SUBMIT
                </button>
            </div>
        </div>
    )
}
