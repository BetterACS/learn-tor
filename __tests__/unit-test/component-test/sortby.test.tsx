import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SortBy from '@/components/sortby';
import '@testing-library/jest-dom';

describe('SortBy Component', () => {
  const mockFilters = ['Newest', 'Oldest', 'Most Likes'];
  const mockSortBy = 'Newest';
  const mockSetSortBy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the sort button with current sort value', () => {
    render(
      <SortBy 
        filters={mockFilters} 
        sortBy={mockSortBy} 
        setSortBy={mockSetSortBy} 
      />
    );

    expect(screen.getByText('Newest')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should open dropdown when button is clicked', () => {
    render(
      <SortBy 
        filters={mockFilters} 
        sortBy={mockSortBy} 
        setSortBy={mockSetSortBy} 
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Oldest')).toBeInTheDocument();
    expect(screen.getByText('Most Likes')).toBeInTheDocument();
  });

  it('should close dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside-element">Outside</div>
        <SortBy 
          filters={mockFilters} 
          sortBy={mockSortBy} 
          setSortBy={mockSetSortBy} 
        />
      </div>
    );

    // Open dropdown
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Oldest')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside-element'));
    expect(screen.queryByText('Oldest')).not.toBeInTheDocument();
  });

  it('should select a filter and close dropdown when an option is clicked', () => {
    render(
      <SortBy 
        filters={mockFilters} 
        sortBy={mockSortBy} 
        setSortBy={mockSetSortBy} 
      />
    );

    // Open dropdown
    fireEvent.click(screen.getByRole('button'));

    // Select an option
    fireEvent.click(screen.getByText('Oldest'));

    expect(mockSetSortBy).toHaveBeenCalledWith('Oldest');
    expect(screen.queryByText('Oldest')).not.toBeInTheDocument();
  });
});