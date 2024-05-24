import React from 'react';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHomeUser, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { NotesContext } from '../../contextApi/context';
import { useContext } from 'react';
export default function Header({user}) {
  const {notDispatch}=useContext(NotesContext)
  const navigate=useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    notDispatch({type:"START_LOGOUT"})
    navigate('/')
}
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Note App
        </Typography>
        <Box display="flex" justifyContent="flex-end" alignItems="center" p={2} bgcolor="primary.main">
        {user   && (
        
          <Button color="inherit" style={{ color: 'white' }}>
            {user.userName}
          </Button>
  
      )}
      {!localStorage.getItem("token") && (
        <Link to="/register" style={{ textDecoration: 'none', marginRight: '10px' }}>
          <Button color="inherit" style={{ color: 'white' }}>
            <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '5px' }} />
            Register
          </Button>
        </Link>
      )}
      {!localStorage.getItem('token')  && (
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button color="inherit" style={{ color: 'white' }}>
            <FontAwesomeIcon icon={faHomeUser} style={{ marginRight: '5px' }} />
            Login
          </Button>
        </Link>
      )}
      {localStorage.getItem('token')  && (
       
          <Button onClick={handleLogout} color="inherit" style={{ color: 'white' }}>
            <FontAwesomeIcon icon={faHomeUser} style={{ marginRight: '5px' }} />
            Logout
          </Button>
      
      )}
        {localStorage.getItem('token')  && (
       
      <Link to="/sharedNotes"> <Button color="inherit" style={{ color: 'white' }}>
        
         sharedNotes
       </Button></Link>
   
   )}
    </Box>
      </Toolbar>
    </AppBar>
  )
}
