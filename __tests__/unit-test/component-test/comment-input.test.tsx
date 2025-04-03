import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentInput from '@/components/comment-input';
import { trpc } from '@/app/_trpc/client';

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    createComment: {
      useMutation: jest.fn(),
    },
    useContext: jest.fn(() => ({
      getAllComments: {
        invalidate: jest.fn(),
      },
    })),
  },
}));

describe('CommentInput Component', () => {
  const defaultProps = {
    topic_id: 'test_topic',
    parent_id: null,
    isCommentClicked: false,
    setIsCommentClicked: jest.fn(),
    userEmail: 'test@example.com',
  };

  const mockMutate = jest.fn();
  const mockInvalidate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (trpc.createComment.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });
    (trpc.useContext as jest.Mock).mockReturnValue({
      getAllComments: { invalidate: mockInvalidate },
    });
  });

  it('renders correctly with placeholder', () => {
    render(<CommentInput {...defaultProps} />);
    const textarea = screen.getByPlaceholderText('Add a comment');
    expect(textarea).toBeInTheDocument();
  });

  it('expands the textarea when clicked', () => {
    render(<CommentInput {...defaultProps} />);
    const container = screen.getByRole('textbox').parentElement;

    fireEvent.click(container!);

    const expandedTextarea = screen.getByRole('textbox');
    expect(expandedTextarea).toHaveAttribute('rows', '3');

    const cancelButton = screen.getByText('Cancel');
    const commentButton = screen.getByText('Comment');
    expect(cancelButton).toBeInTheDocument();
    expect(commentButton).toBeInTheDocument();
  });

  it('calls setIsCommentClicked when expanded and canceled', () => {
    render(<CommentInput {...defaultProps} isCommentClicked={true} />);
    const cancelButton = screen.getByText('Cancel');

    fireEvent.click(cancelButton);
    expect(defaultProps.setIsCommentClicked).toHaveBeenCalledTimes(1);
    expect(defaultProps.setIsCommentClicked).toHaveBeenCalledWith(false);
  });

  it('submits a comment and calls mutation', async () => {
    render(<CommentInput {...defaultProps} />);
    const container = screen.getByRole('textbox').parentElement;
    fireEvent.click(container!);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test comment' } });

    const submitButton = screen.getByText('Comment');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith({
        topic_id: 'test_topic',
        email: 'test@example.com',
        comment: 'Test comment',
        parent_id: undefined,
      });
    });
  });

  it('does not submit an empty comment', () => {
    render(<CommentInput {...defaultProps} />);
    const container = screen.getByRole('textbox').parentElement;
    fireEvent.click(container!);

    const submitButton = screen.getByText('Comment');
    fireEvent.click(submitButton);

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('resets the comment input when canceled', () => {
    render(<CommentInput {...defaultProps} isCommentClicked={true} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test comment' } });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(textarea).toHaveValue('');
  });
});