import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPopup from '@/components/search-popup';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock TRPC client
jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    getSearchTags: {
      useQuery: jest.fn(() => ({
        data: null,
        isLoading: false,
        isError: false,
      })),
    },
  },
}));

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

describe('SearchPopup Component', () => {
  const mockSetIsPopupOpen = jest.fn();
  const mockSetSearchTerm = jest.fn();
  
  const mockTagsData = {
    Languages: [
      { tagname: 'JavaScript', category: 'Languages', count: 100 },
      { tagname: 'TypeScript', category: 'Languages', count: 80 }
    ],
    Frameworks: [
      { tagname: 'React', category: 'Frameworks', count: 150 },
      { tagname: 'Next.js', category: 'Frameworks', count: 90 }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (trpc.getSearchTags.useQuery as jest.Mock).mockReturnValue({
      data: mockTagsData,
      isLoading: false,
      isError: false,
    });
  });

  it('renders the search popup with initial state', () => {
    render(
      <SearchPopup 
        isPopupOpen={true}
        setIsPopupOpen={mockSetIsPopupOpen}
        setSearchTerm={mockSetSearchTerm}
        searchTerm=""
      />
    );

    expect(screen.getByPlaceholderText('Search here')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search tag here')).toBeInTheDocument();
    expect(screen.queryByText('Selected Tags:')).not.toBeInTheDocument();
  });
  
  it('updates search term when typing in search input', () => {
    render(
      <SearchPopup 
        isPopupOpen={true}
        setIsPopupOpen={mockSetIsPopupOpen}
        setSearchTerm={mockSetSearchTerm}
        searchTerm=""
      />
    );

    const searchInput = screen.getByPlaceholderText('Search here');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    expect(mockSetSearchTerm).toHaveBeenCalledWith('test');
  });

  it('performs search when pressing enter in search input', () => {
    render(
      <SearchPopup 
        isPopupOpen={true}
        setIsPopupOpen={mockSetIsPopupOpen}
        setSearchTerm={mockSetSearchTerm}
        searchTerm="react"
      />
    );

    const searchInput = screen.getByPlaceholderText('Search here');
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    
    expect(mockPush).toHaveBeenCalledWith(
      '/forum/search/react?query=%7B%7D'
    );
  });

  it('displays tags when they are loaded', async () => {
    render(
      <SearchPopup 
        isPopupOpen={true}
        setIsPopupOpen={mockSetIsPopupOpen}
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Languages')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('Frameworks')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });
  });
});