import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography,CardActions, Grid,IconButton, InputLabel, } from '@mui/material';
import { Edit, Delete, Share } from '@mui/icons-material'
 export default function  SharedNotesList() {
  const [sharedNotes, setSharedNotes] = useState([]);

  useEffect(() => {
    (async()=>{
        try {
            const response = await axios.get('http://localhost:3009/api/share/notes',{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            })
            setSharedNotes(response.data);
          } catch (err) {
            console.log(err)
          }
    })()
  }, [])

  console.log("sssssssss",sharedNotes)

  return (
    <Grid container spacing={2}>
      {sharedNotes?.map(note => (
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
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <IconButton >
            <Edit />
          </IconButton>

        </CardActions>
           
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}


