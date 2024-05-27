import React, { useContext, useState, useEffect } from 'react';
import { Paper, Container, Card, Grid, CardContent, CardActions, Typography, IconButton, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, TextField, Button } from '@mui/material';
import { Edit, Delete, Share } from '@mui/icons-material';
import { NotesContext } from '../contextApi/context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function NoteCard({ text, title, id }) {
  const navigate = useNavigate();
  const { notes, notDispatch } = useContext(NotesContext);
  const [open, setOpen] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [noteTitle, setNoteTitle] = useState(title);
  const [noteText, setNoteText] = useState(text);
  const [selectedUser, setSelectedUser] = useState('');
  const [permission, setPermission] = useState('read');
  const [allusers, setAllUsers] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleShareOpen = () => setOpenShare(true);
  const handleShareClose = () => setOpenShare(false);

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete the note",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#d33"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:3009/api/note/delete/${id}`, {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          });
          Swal.fire({
            title: "Deleted!",
            text: "Note Deleted",
            icon: "success"
          });
          notDispatch({ type: "START_DELETE", payload: response.data });
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  const handleSave = async () => {
    const formData = {
      title: noteTitle ? noteTitle : title,
      note: noteText ? noteText : text
    };
    try {
      const response = await axios.put(`http://localhost:3009/api/update/note/${id}`, formData, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      notDispatch({ type: "START_UPDATE", payload: response.data });
    } catch (err) {
      console.log(err);
    }
    setOpen(false);
  };

  const handleShare = async () => {
    try {
      const response = await axios.post(`http://localhost:3009/api/note/share/${id}`, { userId: selectedUser, permission }, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token')) {
        try {
          const response = await axios.get('http://localhost:3009/api/users', {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          });
          setAllUsers(response.data);
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, []);

  return (
    <>
     {title && <Card style={{ margin: '20px', position: 'relative', width: '18rem', backgroundColor: 'lightyellow' }}>
        <CardContent style={{ textAlign: 'center' }}>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {text}
          </Typography>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <IconButton onClick={handleClickOpen}>
            <Edit />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <Delete />
          </IconButton>
        </CardActions>
        <IconButton
          onClick={handleShareOpen} variant="contained"
          style={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          <Share />
        </IconButton>
      </Card>
}
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
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openShare} onClose={handleShareClose}>
        <DialogTitle>Share Note</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-user-label">Select User</InputLabel>
                <Select
                  labelId="select-user-label"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  {allusers.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-permission-label">Permission</InputLabel>
                <Select
                  labelId="select-permission-label"
                  value={permission}
                  onChange={(e) => setPermission(e.target.value)}
                >
                  <MenuItem value="read">Read</MenuItem>
                  <MenuItem value="write">Write</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShareClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleShare} color="primary">
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
