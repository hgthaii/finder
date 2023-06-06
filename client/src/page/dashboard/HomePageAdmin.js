import React from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../translation/i18n'

import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Brightness7 from '@mui/icons-material/Brightness7'
import Brightness4 from '@mui/icons-material/Brightness4'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import CommentIcon from '@mui/icons-material/Comment'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import ManageComment from '../../components/admin/ManageComment'
import ManageUser from '../../components/admin/ManageUser'
import ManageMovie from '../../components/admin/ManageMovie'
import { MenuItem } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import imgUser from '../../asset/image/user.png'
import { Modal } from '@mui/material'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import axios from 'axios'
import { useCookies } from 'react-cookie'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 600,
    boxShadow: 24,
}
const iconList = [
    <AccountCircleIcon />,
    <LiveTvIcon />,
    <CommentIcon />,
    // Thêm các icon khác vào đây
]

const componentMap = {
    Account: ManageUser,
    Movie: ManageMovie,
    Comment: ManageComment,
    Profile: ManageComment,
}
const drawerWidth = 240

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
})

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
})

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}))

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}))

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
                    <Typography>{children}</Typography>
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
const HomePageAdmin = () => {
    const theme = useTheme()
    const [open, setOpen] = React.useState(false)
    const [light, setLight] = React.useState(true)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [selectedItem, setSelectedItem] = React.useState('Account')
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken'])

    const darkTheme = createTheme({
        palette: {
            mode: light ? 'light' : 'dark',
        },
    })

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const handleItemClick = (item) => {
        setSelectedItem(item)
    }

    const ComponentToRender = componentMap[selectedItem]

    const openn = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    // const name = JSON.parse(localStorage.getItem("infor"));
    const accessToken = cookies['accessToken']
    const tokenParts = accessToken.split('.')
    const encodedPayload = tokenParts[1]
    const decodedPayload = atob(encodedPayload)
    const payloadObj = JSON.parse(decodedPayload)
    const name = payloadObj.infor
    const handleLogout = async () => {
        // removeCookie('accessToken')
        // removeCookie('refreshToken')
        await axios.post('http://localhost:5000/api/v1/user/signout', null ,{withCredentials: true})
        window.location.href = '/'
    }
    const [openProfile, setOpenProfile] = React.useState(false)
    const handleOpenProfile = () => {
        setOpenProfile(true)
    }
    const handleCloseProfile = () => {
        setOpenProfile(false)
    }
    const { t } = useTranslation()
    function changeLanguage(e) {
        i18n.changeLanguage(e.target.value)
    }
    return (
        <ThemeProvider theme={darkTheme}>
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
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={open} sx={{ background: '#3778DA' }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            {/* Dashboard */}
                            {t('Title_header')}
                        </Typography>
                        <div style={{ marginLeft: 'auto', display: 'flex' }}>
                            <div className="flex items-center">
                                <select onChange={changeLanguage} className="text-black">
                                    <option value="vi">vi</option>
                                    <option value="en">en</option>
                                </select>
                            </div>
                            <IconButton onClick={() => setLight(!light)}>
                                {light ? <Brightness7 /> : <Brightness4 />}
                            </IconButton>
                            <div
                                aria-controls={openn ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openn ? 'true' : undefined}
                                onClick={handleClick}
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                <span style={{ color: 'white', cursor: 'pointer' }}>{name.displayName}</span>
                                <img
                                    src={imgUser}
                                    alt="user"
                                    className="w-[48px] h-12 rounded-full border border-blue-500 mx-5 cursor-pointer"
                                />
                            </div>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={openn}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleOpenProfile}>Account Setting</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>

                            <Modal
                                open={openProfile}
                                onClose={handleCloseProfile}
                                aria-labelledby="parent-modal-title"
                                aria-describedby="parent-modal-description"
                            >
                                <Box sx={style}>
                                    <ModalProfile onClose={handleCloseProfile} />
                                </Box>
                            </Modal>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {['Account', 'Movie', 'Comment'].map((text, index) => (
                            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                    selected={selectedItem === text}
                                    onClick={() => handleItemClick(text)}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {iconList[index]}
                                    </ListItemIcon>
                                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Box component="main" sx={{ mt: 10, ml: 8, mr: 10, flex: 1 }}>
                    <ComponentToRender />
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default HomePageAdmin

export const ModalProfile = () => {
    const [value, setValue] = React.useState(0)
    const [cookies] = useCookies(['accessToken', 'refreshToken'])

    const handleChange = (event,newValue) => {
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
                'http://localhost:5000/api/v1/user/update-profile',
                { displayName },
                {
                    withCredentials: true,
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
    const onChangePassword = async () => {
        try {
            const request = await axios.put(
                'http://localhost:5000/api/v1/user/update-password',
                {
                    password,
                    newPassword,
                    confirmNewPassword,
                },
                {
                    withCredentials: true,
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
