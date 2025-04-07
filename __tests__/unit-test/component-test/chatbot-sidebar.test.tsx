import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatbotSidebar from '@/components/chatbot-sidebar';
import { trpc } from '@/app/_trpc/client';
import '@testing-library/jest-dom';

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    userChatBot: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
      })),
    },
    deleteChat: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
      })),
    },
    editRoom: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
      })),
    },
  },
}));

jest.mock('dayjs', () => {
  const actualDayjs = jest.requireActual('dayjs');
  const mockDayjs = (date?: any) => {
    const instance = actualDayjs(date);
    return {
      ...instance,
      format: jest.fn(() => 'mocked date'),
      fromNow: jest.fn(() => 'a few seconds ago'),
      diff: jest.fn(() => 0),
    };
  };
  
  Object.assign(mockDayjs, actualDayjs);
  mockDayjs.extend = jest.fn();
  
  return mockDayjs;
});

jest.mock('dayjs/plugin/relativeTime', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('ChatbotSidebar Component', () => {
  const mockOnToggleSidebar = jest.fn();
  const mockOnSelectItem = jest.fn();
  const mockEmail = 'test@example.com';

  const mockLabels = [
    {
      _id: '1',
      name: 'Today Chat',
      history: [
        {
          role: 'user',
          content: 'Hello',
          time: new Date().toISOString(),
        },
      ],
    },
    {
      _id: '2',
      name: 'Previous Chat',
      history: [
        {
          role: 'user',
          content: 'Hi',
          time: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful userChatBot mutation
    (trpc.userChatBot.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(({ email }, { onSuccess }) => {
        if (email === mockEmail) {
          onSuccess({
            status: 200,
            data: { allChat: mockLabels },
          });
        }
      }),
    });

    (trpc.deleteChat.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(({ email, chatId }, { onSuccess }) => {
        onSuccess({
          status: 200,
        });
      }),
    });

    // Mock successful editRoom mutation
    (trpc.editRoom.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(({ email, chatId, name }, { onSuccess }) => {
        onSuccess({
          status: 200,
        });
      }),
    });
  });

  it('renders correctly with initial props', async () => {
    render(
      <ChatbotSidebar 
        onToggleSidebar={mockOnToggleSidebar} 
        onSelectItem={mockOnSelectItem} 
        email={mockEmail}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('New Chat')).toBeInTheDocument();
      expect(screen.getByText('Today Chat')).toBeInTheDocument();
      expect(screen.getByText('Previous Chat')).toBeInTheDocument();
    });
  });

  it('toggles sidebar when hide button is clicked', async () => {
    render(
      <ChatbotSidebar 
        onToggleSidebar={mockOnToggleSidebar} 
        onSelectItem={mockOnSelectItem} 
        email={mockEmail}
      />
    );

    const hideButton = await screen.findByAltText('Hide Icon');
    fireEvent.click(hideButton);

    expect(mockOnToggleSidebar).toHaveBeenCalledWith(false);
  });

  it('creates new chat when new chat button is clicked', async () => {
    render(
      <ChatbotSidebar 
        onToggleSidebar={mockOnToggleSidebar} 
        onSelectItem={mockOnSelectItem} 
        email={mockEmail}
      />
    );

    const newChatButton = await screen.findByAltText('NewChat Icon');
    fireEvent.click(newChatButton);

    expect(mockOnSelectItem).toHaveBeenCalledWith('new-chat');
  });

  it('selects chat item when clicked', async () => {
    render(
      <ChatbotSidebar 
        onToggleSidebar={mockOnToggleSidebar} 
        onSelectItem={mockOnSelectItem} 
        email={mockEmail}
      />
    );

    const chatItem = await screen.findByText('Today Chat');
    fireEvent.click(chatItem);

    expect(mockOnSelectItem).toHaveBeenCalledWith('1');
  });

  // it('opens menu when menu button is clicked', async () => {
  //   render(
  //     <ChatbotSidebar 
  //       onToggleSidebar={mockOnToggleSidebar} 
  //       onSelectItem={mockOnSelectItem} 
  //       email={mockEmail}
  //     />
  //   );

  //   const menuButtons = await screen.findAllByAltText('Menu');
  //   fireEvent.click(menuButtons[0]);

  //   expect(screen.getByText('เปลี่ยนชื่อ')).toBeInTheDocument();
  //   expect(screen.getByText('ลบ')).toBeInTheDocument();
  // });

  // it('enters edit mode when rename is clicked', async () => {
  //   render(
  //     <ChatbotSidebar 
  //       onToggleSidebar={mockOnToggleSidebar} 
  //       onSelectItem={mockOnSelectItem} 
  //       email={mockEmail}
  //     />
  //   );

  //   const menuButtons = await screen.findAllByAltText('Menu');
  //   fireEvent.click(menuButtons[0]);
  //   fireEvent.click(screen.getByText('เปลี่ยนชื่อ'));

  //   const input = await screen.findByDisplayValue('Today Chat');
  //   expect(input).toBeInTheDocument();
  // });

  // it('saves renamed chat when Enter is pressed', async () => {
  //   render(
  //     <ChatbotSidebar 
  //       onToggleSidebar={mockOnToggleSidebar} 
  //       onSelectItem={mockOnSelectItem} 
  //       email={mockEmail}
  //     />
  //   );

  //   const menuButtons = await screen.findAllByAltText('Menu');
  //   fireEvent.click(menuButtons[0]);
  //   fireEvent.click(screen.getByText('เปลี่ยนชื่อ'));

  //   const input = await screen.findByDisplayValue('Today Chat');
  //   fireEvent.change(input, { target: { value: 'Renamed Chat' } });
  //   fireEvent.keyDown(input, { key: 'Enter' });

  //   await waitFor(() => {
  //     expect(trpc.editRoom.useMutation).toHaveBeenCalled();
  //   });
  // });
});