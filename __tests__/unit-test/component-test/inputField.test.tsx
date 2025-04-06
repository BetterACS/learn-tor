import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputField from '@/components/InputField';

describe('InputField Component', () => {
  const defaultProps = {
    name: 'test-input',
    value: '',
    disabled: false,
    onChange: jest.fn(),
    label: 'Test Label',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with label', () => {
    render(<InputField {...defaultProps} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    render(<InputField {...defaultProps} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'new value' } });

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('displays the correct value in the input', () => {
    render(<InputField {...defaultProps} value="initial value" />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveValue('initial value');
  });

  it('disables the input when disabled prop is true', () => {
    render(<InputField {...defaultProps} disabled={true} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeDisabled();
    expect(inputElement).toHaveClass('bg-monochrome-100');
  });

  it('applies the correct classes when enabled', () => {
    render(<InputField {...defaultProps} disabled={false} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('bg-white');
    expect(inputElement).not.toBeDisabled();
  });
});