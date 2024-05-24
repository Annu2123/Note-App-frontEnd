import React, { useState,useContext } from 'react';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
 import { NotesContext } from '../contextApi/context';
 
export default function NoteAdd() {
    const {notDispatch}=useContext(NotesContext)
  const [open, setOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [errors, setErrors] = useState({});

  const handleAddNote = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setNoteTitle('')
    setNoteText('')
    setErrors({})
  };

  const handleAdd =async () => {
    const newErrors = {};
    if (!noteTitle) {
      newErrors.noteTitle = 'Title is required'
    }
    if (!noteText) {
      newErrors.noteText = 'note is required'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const noteform = {
      title:noteTitle,
      note: noteText,
    }
    try{
        const response=await axios.post('http://localhost:3009/api/create/note',noteform,{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
        console.log(response.data)
        notDispatch({type:"START_ADD",payload:response.data})
    }catch(err){
        console.log(err)
    }
    handleClose()
  }

  return (
    <Container>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" color="primary" onClick={handleAddNote}>
          Add Note
        </Button>
      </Box>
    
       
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="noteTitle"
            label="Note Title"
            type="text"
            fullWidth
            variant="outlined"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            error={!!errors.noteTitle}
            helperText={errors.noteTitle}
          />
          <TextField
            margin="dense"
            id="noteText"
            label="Note Text"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            error={!!errors.noteText}
            helperText={errors.noteText}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

