import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaginationButtons from '@/components/pagination';
import '@testing-library/jest-dom';

describe('PaginationButtons Component', () => {
  const mockOnPageChange = jest.fn();
  const defaultProps = {
    totalPages: 10,
    currentPage: 1,
    onPageChange: mockOnPageChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial props', () => {
    render(<PaginationButtons {...defaultProps} />);
    
    // Verify pagination component is rendered
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
    
    // Verify page input field is rendered with correct value
    const pageInput = screen.getByPlaceholderText('page');
    expect(pageInput).toBeInTheDocument();
    expect(pageInput).toHaveValue('1');
  });

  it('displays correct number of pages', () => {
    render(<PaginationButtons {...defaultProps} />);
    
    // Verify all page buttons are rendered
    const pageButtons = screen.getAllByRole('button');
    // First, last, previous, next buttons + 1 current page button
    expect(pageButtons.length).toBeGreaterThanOrEqual(5); 
  });

  it('calls onPageChange when a page button is clicked', () => {
    render(<PaginationButtons {...defaultProps} />);
    
    const pageTwoButton = screen.getByRole('button', { name: /go to page 2/i });
    fireEvent.click(pageTwoButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('changes page when Enter is pressed with valid input', () => {
    render(<PaginationButtons {...defaultProps} />);
    
    const pageInput = screen.getByPlaceholderText('page');
    
    // Enter valid page number
    fireEvent.change(pageInput, { target: { value: '5' } });
    fireEvent.keyDown(pageInput, { key: 'Enter' });
    
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  it('does not change page when Enter is pressed with invalid input', () => {
    const { rerender } = render(<PaginationButtons {...defaultProps} currentPage={3} />);
    
    const pageInput = screen.getByPlaceholderText('page');
    
    // Enter page number that's too high
    fireEvent.change(pageInput, { target: { value: '15' } });
    fireEvent.keyDown(pageInput, { key: 'Enter' });
    
    expect(mockOnPageChange).not.toHaveBeenCalled();
    expect(pageInput).toHaveValue('3'); // Reverts to current page
    
    // Re-render to reset the input
    rerender(<PaginationButtons {...defaultProps} currentPage={3} />);
    
    // Enter page number that's too low
    fireEvent.change(pageInput, { target: { value: '0' } });
    fireEvent.keyDown(pageInput, { key: 'Enter' });
    
    expect(mockOnPageChange).not.toHaveBeenCalled();
    expect(pageInput).toHaveValue('3'); // Reverts to current page
  });

  it('shows first and last page buttons', () => {
    render(<PaginationButtons {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /go to first page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to last page/i })).toBeInTheDocument();
  });
});