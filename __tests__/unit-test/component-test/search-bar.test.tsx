import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import SearchBar from '@/components/search-bar';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock the SearchPopup component with proper syntax
jest.mock('@/components/index', () => ({
  SearchPopup: jest.fn(({ isPopupOpen }) => (
    isPopupOpen ? <div data-testid="search-popup">Search Popup</div> : null
  ))
}));

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/forum',
}));

describe('SearchBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the search bar with initial state', () => {
    render(<SearchBar />);
    
    expect(screen.getByPlaceholderText('Search here')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByTestId('search-popup')).not.toBeInTheDocument();
  });

  it('should update search term when typing in input', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText('Search here');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect(input).toHaveValue('test query');
  });

  it('should perform search when clicking search button', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText('Search here');
    fireEvent.change(input, { target: { value: 'react' } });
    
    const searchButton = screen.getByRole('button');
    fireEvent.click(searchButton);
    
    expect(mockPush).toHaveBeenCalledWith('/forum/search/react');
    expect(input).toHaveValue('');
  });

  it('should perform search when pressing enter in input', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText('Search here');
    fireEvent.change(input, { target: { value: 'nextjs' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockPush).toHaveBeenCalledWith('/forum/search/nextjs');
    expect(input).toHaveValue('');
  });

  it('should open search popup when clicking filter icon', () => {
    render(<SearchBar />);
    
    const filterIcon = screen.getByRole('button').querySelector('div');
    if (!filterIcon) {
      throw new Error('Filter icon not found');
    }
    
    fireEvent.click(filterIcon);
    
    expect(screen.getByTestId('search-popup')).toBeInTheDocument();
  });

  it('should close popup when clicking outside', async () => {
    render(<SearchBar />);
    
    // Open the popup first
    const filterIcon = screen.getByRole('button').querySelector('div');
    if (!filterIcon) {
      throw new Error('Filter icon not found');
    }
    fireEvent.click(filterIcon);
    
    // Verify popup is open
    expect(screen.getByTestId('search-popup')).toBeInTheDocument();
    
    // Click outside (on the document body)
    fireEvent.mouseDown(document.body);
    
    // Popup should be closed
    await waitFor(() => {
      expect(screen.queryByTestId('search-popup')).not.toBeInTheDocument();
    });
  });

  it('should not close popup when clicking inside', async () => {
    render(<SearchBar />);
    
    // Open the popup
    const filterIcon = screen.getByRole('button').querySelector('div');
    if (!filterIcon) {
      throw new Error('Filter icon not found');
    }
    fireEvent.click(filterIcon);
    
    // Click inside the popup
    const popup = screen.getByTestId('search-popup');
    fireEvent.mouseDown(popup);
    
    // Popup should remain open
    await waitFor(() => {
      expect(screen.getByTestId('search-popup')).toBeInTheDocument();
    });
  });

  it('should clean up event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<SearchBar />);
    
    // Open popup to trigger event listener
    const filterIcon = screen.getByRole('button').querySelector('div');
    if (!filterIcon) {
      throw new Error('Filter icon not found');
    }
    fireEvent.click(filterIcon);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
    
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});