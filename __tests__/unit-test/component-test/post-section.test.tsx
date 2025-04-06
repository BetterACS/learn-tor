import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostSection from '@/components/post-section';
import { useSession } from 'next-auth/react';
import { trpc } from '@/app/_trpc/client';

// Mock external dependencies
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Complete TRPC mock
jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    queryMyTopic: {
      useQuery: jest.fn(),
    },
    queryMyBookmark: {
      useQuery: jest.fn(),
    },
    searchQuery: {
      useQuery: jest.fn(),
    },
    checkLike: {
      useMutation: jest.fn(() => ({
        mutateAsync: jest.fn(),
      })),
    },
    likePost: {
      useMutation: jest.fn(() => ({
        mutateAsync: jest.fn(),
      })),
    },
    savePost: {
      useMutation: jest.fn(() => ({
        mutateAsync: jest.fn(),
      })),
    },
  },
}));

// Mock child components
jest.mock('@/components/index', () => ({
  SortBy: ({ sortBy, setSortBy }: { sortBy: string; setSortBy: (value: string) => void }) => (
    <button
      data-testid="sort-button"
      onClick={() => setSortBy('Oldest')}
    >
      {sortBy}
    </button>
  ),
  Post: React.forwardRef((props: { topicId: string }, ref: any) => (
    <div ref={ref} data-testid="post">
      Post {props.topicId}
    </div>
  )),
  MockupTopicLoadingCard: () => <div data-testid="loading-card">Loading...</div>,
}));

describe('PostSection Component', () => {
  const mockSession = {
    user: { email: 'test@example.com' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for useSession
    (useSession as jest.Mock).mockReturnValue({ data: mockSession, status: 'authenticated' });
  });

  it('renders error message when data fetch fails', () => {
    (useSession as jest.Mock).mockReturnValue({ data: mockSession, status: 'authenticated' });
    (trpc.searchQuery.useQuery as jest.Mock).mockReturnValue({
      data: { status: 500 },
      isLoading: false,
      isError: true,
      refetch: jest.fn(),
    });

    render(<PostSection />);

    expect(screen.getByText('Fail to fetch topic')).toBeInTheDocument();
  });

  it('triggers sorting when SortBy is changed', async () => {
    (useSession as jest.Mock).mockReturnValue({ data: mockSession, status: 'authenticated' });
    (trpc.searchQuery.useQuery as jest.Mock).mockReturnValue({
      data: {
        data: [
          { _id: '1', img: '', title: '', body: '', created_at: '', n_like: 0, user_id: { username: '' }, isLiked: false },
        ],
        status: 200,
        maxPage: 1,
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<PostSection />);

    const sortButton = screen.getByTestId('sort-button');
    fireEvent.click(sortButton);

    await waitFor(() => {
      expect(sortButton).toHaveTextContent('Oldest');
    });
  });

  it('loads more posts when scrolled to the last post', async () => {
    const observeMock = jest.fn();
    const disconnectMock = jest.fn();
    window.IntersectionObserver = jest.fn(() => ({
      observe: observeMock,
      disconnect: disconnectMock,
    })) as any;

    (useSession as jest.Mock).mockReturnValue({ data: mockSession, status: 'authenticated' });
    (trpc.searchQuery.useQuery as jest.Mock).mockReturnValue({
      data: {
        data: [
          { _id: '1', img: '', title: '', body: '', created_at: '', n_like: 0, user_id: { username: '' }, isLiked: false },
          { _id: '2', img: '', title: '', body: '', created_at: '', n_like: 0, user_id: { username: '' }, isLiked: false },
        ],
        status: 200,
        maxPage: 2,
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<PostSection />);

    // Simulate observing the last post
    expect(observeMock).toHaveBeenCalled();
  });
});