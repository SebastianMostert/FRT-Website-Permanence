import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

import { useDispatch, useSelector } from 'react-redux';
import {
  signOut,
} from '../redux/user/userSlice';

function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  // TODO: Check if the user is currently logged in

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (linkTo) => {
    handleClose();
    if (!linkTo) return;
    window.location.href = linkTo;
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/v1/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      dispatch(signOut());

      handleNavigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const initials = currentUser ? currentUser.firstName.charAt(0).toUpperCase() + currentUser.lastName.charAt(0).toUpperCase() : '?';
  const size = 50;

  return (
    <React.Fragment>
      <div style={{ zIndex: 9999 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title={currentUser ? "Account settings" : 'Login'}>
            <IconButton
              onClick={currentUser ? handleClick : () => handleNavigate('/sign-in')}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              {/* TODO: Get user initials. Use John Smith for now.*/}
              {currentUser ?
                <Avatar sx={{ width: size, height: size }}>{initials}</Avatar> :
                <Avatar sx={{ width: size, height: size }}><LoginIcon /></Avatar>
              }
            </IconButton>
          </Tooltip>
        </Box>
        {currentUser &&
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => handleNavigate('/profile/')}>
              <Avatar>{initials}</Avatar> My account
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleNavigate('/settings/')}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        }
      </div>
    </React.Fragment>
  );
}

export default AccountMenu