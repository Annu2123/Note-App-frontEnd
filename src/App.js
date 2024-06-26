
import './App.css';
import {NotesContext} from './contextApi/context'
import NoteList from './component/noteCard';
import NoteCard from './component/noteList';
import Header from './component/pages/header';
import Login from './component/userAuth/login';
import Register from './component/userAuth/register';
import NoteAdd from './component/addNotes';
import SharedNotesList from './component/sharedNotes';
import {BrowserRouter,Link,Routes,Route,Navigate} from 'react-router-dom'
import { useEffect, useState,useReducer ,useContext} from 'react';
import axios from 'axios';
import ProtectedRoute from './component/protectedRoute'
function reducer(state, action) {
  switch (action.type) {
    case "GET_NOTES": {
      return action.payload
    }
    case "START_ADD":{
      return [...state,action.payload]
    }
    case "START_DELETE":{
      return   state.filter((ele)=>{
        if(ele._id != action.payload._id){
          return ele
        }
      })
    }
    case "START_UPDATE":{
      return state.map((ele)=>{
        if(ele._id == action.payload._id){
          return action.payload
        }else{
          return ele
        }
      })
    }
    case "START_LOGOUT":{
      return []
    }
    default: {
      return [...state]
    }
  }
}
export default function App() {
  const[token,setToken]=useState(localStorage.getItem('token')|| null)
  const[user,setUser]=useState({})
  const [notes,notDispatch] = useReducer(reducer, [])
  const[sharedNotes,setShareNotes]=useState([])
  const[users,setUsers]=useState([])
  // useEffect(()=>{
  //  (async()=>{
  //   try{
  //     const response=axios.post('')
  //   }catch(err){
  //     console.log(err)
  //   }
  //  })()
  // },[])
  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token')) {
        try {
          const response = await axios.get('http://localhost:3009/api/account', {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          });
          console.log('sghgfdsfd', response.data);
          setUser(response.data);
        } catch (err) {
          console.log(err);
        }
      }
    })()
  }, [token])
  
  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token') && user) {
        try {
          const response = await axios.get('http://localhost:3009/api/note', {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          });
          console.log('sghgfdsfd', response.data)
          notDispatch({ type: 'GET_NOTES', payload: response.data })
        } catch (err) {
          console.log(err)
        }
      }
    })()
  }, [user,token])
  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token') && user) {
        try {
          const response = await axios.get('http://localhost:3009/api/users', {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          })
          console.log('users', response.data)
          setUsers(response.data)
         
        } catch (err) {
          console.log(err);
        }
      }
    })()
  }, [user,token])
  // const setUserLogin=async(data)=>{
  //   try{
  //     const response=await axios.get('http://localhost:3009/api/account',{
  //       headers:{
  //         Authorization:localStorage.getItem('token')
  //       }
  //     })
  //     console.log("sdfgf",response.data)
  //     setUser(response.data)
  //   }catch(err){
  //     console.log(err)
  //   }
  // }
  useEffect(()=>{
    (async()=>{
      try {
        const response = await axios.get('http://localhost:3009/api/share/notes', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        console.log("asdfgfds",response.data)
        setShareNotes(response.data)
      } catch (err) {
      console.log(err)
      }
    

    })()
  },[token])
  
  // const token = localStorage.getItem('token')
  return (
    <BrowserRouter>
    <NotesContext.Provider value={{ notes, notDispatch }}>
      <Header user={user} />
      <div className="App">
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
         
          <Route 
            path='/sharedNotes' 
            element={
              <ProtectedRoute token={token}>
                <SharedNotesList />
              </ProtectedRoute>
            } 
          />
        </Routes>
        {token && (
          <>
            <NoteAdd />
            <NoteList />
            <NoteCard />
          </>
        )}
      </div>
    </NotesContext.Provider>
  </BrowserRouter>
   
  )
}


