import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Page from '@/app/chatbot/page';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import '@testing-library/jest-dom';

// Mock the trpc hooks
jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    chatBot: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isLoading: false,
      })),
    },
    userChatBot: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isLoading: false,
      })),
    },
    queryChat: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isLoading: false,
      })),
    },
    deleteChat: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isLoading: false,
      })),
    },
    editRoom: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isLoading: false,
      })),
    },
  },
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ 
    data: { 
      user: { 
        email: 'test@example.com',
        name: 'Test User',
      } 
    }, 
    status: 'authenticated' 
  })),
}));

describe('Chatbot Feature Integration Test', () => {
  const mockChatHistory = [
    {
      _id: 'chat1',
      name: 'Admission questions',
      history: [
        { role: 'user', content: 'What are the admission requirements?', time: '2023-05-01T10:00:00Z' },
        { role: 'assistant', content: 'Here are the admission requirements...', time: '2023-05-01T10:01:00Z' },
      ],
    },
    {
      _id: 'chat2',
      name: 'Scholarship info',
      history: [
        { role: 'user', content: 'What scholarships are available?', time: '2023-05-02T11:00:00Z' },
        { role: 'assistant', content: 'Here are the scholarship options...', time: '2023-05-02T11:01:00Z' },
      ],
    },
  ];

  beforeEach(() => {
    // Mock the userChatBot mutation response (sidebar chat history)
    (trpc.userChatBot.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((params, options) => {
        options.onSuccess({
          status: 200,
          data: { allChat: mockChatHistory },
        });
      }),
      isLoading: false,
    });

    // Mock the chatBot mutation response (new messages)
    (trpc.chatBot.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((params, options) => {
        options.onSuccess({
          chat: {
            _id: params.chatId || 'new-chat-id',
            history: [
              ...(params.chatId ? mockChatHistory.find(c => c._id === params.chatId)?.history || [] : []),
              { role: 'assistant', content: 'This is a test response', time: new Date().toISOString() },
            ],
          },
        });
      }),
      isLoading: false,
    });

    // Mock the queryChat mutation response (loading existing chat)
    (trpc.queryChat.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((params, options) => {
        const chat = mockChatHistory.find(c => c._id === params.chatId);
        if (chat) {
          options.onSuccess(chat);
        }
      }),
      isLoading: false,
    });
  });

  test('should render chatbot interface with sidebar', async () => {
    render(<Page />);
    
    // Verify sidebar and main chat area are rendered
    expect(screen.getByText('New Chat')).toBeInTheDocument();
    expect(screen.getByText('What can I help?')).toBeInTheDocument();
  });

  test('should load chat history in sidebar', async () => {
    render(<Page />);
    
    // Wait for chat history to load
    await waitFor(() => {
      expect(screen.getByText('Admission questions')).toBeInTheDocument();
      expect(screen.getByText('Scholarship info')).toBeInTheDocument();
    });
  });

  test('should allow sending and receiving messages', async () => {
    render(<Page />);
    
    // Type a message
    const input = screen.getByPlaceholderText('Text input');
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    // Send the message
    const sendButton = screen.getByAltText('Send Icon').parentElement;
    fireEvent.click(sendButton!);
    
    // Verify message appears in chat
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
    
    // Verify bot response appears
    await waitFor(() => {
      expect(screen.getByText('This is a test response')).toBeInTheDocument();
    });
  });

  test('should load existing chat when selected from sidebar', async () => {
    render(<Page />);
    
    // Wait for chat history to load
    await waitFor(() => {
      expect(screen.getByText('Admission questions')).toBeInTheDocument();
    });
    
    // Click on a chat from sidebar
    fireEvent.click(screen.getByText('Admission questions'));
    
    // Verify chat content is loaded
    await waitFor(() => {
      expect(screen.getByText('What are the admission requirements?')).toBeInTheDocument();
      expect(screen.getByText('Here are the admission requirements...')).toBeInTheDocument();
    });
  });

  test('should create new chat when "New Chat" is clicked', async () => {
    render(<Page />);
    
    // Click on New Chat button
    fireEvent.click(screen.getByText('New Chat'));
    
    // Verify chat is cleared
    await waitFor(() => {
      expect(screen.getByText('What can I help?')).toBeInTheDocument();
      expect(screen.queryByText('What are the admission requirements?')).not.toBeInTheDocument();
    });
  });

  test('should show loading indicator while bot is typing', async () => {
    // Mock the chatBot mutation to delay response
    (trpc.chatBot.useMutation as jest.Mock).mockReturnValueOnce({
      mutate: jest.fn((params, options) => {
        setTimeout(() => {
          options.onSuccess({
            chat: {
              _id: 'new-chat-id',
              history: [
                { role: 'assistant', content: 'This is a delayed response', time: new Date().toISOString() },
              ],
            },
          });
        }, 1000);
      }),
      isLoading: true,
    });

    render(<Page />);
    
    // Send a message
    const input = screen.getByPlaceholderText('Text input');
    fireEvent.change(input, { target: { value: 'Test message' } });
    const sendButton = screen.getByAltText('Send Icon').parentElement;
    fireEvent.click(sendButton!);
    
    // Verify loading indicator appears
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
    
    // Verify response eventually appears
    await waitFor(() => {
      expect(screen.getByText('This is a delayed response')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('should show error message when chat fails to load', async () => {
    // Mock an error response
    (trpc.userChatBot.useMutation as jest.Mock).mockReturnValueOnce({
      mutate: jest.fn((params, options) => {
        options.onError(new Error('Failed to load chats'));
      }),
      isLoading: false,
    });

    render(<Page />);
    
    // Verify error alert is shown
    await waitFor(() => {
      expect(screen.getByText('Failed to load chats')).toBeInTheDocument();
    });
  });

  test('should allow deleting a chat', async () => {
    // Mock delete response
    (trpc.deleteChat.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((params, options) => {
        options.onSuccess({
          status: 200,
        });
      }),
      isLoading: false,
    });

    render(<Page />);
    
    // Wait for chat history to load
    await waitFor(() => {
      expect(screen.getByText('Admission questions')).toBeInTheDocument();
    });
    
    // Open menu for a chat
    const menuButtons = screen.getAllByAltText('Menu');
    fireEvent.click(menuButtons[0]);
    
    // Click delete option
    fireEvent.click(screen.getByText('Delete'));
    
    // Confirm deletion
    fireEvent.click(screen.getByText('Delete'));
    
    // Verify chat is removed
    await waitFor(() => {
      expect(screen.queryByText('Admission questions')).not.toBeInTheDocument();
    });
  });
});