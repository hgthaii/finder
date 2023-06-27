import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Box from '@mui/material/Box'
import { PayPalButton } from 'react-paypal-button-v2'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

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
    const navigate = useNavigate()

    const [value, setValue] = React.useState(0)

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
    const accessToken = localStorage.getItem('accessToken')
    const tokenParts = accessToken.split('.')
    const encodedPayload = tokenParts[1]
    const decodedPayload = atob(encodedPayload)
    const parsedTokenBody = JSON.parse(decodedPayload)

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
            if (error.response.data && error.response.data.statusCode === 401) {
                navigate('/expired-token')
            }
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
    const [vip, setVip] = React.useState(null)

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
            if (error.response.data && error.response.data.statusCode === 401) {
                navigate('/expired-token')
            }
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                console.log(error)
            }
        }
    }

    const addPayment = async () => {
        try {
            const payment = await axios.post(
                `${process.env.REACT_APP_API_URI}/payment/create_payment_url`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                },
            )
            window.open(payment.data, '_blank')
        } catch (error) {
            if (error.response.data && error.response.data.statusCode === 401) {
                navigate('/expired-token')
            }
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        setVip(infor.isVip)
    }, [vip])
    const { t, i18n } = useTranslation()

    return (
        <div className="bg-[#1E1E1E] h-full flex items-center flex-col text-white">
            <div className="flex flex-col text-white mt-8">
                <h3 className="text-xl font-semibold mb-4 text-center">{t('Account_setting')}</h3>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="inherit"
                            aria-label="basic tabs example"
                        >
                            <Tab label={t('Accout_accoutInfomation')} {...a11yProps(0)} />
                            <Tab label={t('Accout_changeDisplayName')} {...a11yProps(1)} />
                            <Tab label={t('Accout_changePassword')} {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={parseInt(value)} index={0}>
                        <div className="grid grid-cols-2 gap-4">
                            <label>
                                <strong>ID:</strong> {infor?.id}
                            </label>
                            <label>
                                <strong>{t('Accout_DisplayName')}</strong> {infor?.displayName}
                            </label>
                            <label>
                                <strong>{t('Accout_userName')}</strong> {infor?.username}
                            </label>
                            <label>
                                <strong>ROLE:</strong> {inforRole}
                            </label>
                            <label>
                                <strong>{t('Accout_createdAt')}</strong> {formattedDateCreated}
                            </label>
                            <label>
                                <strong>{t('Accout_updateAt')}</strong> {formattedDateUpdated}
                            </label>
                        </div>
                        {infor.isVip === false ? (
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">
                                    {t('Desc_Vip')}
                                </h2>
                                <button
                                    onClick={addPayment}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {t('PayNow')}
                                </button>
                            </div>
                        ) : (
                            <p>{t('VIP')}</p>
                        )}
                    </TabPanel>
                    <TabPanel value={parseInt(value)} index={1}>
                        <div>
                            <label>{t('Accout_DisplayName')}</label>
                            <input
                                type="text"
                                className="w-[200px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB] "
                                placeholder={t('Placeholder_displayname')}
                                onChange={onChangeName}
                            />
                        </div>
                        <button
                            className="bg-[#037AEB] h-12 w-[100px] mt-5 rounded-md p-3 font-semibold "
                            onClick={onChangeDisplayName}
                        >
                            {t('Change')}
                        </button>
                    </TabPanel>
                    <TabPanel value={parseInt(value)} index={2}>
                        <div className="bg-[#1E1E1E] h-full flex items-center justify-center flex-col text-white">
                            <div className="flex flex-col text-white">
                                <input
                                    type="password"
                                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                                    placeholder={t('Placeholder_password')}
                                    onChange={onChangePass}
                                />

                                <input
                                    type="password"
                                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB] "
                                    placeholder={t('Placeholder_newPassword')}
                                    onChange={onChangeNewPass}
                                />
                                <input
                                    type="password"
                                    className="w-[374px] h-12 mt-3 rounded-md p-3 bg-[#31343E] text-[#C8C9CB]"
                                    placeholder={t('Placeholder_confirmPassword')}
                                    onChange={onChangeConfirmPass}
                                />
                                <button
                                    className="bg-[#037AEB] h-12 w-[100px] mt-5 rounded-md p-3 font-semibold mr-auto"
                                    onClick={onChangePassword}
                                >
                                    {t('Change')}
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
