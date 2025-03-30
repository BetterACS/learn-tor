'use client';
import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationButtons: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const [inputPage, setInputPage] = useState<string>(currentPage.toString());

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
    setInputPage(value.toString());
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setInputPage(value);
    }
  };

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const pageNumber = Number(inputPage);
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        onPageChange(pageNumber);
      } else {
        setInputPage(currentPage.toString());
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10 w-full bg-monochrome-50 p-4">
      <Stack spacing={2} alignItems="center">
        <div className="flex items-center gap-2">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
            color="primary"
            variant="outlined"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: '8px',
                minWidth: '35px',
                height: '35px',
              },
            }}
          />
          <TextField
            variant="outlined"
            size="small"
            type="text"
            inputMode="numeric"
            placeholder="page"
            value={inputPage}
            onChange={handleInputChange}
            onKeyDown={handleEnterKey}
            sx={{ width: '40px' }}
            inputProps={{
              min: 1,
              max: totalPages,
              style: { textAlign: 'center', padding: '7px' },
            }}
          />
        </div>
      </Stack>
    </div>
  );
};

export default PaginationButtons;
