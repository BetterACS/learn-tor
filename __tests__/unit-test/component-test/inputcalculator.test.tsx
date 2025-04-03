import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Inputcalculator from '@/components/inputcalculator';

describe('Inputcalculator Component', () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    label: 'Score Input',
    value: '',
    onChange: mockOnChange,
    name: 'score-input',
  };
 
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with label and placeholder', () => {
    render(<Inputcalculator {...defaultProps} />);
    const label = screen.getByText('Score Input');
    const input = screen.getByPlaceholderText('-');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('calls onChange with valid numeric input within the range', () => {
    render(<Inputcalculator {...defaultProps} />);
    const input = screen.getByPlaceholderText('-');

    // Simulate entering a valid score
    fireEvent.change(input, { target: { value: '75' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('does not call onChange for input outside valid range', () => {
    render(<Inputcalculator {...defaultProps} />);
    const input = screen.getByPlaceholderText('-');

    // Enter an out-of-range value
    fireEvent.change(input, { target: { value: '150' } });
    expect(mockOnChange).not.toHaveBeenCalled();

    // Enter a negative value
    fireEvent.change(input, { target: { value: '-10' } });
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('does not call onChange for non-numeric input', () => {
    render(<Inputcalculator {...defaultProps} />);
    const input = screen.getByPlaceholderText('-');

    // Simulate entering a non-numeric value
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('focuses on the input when the container is clicked', () => {
    render(<Inputcalculator {...defaultProps} />);
    const container = screen.getByText('Score Input').parentElement;
    const input = screen.getByPlaceholderText('-');

    expect(input).not.toHaveFocus();
    fireEvent.click(container!);
    expect(input).toHaveFocus();
  });
});