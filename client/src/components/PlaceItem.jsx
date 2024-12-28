import React from 'react';
import { ListItem, Typography, IconButton, Button, Dialog, TextField, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PlaceItem = ({ place, deletePlace, tripId, addActivity }) => {


    return (
        <ListItem>
            <Typography>{place.name}</Typography>
            <IconButton color="error" onClick={() => deletePlace(tripId, place.id)}>
                <DeleteIcon />
            </IconButton>
            <Button variant="contained" color="secondary" onClick={() => addActivity(place.id)} sx={{ marginLeft: '10px' }}>
                Add Activity
            </Button>
        </ListItem>
    );
};

export default PlaceItem;
