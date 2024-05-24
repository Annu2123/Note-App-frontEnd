import { useState } from 'react';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip'
import FaceIcon from '@mui/icons-material/Face'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
const emailValid = (email) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);

export default function Register() {
  const navigate=useNavigate()
    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [userNameError, setUserNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
  const[serverError,setServerError]=useState([])
    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    }

    const validateUserName = () => {
      if (!userName) {
        setUserNameError('Username is required')
      } else if (userName.length < 5 || userName.length > 20) {
        setUserNameError('Username must be between 5 and 20 characters')
      } else {
        setUserNameError('')
      }
    }

    const validateEmail = () => {
      if (!emailValid(email)) {
        setEmailError('Invalid email address')
      } else {
        setEmailError('')
      }
    };

    const validatePassword = () => {
      if (!password) {
        setPasswordError('Password is required')
      } else if (password.length < 5 || password.length > 20) {
        setPasswordError('Password must be between 5 and 20 characters')
      } else {
        setPasswordError('')
      }
    }

    const registerAlert=()=>{
      Swal.fire({
        title: "register success!",
        text: "please login ",
        icon: "success"
      });
    }
    const handleClick =async (e) => {
      e.preventDefault()
      validateUserName()
      validateEmail()
      validatePassword()

      if (!userNameError && !emailError && !passwordError) {
        const formData = {
          userName,
          password,
          email
        }
        try {
          const response = await axios.post('http://localhost:3009/api/register', formData)
        
          console.log(response.data)
          const data = response.data
          registerAlert()
          navigate('/login')
          // loginToast()
      } catch (err) {
        setServerError(err.response.data.errors)
              console.log(err.response.data.errors)
              alert(err.response.data.error)
              console.log(err)
          } 
      }
    }
console.log(serverError)
    return (
      <Paper elevation={3} style={{ width: '350px', margin: '0 auto', padding: '16px' }}>
        <Chip icon={<FaceIcon />} label="Register" color="primary" variant="outlined" style={{ marginBottom: '16px' }} />
        <div>
          <TextField 
            id="user-name"
            label="User Name"
            variant="standard"
            value={userName}
            onBlur={validateUserName}
            onChange={(e) => setUserName(e.target.value)}
            error={!!userNameError}
            helperText={userNameError}
            fullWidth
            margin="normal"
            size='small'
          />
          <TextField 
            id="email"
            label="Email"
            variant="standard"
            value={email}
            onBlur={validateEmail}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            fullWidth
            margin="normal"
            size='small'
          />
          <FormControl variant="standard" fullWidth margin="normal" error={!!passwordError}>
            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
            <Input
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onMouseDown={handleMouseDownPassword}
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {passwordError && <p style={{ color: 'red', margin: '4px 0 0' }}>{passwordError}</p>}
          </FormControl>
          {serverError.length > 0 && serverError.map((ele,i)=>{
            return <li key={i} style={{color:"red"}}>{ele.msg}</li>
          })}<br/>
          <Button onClick={handleClick} variant="contained" startIcon={<HowToRegIcon />} style={{ marginTop: '16px' }}>
            Register
          </Button>
        </div>
      </Paper>
    );
}
