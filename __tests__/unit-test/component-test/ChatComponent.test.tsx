import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatComponent from '@/components/ChatComponent';

const mockMessages = [
  { role: 'assistant', content: 'Hello! How can I assist?', time: '10:00 AM' },
  { role: 'user', content: 'Can you help me with my code?', time: '10:01 AM' },
  { role: 'assistant', content: 'Of course! What do you need help with?', time: '10:02 AM' },
];

describe('ChatComponent', () => {
  it('renders all messages correctly', () => {
    render(<ChatComponent messages={mockMessages} />);

    const assistantMessages = screen.getAllByText(/Hello! How can I assist\?|Of course! What do you need help with\?/i);
    const userMessages = screen.getByText(/Can you help me with my code\?/i);

    expect(assistantMessages.length).toBe(2);
    expect(userMessages).toBeInTheDocument();
  });

  it('renders the assistant logo for assistant messages', () => {
    render(<ChatComponent messages={mockMessages} />);
    const assistantImages = screen.getAllByAltText('assistant Logo');
    expect(assistantImages.length).toBe(2);
  });

  it('applies proper styles to assistant messages', () => {
    render(<ChatComponent messages={mockMessages} />);
    const assistantMessages = screen.getAllByText(/Hello! How can I assist\?|Of course! What do you need help with\?/i);
    
    assistantMessages.forEach(message => {
      const messageContainer = message.closest('div[class*="bg-monochrome-50"]');
      expect(messageContainer).toHaveClass('self-start');
      expect(messageContainer).toHaveClass('bg-monochrome-50');
    });
  });

  it('applies proper styles to user messages', () => {
    render(<ChatComponent messages={mockMessages} />);
    const userMessage = screen.getByText(/Can you help me with my code\?/i);
    const messageContainer = userMessage.closest('div[class*="bg-monochrome-100"]');
    
    expect(messageContainer).toHaveClass('self-end');
    expect(messageContainer).toHaveClass('bg-monochrome-100');
  });

  it('renders the MarkdownComponent correctly', () => {
    render(<ChatComponent messages={mockMessages} />);
    const firstMessage = screen.getByText('Hello! How can I assist?');
    expect(firstMessage).toBeInTheDocument();
  });
});