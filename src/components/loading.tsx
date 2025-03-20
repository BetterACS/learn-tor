'use client';
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
{/* <CircularProgress color="primary" size={40} /> */}
const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </div>
  );
};

export default Loading;