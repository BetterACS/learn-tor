import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentSection from '@/components/comment-section';

const mockComments = [
  {
    username: 'User1',
    time: '1',
    text: 'This is a comment.',
    likes: 10,
    comments: [
      {
        username: 'NestedUser1',
        time: '1',
        text: 'This is a nested comment.',
        likes: 5,
        comments: [],
      },
    ],
  },
  {
    username: 'User2',
    time: '2',
    text: 'Another comment.',
    likes: 15,
    comments: [],
  },
];

jest.mock('@/components/index', () => ({
  SortBy: ({ sortBy, setSortBy }: { sortBy: string; setSortBy: (value: string) => void }) => (
    <button
      data-testid="sort-button"
      onClick={() => setSortBy('Oldest')}
    >
      {sortBy}
    </button>
  ),
  CommentInput: ({ topic_id }: { topic_id: string | null }) => (
    <div data-testid="comment-input">Comment Input for topic: {topic_id}</div>
  ),
}));

describe('CommentSection Component', () => {
  it('renders the sort by section when comments are present', () => {
    render(<CommentSection />);
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
  });

  it('renders the comment input when the comment button is clicked', () => {
    render(<CommentSection />);
    const commentButtons = screen.getAllByRole('button', { name: 'Comment' });

    fireEvent.click(commentButtons[0]);

    expect(screen.getByTestId('comment-input')).toBeInTheDocument();
  });

  it('changes sort order when SortBy button is clicked', () => {
    render(<CommentSection />);
    const sortButton = screen.getByTestId('sort-button');

    expect(sortButton).toHaveTextContent('Newest');
    fireEvent.click(sortButton);
    expect(sortButton).toHaveTextContent('Oldest');
  });
});