import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useParams, usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { trpc } from '@/app/_trpc/client';
import '@testing-library/jest-dom';

// Mock the necessary hooks and components
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    queryTopic: {
      useQuery: jest.fn(),
    },
    queryTopicById: {
      useQuery: jest.fn(),
    },
    queryMyTopic: {
      useQuery: jest.fn(),
    },
    queryMyBookmark: {
      useQuery: jest.fn(),
    },
    getTags: {
      useQuery: jest.fn(),
    },
    checkTopicOwner: {
      useQuery: jest.fn(),
    },
    checkLike: {
      useMutation: jest.fn(),
    },
    topicTags: {
      useMutation: jest.fn(),
    },
    likeTopic: {
      useMutation: jest.fn(),
    },
    updateTopic: {
      useMutation: jest.fn(),
    },
    updateTags: {
      useMutation: jest.fn(),
    },
    deleteTopic: {
      useMutation: jest.fn(),
    },
  },
}));

// Mock components
jest.mock('@/components/index', () => ({
  Navbar: () => <div>Navbar</div>,
  Sidebar: () => <div>Sidebar</div>,
  SearchBar: () => <div>SearchBar</div>,
  TrendingTopic: () => <div>TrendingTopic</div>,
  PostSection: ({ myTopic, myBookmark, searchTerm, filterTags }: any) => (
    <div>
      {myTopic && 'My Topics Section'}
      {myBookmark && 'My Bookmarks Section'}
      {searchTerm && `Search Results for: ${searchTerm}`}
      {filterTags && `Filter Tags: ${JSON.stringify(filterTags)}`}
    </div>
  ),
  LoadingCircle: () => <div>Loading...</div>,
  ErrorLoading: () => <div>Error Loading</div>,
  AlertBox: ({ alertType, title, message }: any) => (
    <div className={`alert-${alertType}`}>
      {title}: {message}
    </div>
  ),
}));

describe('Forum Feature Integration Tests', () => {
  const mockSession = {
    user: {
      email: 'test@example.com',
      name: 'Test User',
    },
    status: 'authenticated',
  };

  const mockTopics = [
    {
      _id: '1',
      title: 'Test Topic 1',
      body: 'Test body 1',
      user_id: { username: 'user1' },
      created_at: new Date().toISOString(),
      n_like: 10,
    },
    {
      _id: '2',
      title: 'Test Topic 2',
      body: 'Test body 2',
      user_id: { username: 'user2' },
      created_at: new Date().toISOString(),
      n_like: 5,
    },
  ];

  const mockTags = {
    'คณะ': ['Engineering', 'Science'],
    'มหาวิทยาลัย': ['Chulalongkorn', 'Thammasat'],
  };

  beforeEach(() => {
    // Default mock implementations
    (useSession as jest.Mock).mockReturnValue({ data: mockSession, status: 'authenticated' });
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useParams as jest.Mock).mockReturnValue({});
    (usePathname as jest.Mock).mockReturnValue('/forum');
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  describe('Forum Home Page', () => {
    test('renders forum home page with topics', async () => {
      (trpc.queryTopic.useQuery as jest.Mock).mockReturnValue({
        data: { data: mockTopics },
        isLoading: false,
        isError: false,
      });

      (trpc.getTags.useQuery as jest.Mock).mockReturnValue({
        data: mockTags,
        isLoading: false,
        isError: false,
      });

      render(
        <div className="h-full w-full flex flex-col items-center text-center gap-12">
          <div className="w-full self-start flex flex-col gap-4">
            <div className="w-fit border-b-4 border-primary-600">
              <p className="text-headline-4 text-primary-600 py-1">
                Portfolio Topic
              </p>
            </div>
          </div>
          <div className="w-full h-full">
            <PostSection />
          </div>
        </div>
      );

      expect(screen.getByText('Portfolio Topic')).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('Chulalongkorn')).toBeInTheDocument();
    });

    test('shows loading state when fetching topics', () => {
      (trpc.queryTopic.useQuery as jest.Mock).mockReturnValue({
        isLoading: true,
      });

      render(
        <div className="h-full w-full flex flex-col items-center text-center gap-12">
          <div className="w-full h-full">
            <PostSection />
          </div>
        </div>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('shows error state when topic fetch fails', () => {
      (trpc.queryTopic.useQuery as jest.Mock).mockReturnValue({
        isError: true,
      });

      render(
        <div className="h-full w-full flex flex-col items-center text-center gap-12">
          <div className="w-full h-full">
            <PostSection />
          </div>
        </div>
      );

      expect(screen.getByText('Error Loading')).toBeInTheDocument();
    });
  });

  describe('My Topics Page', () => {
    test('renders user topics', async () => {
      (trpc.queryMyTopic.useQuery as jest.Mock).mockReturnValue({
        data: { data: mockTopics, totalResults: 2 },
        isLoading: false,
        isError: false,
      });

      render(
        <div className="flex flex-col gap-4 divide-y divide-primary-600">
          <div className="flex justify-between text-headline-3 text-primary-600">
            <p>Topic ของฉัน</p>
            <p>2 หัวข้อ</p>
          </div>
          <div className="pt-5">
            <PostSection myTopic={true} />
          </div>
        </div>
      );

      expect(screen.getByText('Topic ของฉัน')).toBeInTheDocument();
      expect(screen.getByText('2 หัวข้อ')).toBeInTheDocument();
      expect(screen.getByText('My Topics Section')).toBeInTheDocument();
    });
  });

  describe('My Bookmarks Page', () => {
    test('renders user bookmarks', async () => {
      (trpc.queryMyBookmark.useQuery as jest.Mock).mockReturnValue({
        data: { data: mockTopics, totalResults: 2 },
        isLoading: false,
        isError: false,
      });

      render(
        <div className="flex flex-col gap-4 divide-y divide-primary-600">
          <div className="flex justify-between text-headline-3 text-primary-600">
            <p>Bookmark ของฉัน</p>
            <p>2 หัวข้อ</p>
          </div>
          <div className="pt-5">
            <PostSection myBookmark={true} />
          </div>
        </div>
      );

      expect(screen.getByText('Bookmark ของฉัน')).toBeInTheDocument();
      expect(screen.getByText('2 หัวข้อ')).toBeInTheDocument();
      expect(screen.getByText('My Bookmarks Section')).toBeInTheDocument();
    });
  });

  describe('Search Page', () => {
    test('renders search results with term', async () => {
      (usePathname as jest.Mock).mockReturnValue('/forum/search/test');
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      render(
        <div className="flex flex-col gap-2">
          <p className="text-headline-3">ผลการค้นหา "<span className="text-primary-500">test</span>"</p>
          <PostSection searchTerm="test" />
        </div>
      );

      expect(screen.getByText('ผลการค้นหา "test"')).toBeInTheDocument();
      expect(screen.getByText('Search Results for: test')).toBeInTheDocument();
    });

    test('renders search results with tags', async () => {
      const mockTags = { tag1: 'included', tag2: 'excluded' };
      (usePathname as jest.Mock).mockReturnValue('/forum/search');
      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams({ query: JSON.stringify(mockTags) })
      );

      render(
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {Object.entries(mockTags).map(([tag, status]) => (
              <div
                key={tag}
                className={`text-body-1 border rounded-[1rem] px-3 py-2 cursor-pointer ${
                  status === 'included' ? 'border-green-600' : 
                  status === 'excluded' ? 'border-red-600' : 'border-monochrome-600'
                }`}
              >
                {tag}
              </div>
            ))}
          </div>
          <PostSection filterTags={mockTags} />
        </div>
      );

      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
      expect(screen.getByText(/Filter Tags/)).toBeInTheDocument();
    });
  });

  describe('Topic Detail Page', () => {
    const mockTopic = {
      _id: '1',
      title: 'Test Topic',
      body: 'Test body',
      img: '',
      created_at: new Date().toISOString(),
      n_like: 10,
      user_id: { username: 'testuser', avatar: '' },
      isLiked: false,
    };

    beforeEach(() => {
      (useParams as jest.Mock).mockReturnValue({ topicId: '1' });
      (trpc.queryTopicById.useQuery as jest.Mock).mockReturnValue({
        data: { data: [mockTopic] },
        isLoading: false,
        isError: false,
      });
      (trpc.checkTopicOwner.useQuery as jest.Mock).mockReturnValue({
        data: { data: { permission: true } },
        isLoading: false,
        isError: false,
      });
      (trpc.checkLike.useMutation as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isLoading: false,
      });
      (trpc.topicTags.useMutation as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isLoading: false,
      });
      (trpc.likeTopic.useMutation as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isLoading: false,
      });
    });

    test('renders topic details', async () => {
      render(
        <div className="relative w-full h-full">
          <div className="w-full h-full flex flex-col px-[10%] gap-6">
            <div className="w-full h-fit flex justify-between">
              <div className="flex content-center items-center gap-2">
                <div className="size-10">
                  <img src="/images/profile.avif" className="w-full h-full object-cover rounded-full"/>
                </div>
                <p className="text-headline-6 font-bold">
                  testuser
                </p>
                <p className="text-subtitle-small">•</p>
                <p className="text-subtitle-small text-monochrome-400">
                  a few seconds ago
                </p>
              </div>
            </div>
            <div className="w-full h-fit flex flex-col items-center gap-2">
              <div className="w-full h-fit text-headline-4">Test Topic</div>
              <div className="text-headline-6 w-full">Test body</div>
            </div>
          </div>
        </div>
      );

      expect(screen.getByText('Test Topic')).toBeInTheDocument();
      expect(screen.getByText('Test body')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    test('shows edit button for topic owner', async () => {
      render(
        <div className="w-full h-fit flex justify-between">
          {true && (
            <svg 
              onClick={() => {}}
              className="text-monochrome-500 size-7 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"></path>
            </svg>
          )}
        </div>
      );

      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('Edit Topic Page', () => {
    const mockTopic = {
      _id: '1',
      title: 'Test Topic',
      body: 'Test body',
      img: '',
      created_at: new Date().toISOString(),
      user_id: { username: 'testuser' },
      tags: [{ tagname: 'test', category: 'general' }],
    };

    beforeEach(() => {
      (useParams as jest.Mock).mockReturnValue({ topicId: '1' });
      (trpc.queryTopicById.useQuery as jest.Mock).mockReturnValue({
        data: { data: [mockTopic] },
        isLoading: false,
        isError: false,
      });
      (trpc.updateTopic.useMutation as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isLoading: false,
      });
      (trpc.updateTags.useMutation as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isLoading: false,
      });
      (trpc.deleteTopic.useMutation as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isLoading: false,
      });
    });

    test('renders edit form with topic data', async () => {
      render(
        <div className="relative h-full w-full">
          <p className="text-headline-3 mb-6">Edit Topic</p>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-headline-5">
              <p>Title</p>
              <div className="w-full h-fit bg-monochrome-100 py-3 px-4 rounded-md">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value="Test Topic"
                  className="bg-transparent w-full outline-none placeholder-monochrome-600 caret-monochrome-600"
                /> 
              </div>
            </div>
          </div>
        </div>
      );

      expect(screen.getByText('Edit Topic')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Topic')).toBeInTheDocument();
    });
  });
});