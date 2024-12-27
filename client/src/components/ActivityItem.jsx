import React from 'react';
import { ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ActivityItem = ({ activity, deleteActivity, tripId }) => {
    const handleDeleteActivity = () => {
        deleteActivity(tripId, activity.id);
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
                primary={activity.name}
                secondary={activity.description}
                sx={{ maxWidth: '80%' }}
            />
            <IconButton color="error" onClick={handleDeleteActivity}>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    );
};

export default ActivityItem;
