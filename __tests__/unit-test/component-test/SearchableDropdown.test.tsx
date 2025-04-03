import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchableDropdown from '@/components/SearchableDropdown';

describe('SearchableDropdown Component', () => {
  const mockOnChange = jest.fn();
  const options = ['Option 1', 'Option 2', 'Option 3', 'Test Value'];

  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    options: options,
    placeholder: 'Select an option',
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with placeholder', () => {
    render(<SearchableDropdown {...defaultProps} />);
    const input = screen.getByPlaceholderText('Select an option');
    expect(input).toBeInTheDocument();
  });

  it('opens dropdown and filters options based on search term', () => {
    render(<SearchableDropdown {...defaultProps} />);
    const input = screen.getByPlaceholderText('Select an option');

    // Simulate typing in the input field
    fireEvent.change(input, { target: { value: 'Option' } });
    const filteredOptions = screen.getAllByRole('listitem');
    expect(filteredOptions.length).toBe(3); // Expect options matching "Option" to render

    // Simulate further filtering
    fireEvent.change(input, { target: { value: 'Option 1' } });
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', () => {
    render(<SearchableDropdown {...defaultProps} />);
    const input = screen.getByPlaceholderText('Select an option');

    // Open dropdown and select an option
    fireEvent.click(input);
    const option = screen.getByText('Option 2');
    fireEvent.click(option);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('Option 2');
  });

  it('clears the search term and calls onChange when clear button is clicked', () => {
    render(<SearchableDropdown {...defaultProps} />);
    const input = screen.getByPlaceholderText('Select an option');

    // Type in the input field
    fireEvent.change(input, { target: { value: 'Test Value' } });
    const clearButton = screen.getByAltText('Clear');
    fireEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('');
    expect(input).toHaveValue('');
  });

  it('disables input when disabled prop is true', () => {
    render(<SearchableDropdown {...defaultProps} disabled={true} />);
    const input = screen.getByPlaceholderText('Select an option');

    expect(input).toBeDisabled();
    fireEvent.click(input);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); // Dropdown should not open
  });

  it('renders "ไม่พบข้อมูล" when no options match search term', () => {
    render(<SearchableDropdown {...defaultProps} />);
    const input = screen.getByPlaceholderText('Select an option');

    // Simulate typing an unmatched search term
    fireEvent.change(input, { target: { value: 'Unmatched' } });
    expect(screen.getByText('ไม่พบข้อมูล')).toBeInTheDocument();
  });
});