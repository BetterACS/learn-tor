import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScoreInput from '@/components/ScoreInput';

describe('ScoreInput Component', () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    label: 'Score',
    value: '',
    onChange: mockOnChange,
    isEditing: true,
    name: 'score-input',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with label', () => {
    render(<ScoreInput {...defaultProps} />);
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('/100')).toBeInTheDocument();
  });

  it('focuses input when container is clicked', () => {
    render(<ScoreInput {...defaultProps} />);
    const container = screen.getByText('Score').parentElement;
    const input = screen.getByRole('textbox');

    expect(input).not.toHaveFocus();
    fireEvent.click(container!);
    expect(input).toHaveFocus();
  });

  it('calls onChange with valid input value', () => {
    render(<ScoreInput {...defaultProps} />);
    const input = screen.getByRole('textbox');

    // Simulate entering a valid score within range (e.g., "75")
    fireEvent.change(input, { target: { value: '75' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('does not call onChange for invalid numeric values (e.g., "-1" or "101")', () => {
    render(<ScoreInput {...defaultProps} />);
    const input = screen.getByRole('textbox');

    // Simulate entering an out-of-range value (-1)
    fireEvent.change(input, { target: { value: '-1' } });
    expect(mockOnChange).not.toHaveBeenCalled();

    // Simulate entering an out-of-range value (101)
    fireEvent.change(input, { target: { value: '101' } });
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('does not call onChange for non-numeric values (e.g., "abc")', () => {
    render(<ScoreInput {...defaultProps} />);
    const input = screen.getByRole('textbox');

    // Simulate entering a non-numeric value
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('disables input when isEditing is false', () => {
    render(<ScoreInput {...defaultProps} isEditing={false} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('border border-monochrome-300 bg-monochrome-100');
  });

  it('enables input with focus styles when isEditing is true', () => {
    render(<ScoreInput {...defaultProps} isEditing={true} />);
    const input = screen.getByRole('textbox');
    expect(input).not.toBeDisabled();
    expect(input).toHaveClass('focus:border-2 border-primary-600 focus:outline-none');
  });
});