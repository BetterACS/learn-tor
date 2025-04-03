import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Comments from '@/components/Comments';
import { trpc } from '@/app/_trpc/client';

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    getAllComments: {
      useQuery: jest.fn(),
    },
    likeComment: {
      useMutation: jest.fn(() => ({
        mutateAsync: jest.fn(),
      })),
    },
    checkLike: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
      })),
    },
  },
}));

jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs');
  const mockDayjs = (...args: any[]) => originalDayjs(...args);
  
  Object.assign(mockDayjs, originalDayjs);
  mockDayjs.extend = jest.fn();
  
  return mockDayjs;
});

jest.mock('dayjs/plugin/relativeTime', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockComments = [
  {
    _id: '1',
    user_id: {
      email: 'user1@example.com',
      username: 'user1',
      avatar: '/avatar1.jpg',
    },
    comment: 'First comment',
    created_at: '2023-01-01T00:00:00Z',
    children: [],
    n_like: 5,
  },
  {
    _id: '2',
    user_id: {
      email: 'user2@example.com',
      username: 'user2',
      avatar: '/avatar2.jpg',
    },
    comment: 'Second comment',
    created_at: '2023-01-02T00:00:00Z',
    parent_id: '1',
    children: [],
    n_like: 3,
  },
];

describe('Comments Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (trpc.getAllComments.useQuery as jest.Mock).mockReturnValue({
      data: { data: { comments: mockComments } },
      isLoading: false,
      error: null,
    });
  });

  it('renders loading state', () => {
    (trpc.getAllComments.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
    });
    render(<Comments topicId="test-topic" userEmail="test@example.com" />);
    expect(screen.getByText('กำลังโหลดความคิดเห็น...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (trpc.getAllComments.useQuery as jest.Mock).mockReturnValue({
      error: { message: 'Test error' },
    });
    render(<Comments topicId="test-topic" userEmail="test@example.com" />);
    expect(screen.getByText(/เกิดข้อผิดพลาด:/i)).toBeInTheDocument();
  });

  it('renders no comments message when there are no comments', () => {
    (trpc.getAllComments.useQuery as jest.Mock).mockReturnValue({
      data: { data: { comments: [] } },
    });
    render(<Comments topicId="test-topic" userEmail="test@example.com" />);
    expect(screen.getByText('ยังไม่มีความคิดเห็น')).toBeInTheDocument();
  });
});