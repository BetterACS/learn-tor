import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '@/components/button';
describe('Button Component', () => {
  const buttonName = 'Click Me';
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default variant', () => {
    render(<Button button_name={buttonName} />);

    const buttonElement = screen.getByText(buttonName);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.closest('button')).toHaveClass(
      'bg-primary-600 text-monochrome-50 border-primary-600 hover:bg-primary-700 hover:border-primary-700'
    );
  });

  it('renders correctly with "secondary" variant', () => {
    render(<Button button_name={buttonName} variant="secondary" />);

    const buttonElement = screen.getByText(buttonName);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.closest('button')).toHaveClass(
      'text-primary-600 border-primary-600 hover:text-primary-700 hover:border-primary-700'
    );
  });

  it('renders correctly with "red" variant', () => {
    render(<Button button_name={buttonName} variant="red" />);

    const buttonElement = screen.getByText(buttonName);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.closest('button')).toHaveClass(
      'text-red-700 border-red-700 hover:text-monochrome-50 hover:bg-red-700'
    );
  });

  it('triggers the onClick event when clicked', () => {
    render(<Button button_name={buttonName} onClick={mockOnClick} />);

    const buttonElement = screen.getByText(buttonName);
    fireEvent.click(buttonElement);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('has the proper styling applied', () => {
    render(<Button button_name={buttonName} variant="primary" />);

    const buttonElement = screen.getByText(buttonName);
    expect(buttonElement.closest('button')).toHaveClass(
      'h-auto w-fit px-[1.3rem] py-[0.7rem] rounded-lg flex justify-center items-center text-nowrap border text-button transition-color duration-200'
    );
  });
});