import React from 'react';
import { ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PlaceItem = ({ place, deletePlace, tripId }) => {
    const handleDeletePlace = () => {
        deletePlace(tripId, place.id);
    };

    return (
        <ListItem
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                borderBottom: '1px solid #ddd',
            }}
        >
            <ListItemText
                primary={place.name}
                secondary={place.description}
                sx={{ maxWidth: '80%' }}
            />
            <IconButton color="error" onClick={handleDeletePlace}>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    );
};

export default PlaceItem;
