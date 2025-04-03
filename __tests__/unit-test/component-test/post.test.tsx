import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Post from '@/components/post';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { trpc } from '@/app/_trpc/client';
import '@testing-library/jest-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Mock components
jest.mock('@/components/index', () => ({
  PostInteractionBar: () => <div>PostInteractionBar</div>,
  MockupTopicLoadingCard: () => <div>Loading...</div>,
  ErrorLoading: () => <div>Error</div>,
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock tRPC
jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    queryTopicById: {
      useQuery: jest.fn(),
    },
    checkTopicOwner: {
      useQuery: jest.fn(),
    },
    topicTags: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isPending: false,
      })),
    },
  },
}));

describe('Post Component', () => {
  const mockPost = {
    _id: '1',
    img: 'test.jpg',
    title: 'Test Post',
    body: 'This is a test post',
    created_at: new Date().toISOString(),
    n_like: 10,
    user_id: {
      username: 'testuser',
      avatar: '/test-avatar.jpg',
    },
    isLiked: false,
  };

  const mockRouterPush = jest.fn();
  
  beforeEach(() => {
    // Mock useSession
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          email: 'test@example.com',
        },
      },
    });

    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    // Mock tRPC queries
    (trpc.queryTopicById.useQuery as jest.Mock).mockReturnValue({
      data: { data: [mockPost] },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    (trpc.checkTopicOwner.useQuery as jest.Mock).mockReturnValue({
      data: { data: { permission: false } },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    // Mock tRPC mutations
    (trpc.topicTags.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((_, { onSuccess }) => 
        onSuccess({ topicTags: [{ tagname: 'tag1' }, { tagname: 'tag2' }] })
      ),
      isPending: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when data is loading', () => {
    (trpc.queryTopicById.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<Post topicId="1" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state when there is an error', () => {
    (trpc.queryTopicById.useQuery as jest.Mock).mockReturnValue({
      isError: true,
    });

    render(<Post topicId="1" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders post data when loaded', async () => {
    render(<Post topicId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText(mockPost.title)).toBeInTheDocument();
      expect(screen.getByText(mockPost.body)).toBeInTheDocument();
      expect(screen.getByText(mockPost.user_id.username)).toBeInTheDocument();
      expect(screen.getByText(dayjs(mockPost.created_at).fromNow())).toBeInTheDocument();
    });
  });

  it('displays user avatar', async () => {
    render(<Post topicId="1" />);
    
    await waitFor(() => {
      const avatars = screen.getAllByRole('img');
      const avatar = avatars.find(img => img.getAttribute('src') === mockPost.user_id.avatar);
      expect(avatar).toBeInTheDocument();
    });
  });

  it('shows default avatar when no avatar is provided', async () => {
    const postWithoutAvatar = {
      ...mockPost,
      user_id: { username: 'testuser' }
    };
    (trpc.queryTopicById.useQuery as jest.Mock).mockReturnValue({
      data: { data: [postWithoutAvatar] },
    });

    render(<Post topicId="1" />);
    
    await waitFor(() => {
      const avatars = screen.getAllByRole('img');
      const avatar = avatars.find(img => img.getAttribute('src') === '/images/profile.avif');
      expect(avatar).toBeInTheDocument();
    });
  });

  it('renders post image when provided', async () => {
    render(<Post topicId="1" />);
    
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      const postImage = images.find(img => img.getAttribute('src') === mockPost.img);
      expect(postImage).toBeInTheDocument();
    });
  });

  it('does not render image when not provided', async () => {
    const postWithoutImage = { ...mockPost, img: '' };
    (trpc.queryTopicById.useQuery as jest.Mock).mockReturnValue({
      data: { data: [postWithoutImage] },
    });

    render(<Post topicId="1" />);
    
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      const postImage = images.find(img => img.getAttribute('src') === mockPost.img);
      expect(postImage).toBeUndefined();
    });
  });

  it('does not show edit icon when user has no permission', async () => {
    render(<Post topicId="1" />);
    
    await waitFor(() => {
      const editIcons = screen.getAllByRole('img');
      const editIcon = editIcons.find(icon => 
        icon.getAttribute('viewBox') === '0 0 24 24' && 
        icon.getAttribute('xmlns') === 'http://www.w3.org/2000/svg'
      );
      expect(editIcon).toBeUndefined();
    });
  });

  it('navigates to edit page when edit icon is clicked', async () => {
    (trpc.checkTopicOwner.useQuery as jest.Mock).mockReturnValue({
      data: { data: { permission: true } },
    });

    const { container } = render(<Post topicId="1" />);
    
    await waitFor(() => {
      const editIcon = container.querySelector('svg[viewBox="0 0 24 24"]');
      if (editIcon) {
        fireEvent.click(editIcon);
        expect(mockRouterPush).toHaveBeenCalledWith(`forum/edit-topic/${mockPost._id}`);
      } else {
        throw new Error('Edit icon not found');
      }
    });
  });

  it('renders loading state for tags', async () => {
    (trpc.topicTags.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    const { container } = render(<Post topicId="1" />);
    
    await waitFor(() => {
      const placeholder = container.querySelector('.animate-pulse');
      expect(placeholder).toBeInTheDocument();
    });
  });

  it('renders tags when loaded', async () => {
    render(<Post topicId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
    });
  });

  it('includes interaction buttons', async () => {
    render(<Post topicId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText('PostInteractionBar')).toBeInTheDocument();
    });
  });

  it('navigates to post detail when clicked', async () => {
    render(<Post topicId="1" />);
    
    await waitFor(() => {
      const postLink = screen.getByRole('link');
      expect(postLink).toHaveAttribute('href', `/forum/${mockPost._id}`);
    });
  });

  it('handles error when fetching tags', async () => {
    const errorMock = jest.fn();
    console.error = errorMock;
    
    (trpc.topicTags.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((_, { onError }) => 
        onError(new Error('Failed to fetch tags'))
      ),
      isPending: false,
    });

    render(<Post topicId="1" />);
    
    await waitFor(() => {
      expect(errorMock).toHaveBeenCalledWith('Error fetching tags:', expect.any(Error));
    });
  });
});