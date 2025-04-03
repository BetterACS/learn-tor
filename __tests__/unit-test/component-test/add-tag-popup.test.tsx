import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddTagPopup from '@/components/add-tag-popup';
import { trpc } from '@/app/_trpc/client';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: jest.fn().mockReturnValue('/'),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    getSearchTags: {
      useQuery: jest.fn(() => ({
        data: {},
        isLoading: false,
        isError: false,
      })),
    },
  },
}));

jest.mock('@/components/index', () => ({
  Button: ({ button_name, onClick }: { button_name: string; onClick: () => void }) => (
    <button onClick={onClick}>{button_name}</button>
  ),
}));

describe('AddTagPopup Component', () => {
  const mockSetIsPopupOpen = jest.fn();
  const mockSetTags = jest.fn().mockImplementation((callback) => {
    if (typeof callback === 'function') {
      return callback([]);
    }
    return callback;
  });
  const mockTags = [
    { tagname: 'React', category: 'Frameworks', count: 10 },
    { tagname: 'TypeScript', category: 'Languages', count: 15 },
  ];

  const mockTagList = {
    Frameworks: [
      { tagname: 'React', category: 'Frameworks', count: 10 },
      { tagname: 'Next.js', category: 'Frameworks', count: 8 },
    ],
    Languages: [
      { tagname: 'JavaScript', category: 'Languages', count: 20 },
      { tagname: 'TypeScript', category: 'Languages', count: 15 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (trpc.getSearchTags.useQuery as jest.Mock).mockReturnValue({
      data: mockTagList,
      isLoading: false,
      isError: false,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    });

    mockSetTags.mockImplementation((callback) => {
      if (typeof callback === 'function') {
        return callback(mockTags);
      }
      return callback;
    });
  });

  it('renders correctly with initial props', () => {
    render(
      <AddTagPopup
        isPopupOpen={true}
        setIsPopupOpen={mockSetIsPopupOpen}
        tags={mockTags}
        setTags={mockSetTags}
      />
    );

    expect(screen.getByPlaceholderText('Search tag here')).toBeInTheDocument();
    expect(screen.getByText('Selected Tags:')).toBeInTheDocument();

    expect(screen.getAllByText('React')[0]).toBeInTheDocument();
    expect(screen.getByText('TypeScript', { selector: 'div.text-body-1' })).toBeInTheDocument();
    expect(screen.getByText('Frameworks', { selector: 'h3' })).toBeInTheDocument();
    expect(screen.getByText('Languages', { selector: 'h3' })).toBeInTheDocument();
  });

  it('adds new tag when clicking + button and entering text', async () => {
    render(
      <AddTagPopup
        isPopupOpen={true}
        setIsPopupOpen={mockSetIsPopupOpen}
        tags={mockTags}
        setTags={mockSetTags}
      />
    );

    const addButtons = screen.getAllByText('+');
    fireEvent.click(addButtons[0]);

    const input = screen.getByPlaceholderText('New tag');
    fireEvent.change(input, { target: { value: 'Vue' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockSetTags).toHaveBeenCalledWith(expect.any(Function));
    const callback = mockSetTags.mock.calls[0][0];
    expect(callback(mockTags)).toEqual([
      ...mockTags,
      { tagname: 'Vue', category: 'Frameworks', count: 0 },
    ]);
  });

  it('closes popup when clicking Add button', () => {
    render(
      <AddTagPopup
        isPopupOpen={true}
        setIsPopupOpen={mockSetIsPopupOpen}
        tags={mockTags}
        setTags={mockSetTags}
      />
    );

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(mockSetIsPopupOpen).toHaveBeenCalledWith(false);
  });
});