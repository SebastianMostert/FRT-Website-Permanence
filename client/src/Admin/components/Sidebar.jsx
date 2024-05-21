/* eslint-disable react/prop-types */
import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import MenuIcon from '@mui/icons-material/Menu';
import ListIcon from '@mui/icons-material/List';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SettingsIcon from '@mui/icons-material/Settings';
import EventIcon from '@mui/icons-material/Event';
import EventNoteIcon from '@mui/icons-material/EventNote';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import BarChartIcon from '@mui/icons-material/BarChart';

// const Sidebar = () => {
//     // State to manage visibility of sub-links
//     const [showAvailabilities, setShowAvailabilities] = useState(false);

//     // Function to toggle visibility of Availabilities sub-links
//     const toggleAvailabilities = () => {
//         setShowAvailabilities(!showAvailabilities);
//     };

//     return (
//         <div className="select-none">
//             <style>
//                 {`
//                 .sidebar {
//                     height: 100vh;
//                     width: 250px;
//                     position: fixed;
//                     top: 0;
//                     left: 0;
//                     background-color: #f8f9fa;
//                     padding: 20px;
//                     overflow-y: auto; /* Enable scrolling */
//                 }

//                 .sidebar-footer {
//                     position: fixed;
//                     bottom: 20px;
//                     left: 20px;
//                     width: 250px;
//                 }

//                 .content {
//                     margin-left: 250px;
//                     padding: 20px;
//                 }

//                 .sub-links {
//                     display: ${showAvailabilities ? 'block' : 'none'};
//                     padding-left: 20px;
//                 }

//                 .sub-links a {
//                     display: block;
//                     padding: 5px 0;
//                 }
//                 `}
//             </style>

//             <div className="sidebar">
//                 <Nav className="flex-column">
//                     <Nav.Item>
//                         <Nav.Link as={NavLink} to="/admin" exact>
//                             <FontAwesomeIcon icon={faHome} /> Home
//                         </Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item>
//                         <Nav.Link onClick={toggleAvailabilities}>
//                             <FontAwesomeIcon icon={faCalendar} /> Availabilities
//                             {showAvailabilities ? (
//                                 <FontAwesomeIcon icon={faAngleUp} className="ml-2" />
//                             ) : (
//                                 <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
//                             )}
//                         </Nav.Link>
//                         <div className="sub-links">
//                             <Nav.Link as={NavLink} to="/admin/availabilities" exact>
//                                 Availabilities
//                             </Nav.Link>
//                             <Nav.Link as={NavLink} to="/admin/shifts" exact>
//                                 Shifts
//                             </Nav.Link>
//                         </div>
//                     </Nav.Item>
//                     <Nav.Item>
//                         <Nav.Link as={NavLink} to="/admin/users" exact>
//                             <FontAwesomeIcon icon={faUsers} /> Users
//                         </Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item>
//                         <Nav.Link as={NavLink} to="/admin/stock">
//                             <FontAwesomeIcon icon={faCubes} /> Stock
//                         </Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item>
//                         <Nav.Link as={NavLink} to="/admin/settings">
//                             <FontAwesomeIcon icon={faCog} /> Settings
//                         </Nav.Link>
//                     </Nav.Item>
//                 </Nav>
//             </div>
//             <div className="sidebar-footer">
//                 <Button variant="primary" as={NavLink} to="/">
//                     Return to Website
//                 </Button>
//             </div>
//         </div>
//     );
// };
const OPEN_KEY = 'sidebarOpen';

const Sidebar = ({ children }) => {
    const theme = useTheme();
    const isOpenDefault = window.localStorage.getItem(OPEN_KEY) === 'true';

    const [open, setOpen] = useState(isOpenDefault);

    const handleDrawerOpen = () => {
        setOpen(true);
        // Save to local storage
        window.localStorage.setItem(OPEN_KEY, true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        // Save to local storage
        window.localStorage.setItem(OPEN_KEY, false);
    };

    const handleClick = (linkTo) => {
        window.location.href = linkTo;
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
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
                        Admin Dashboard
                    </Typography>
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
                    {['Dashboard'].map((text) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => handleClick('/admin/')}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <BarChartIcon />
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['Availabilities', 'Shifts'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => handleClick('/admin/' + text.toLowerCase())}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {index % 2 === 0 ? <EventIcon /> : <EventNoteIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['Users', 'Stock', 'Audit', 'Settings'].map((text) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => handleClick('/admin/' + text.toLowerCase())}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {text === 'Users' ? <PeopleIcon /> : text === 'Stock' ? <Inventory2Icon /> : text === 'Audit' ? <ListIcon /> : <SettingsIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['Return to Website'].map((text) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => handleClick('/')}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <KeyboardReturnIcon />
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
};

export default Sidebar;

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

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
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

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
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
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
    }),
);