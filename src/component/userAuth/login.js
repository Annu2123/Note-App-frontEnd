import { useState } from 'react';
import * as React from 'react';
import Swal from 'sweetalert2'
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
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const emailValid = (email) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);

export default function Login({setUserLogin}) {
  const navigate=useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const[serverError, setServerError]=useState([])
    // const setToken=(data)=>{
    //   setUserLogin(data)
    // }
    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleMouseDownPassword = (event) => {
      event.preventDefault()
    }
const loginPop=()=>{
  Swal.fire({
    title: "login success",
    text: "",
    icon: "success"
  });
}
    const validateEmail = () => {
      if (!emailValid(email)) {
        setEmailError('Invalid email address')
      } else {
        setEmailError('')
      }
    }

    const validatePassword = () => {
      if (!password) {
        setPasswordError('Password is required');
      } else if (password.length < 5 || password.length > 20) {
        setPasswordError('Password must be between 5 and 20 characters');
      } else {
        setPasswordError('')
      }
    }

    const handleLogin= async(e) => {
      e.preventDefault()
      validateEmail()
      validatePassword()

      if ( !emailError && !passwordError) {
        const formData = {
          password,
          email
        }
        try {
          const response = await axios.post('http://localhost:3009/api/login', formData)
        
          console.log(response.data)
          const data = response.data
          localStorage.setItem('token', data.token)
          // setToken(response.data.token)
          navigate('/')
          loginPop()
      } catch (err) {
        console.log(err)
        setServerError(err.response.data)
          } 
          }
      }

    
console.log("sdfgf",serverError)
    return (
     <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
       <Paper elevation={3} style={{ width: '350px', margin: '0 auto', padding: '16px',textAlign: 'center' }}>
        <Chip icon={<FaceIcon />} label="Login" color="primary" variant="outlined" style={{ marginBottom: '16px' }} />
        <div>
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
          {/* {serverError.length > 0 && serverError.map((ele,i)=>{
            return <li key={i}>{ele}</li>
          })} */}
          {serverError && serverError.error}<br/>
          <Button onClick={handleLogin} variant="contained" startIcon={<HowToRegIcon />} style={{ marginTop: '16px' }}>
            Login
          </Button>
        </div>
      </Paper>
     </Container>
    )
}
