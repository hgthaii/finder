import React from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Box from '@mui/material/Box'

import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import axios from 'axios'
import { useCookies } from 'react-cookie'
function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <span>{children}</span>
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}
const ModalProfile = () => {
    const [value, setValue] = React.useState(0)
    const [cookies] = useCookies(['accessToken', 'refreshToken'])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    function formatDate(dateString) {
        const date = new Date(dateString)
        const day = `${date.getDate().toString().padStart(2, '0')}`
        const month = `${(date.getMonth() + 1).toString().padStart(2, '0')}`
        const year = `${date.getFullYear()}`
        return `${day}-${month}-${year}`
    }
    const accessToken = cookies['accessToken']
    const tokenParts = accessToken.split('.')
    const encodedPayload = tokenParts[1]
    const decodedPayload = atob(encodedPayload)
    const parsedTokenBody = JSON.parse(decodedPayload)

    console.log('first' + JSON.stringify(parsedTokenBody.infor))
    const inforRole = parsedTokenBody.roles
    const infor = parsedTokenBody.infor

    const formattedDateCreated = formatDate(infor?.createdAt)
    const formattedDateUpdated = formatDate(infor?.updatedAt)

    const [displayName, setDisplayName] = React.useState()
    const onChangeName = (event) => {
        const value = event.target.value
        setDisplayName(value)
    }
    const onChangeDisplayName = async () => {
        try {
            const request = await axios.put(
                `${process.env.REACT_APP_API_URI}/user/update-profile`,
                { displayName },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                },
            )
            toast.success(request.data.message)

            // window.location.reload()
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                console.log(error)
            }
        }
    }

    const [password, setPassword] = React.useState()
    const [newPassword, setNewPassword] = React.useState()
    const [confirmNewPassword, setConfirmNewPassword] = React.useState()

    const onChangePass = (event) => {
        const value = event.target.value
        setPassword(value)
    }
    const onChangeNewPass = (event) => {
        const value = event.target.value
        setNewPassword(value)
    }
    const onChangeConfirmPass = (event) => {
        const value = event.target.value
        setConfirmNewPassword(value)
    }
    const payment = async () => {
        try {
            const request = await axios.post(`https://vnpay-gpw7.onrender.com/order/create_payment_url`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Access-Control-Allow-Origin': '*'
                },
            })
            toast.success(request.data.message)
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                console.log(error)
            }
        }
    }
    const onChangePassword = async () => {
        try {
            const request = await axios.put(
                `${process.env.REACT_APP_API_URI}/user/update-password`,
                {
                    password,
                    newPassword,
                    confirmNewPassword,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                },
            )
            toast.success(request.data.message)
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                console.log(error)
            }
        }
    }
    return (
        <div className="bg-[#1E1E1E] h-full flex items-center flex-col text-white">
            <div className="flex flex-col text-white mt-8">
                <h3 className="text-xl font-semibold mb-4 text-center">Account Setting</h3>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="inherit"
                            aria-label="basic tabs example"
                        >
                            <Tab label="Account Information" {...a11yProps(0)} />
                            <Tab label="Change DisplayName" {...a11yProps(1)} />
                            <Tab label="Change Password" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={parseInt(value)} index={0}>
                        <div className="grid grid-cols-2 gap-4">
                            <label>
                                <strong>ID:</strong> {infor?.id}
                            </label>
                            <label>
                                <strong>DISPLAY NAME:</strong> {infor?.displayName}
                            </label>
                            <label>
                                <strong>USERNAME:</strong> {infor?.username}
                            </label>
                            <label>
                                <strong>ROLE:</strong> {inforRole}
                            </label>
                            <label>
                                <strong>CREATED-AT:</strong> {formattedDateCreated}
                            </label>
                            <label>
                                <strong>UPDATED-AT:</strong> {formattedDateUpdated}
                            </label>
                            <button
                                onClick={payment}
                                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out"
                            >
                                Nạp lần đầu
                            </button>
                        </div>
                    </TabPanel>
                    <TabPanel value={parseInt(value)} index={1}>
                        <div>
                            <label>DISPLAYNAME: </label>
                            <input
                                type="text"
                                className="w-[200px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB] "
                                placeholder="Enter displayname"
                                onChange={onChangeName}
                            />
                        </div>
                        <button
                            className="bg-[#037AEB] h-12 w-[100px] mt-5 rounded-md p-3 font-semibold "
                            onClick={onChangeDisplayName}
                        >
                            CHANGE
                        </button>
                    </TabPanel>
                    <TabPanel value={parseInt(value)} index={2}>
                        <div className="bg-[#1E1E1E] h-full flex items-center justify-center flex-col text-white">
                            <div className="flex flex-col text-white">
                                <input
                                    type="password"
                                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                                    placeholder="Enter password"
                                    onChange={onChangePass}
                                />

                                <input
                                    type="password"
                                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB] "
                                    placeholder="Enter new password"
                                    onChange={onChangeNewPass}
                                />
                                <input
                                    type="password"
                                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                                    placeholder="Enter confirm new password"
                                    onChange={onChangeConfirmPass}
                                />
                                <button
                                    className="bg-[#037AEB] h-12 w-[100px] mt-5 rounded-md p-3 font-semibold mr-auto"
                                    onClick={onChangePassword}
                                >
                                    CHANGE
                                </button>
                            </div>
                        </div>
                    </TabPanel>
                </Box>
            </div>
        </div>
    )
}
export default ModalProfile
