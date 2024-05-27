import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardActions, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { Edit } from '@mui/icons-material';

export default function SharedNotesList() {
  const [sharedNotes, setSharedNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    fetchSharedNotes();
  }, []);

  const fetchSharedNotes = async () => {
    try {
      const response = await axios.get('http://localhost:3009/api/share/notes', {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      setSharedNotes(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickOpen = (note) => {
    setCurrentNote(note)
    setNoteTitle(note.title)
    setNoteText(note.note)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false);
    setCurrentNote(null);
  }

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:3009/api/update/note/${currentNote._id}`, {
        title: noteTitle,
        note: noteText
      }, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      console.log(response.data);
      setSharedNotes((prevNotes) => prevNotes.map(note => note._id === currentNote._id ? response.data : note))
      handleClose()
    } catch (err) {
      console.error(err)
    }
  };
console.log("asdsharedd",sharedNotes)
  return (
    <>
      <Grid container spacing={2}>
        {sharedNotes.map(note => (
          <Grid item xs={12} sm={6} md={4} key={note._id}>
            <Card style={{ margin: '20px', position: 'relative', width: '18rem', backgroundColor: 'lightyellow' }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {note.title}
                </Typography>
                <Typography variant="body2" component="p">
                  {note.note}
                </Typography>
              </CardContent>
              {note.sharedWith[0].permission == 'write' && (
                <CardActions style={{ justifyContent: 'flex-end' }}>
                  <IconButton onClick={() => handleClickOpen(note)}>
                    <Edit />
                  </IconButton>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {currentNote && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Note</DialogTitle>
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
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
