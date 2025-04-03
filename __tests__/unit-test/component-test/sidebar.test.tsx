import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sidebar from '@/components/sidebar';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    getTopTags: {
      useQuery: jest.fn(() => ({
        data: null,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
      })),
    },
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => '/forum'),
}));

describe('Sidebar Component', () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };
  const mockTags = [
    { tagname: 'javascript' },
    { tagname: 'react' },
    { tagname: 'typescript' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render the sidebar with loading state', () => {
    (trpc.getTopTags.useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    });

    render(<Sidebar />);
    
    expect(screen.getByText('Homepage')).toBeInTheDocument();
    expect(screen.getByText('My Topic')).toBeInTheDocument();
    expect(screen.getByText('My Bookmark')).toBeInTheDocument();
    expect(screen.getByText('Create Topic')).toBeInTheDocument();
    expect(screen.getByText('Forum')).toBeInTheDocument();
    
    // Check for loading placeholders
    const placeholders = screen.getAllByText('Placeholder');
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it('should render the sidebar with tags data', async () => {
    (trpc.getTopTags.useQuery as jest.Mock).mockReturnValue({
      data: mockTags,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<Sidebar />);
    
    await waitFor(() => {
      mockTags.forEach(tag => {
        expect(screen.getByText(tag.tagname)).toBeInTheDocument();
      });
    });
  });

  it('should redirect when menu items are clicked', () => {
    (trpc.getTopTags.useQuery as jest.Mock).mockReturnValue({
      data: mockTags,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<Sidebar />);
    
    // Test homepage navigation
    fireEvent.click(screen.getByText('Homepage'));
    expect(mockRouter.push).toHaveBeenCalledWith('/forum');
    expect(mockRouter.refresh).toHaveBeenCalled();
    
    // Test my topic navigation
    fireEvent.click(screen.getByText('My Topic'));
    expect(mockRouter.push).toHaveBeenCalledWith('/forum/my-topic');
    
    // Test bookmark navigation
    fireEvent.click(screen.getByText('My Bookmark'));
    expect(mockRouter.push).toHaveBeenCalledWith('/forum/bookmark');
  });

  it('should navigate to search page when a tag is clicked', async () => {
    (trpc.getTopTags.useQuery as jest.Mock).mockReturnValue({
      data: mockTags,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<Sidebar />);
    
    await waitFor(() => {
      const tagButton = screen.getByText('javascript');
      fireEvent.click(tagButton);
      expect(mockRouter.push).toHaveBeenCalledWith(
        '/forum/search/?query=javascript'
      );
    });
  });

  it('should show error state if tag fetch fails', () => {
    (trpc.getTopTags.useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      refetch: jest.fn(),
    });

    render(<Sidebar />);
    
    // Verify that tags section is empty when there's an error
    const tagButtons = screen.queryAllByRole('button');
    expect(tagButtons.length).toBe(0); // Only the tag buttons, not navigation buttons
  });

  it('should match the number of tags with the top parameter', async () => {
    const mockTags = Array(15).fill(0).map((_, i) => ({ tagname: `tag${i}` }));
    (trpc.getTopTags.useQuery as jest.Mock).mockReturnValue({
      data: mockTags,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<Sidebar />);
    
    await waitFor(() => {
      const tagButtons = screen.getAllByRole('button');
      // Only the top 10 tags should be shown (as defined in the component)
      expect(tagButtons.length).toBe(10);
    });
  });
});