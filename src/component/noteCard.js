import React, { useState, useContext} from 'react';
import {Grid, Box, Button, Container } from '@mui/material';
import { NotesContext } from '../contextApi/context';
import NoteCard from './noteList';
export default function NoteList() {
   const {notes}=useContext(NotesContext)
console.log("JHGHJ",notes)
  return (
    <Container>
      <Grid container spacing={3} mt={2}>
        {notes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note._id}>
            <NoteCard
              id={note._id}
              title={note.title}
              text={note.note}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}


