import React from 'react';
import { Grid } from '@mui/material';
import { Blocks } from 'react-loader-spinner';

const Loader = () => {
    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: '100vh' }}
        >
            <Blocks
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
            />
        </Grid>
    );
};

export default Loader;