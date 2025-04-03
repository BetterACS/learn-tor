import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TestMutationComponent from '@/components/TestMutation';
import { trpc } from '@/app/_trpc/client';
import '@testing-library/jest-dom';

// Mock TRPC client และ alert
jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    testMutation: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        status: 'idle',
        error: null,
      })),
    },
  },
}));

// Mock alert และ console
global.alert = jest.fn();
console.log = jest.fn();
console.error = jest.fn();

describe('TestMutationComponent', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (trpc.testMutation.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      status: 'idle',
      error: null,
    });
  });

  it('should render input and button', () => {
    render(<TestMutationComponent />);

    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should update name state when input changes', () => {
    render(<TestMutationComponent />);

    const input = screen.getByPlaceholderText('Enter your name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'John Doe' } });

    expect(input.value).toBe('John Doe');
  });

  it('should call mutation.mutate when button is clicked', () => {
    render(<TestMutationComponent />);

    const input = screen.getByPlaceholderText('Enter your name');
    fireEvent.change(input, { target: { value: 'Test Name' } });

    const button = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(button);

    expect(mockMutate).toHaveBeenCalledWith(
      { name: 'Test Name' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('should show loading state when mutation is pending', () => {
    // Mock pending state
    (trpc.testMutation.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      status: 'pending',
      error: null,
    });

    render(<TestMutationComponent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('should show error message when mutation fails', () => {
    // Mock error state
    (trpc.testMutation.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      status: 'error',
      error: { message: 'Test error message' },
    });

    render(<TestMutationComponent />);

    expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
  });

  it('should not submit when input is empty', () => {
    render(<TestMutationComponent />);

    const button = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(button);

    expect(mockMutate).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('should disable button when input is empty', () => {
    render(<TestMutationComponent />);

    const input = screen.getByPlaceholderText('Enter your name');
    const button = screen.getByRole('button', { name: 'Submit' });

    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: 'Test' } });
    expect(button).not.toBeDisabled();

    fireEvent.change(input, { target: { value: '' } });
    expect(button).toBeDisabled();
  });

  it('should call onSuccess callback when mutation succeeds', async () => {
    const mockSuccessData = { message: 'Success!' };
    
    render(<TestMutationComponent />);
    
    const input = screen.getByPlaceholderText('Enter your name');
    fireEvent.change(input, { target: { value: 'Test Name' } });
    
    const button = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(button);
    
    // Simulate successful mutation
    const onSuccessHandler = mockMutate.mock.calls[0][1].onSuccess;
    onSuccessHandler(mockSuccessData);
    
    expect(console.log).toHaveBeenCalledWith("Mutation Successful:", mockSuccessData);
    expect(global.alert).toHaveBeenCalledWith('Success!');
  });

  it('should call onError callback when mutation fails', async () => {
    const mockError = new Error('Test error');
    
    render(<TestMutationComponent />);
    
    const input = screen.getByPlaceholderText('Enter your name');
    fireEvent.change(input, { target: { value: 'Test Name' } });
    
    const button = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(button);
    
    // Simulate failed mutation
    const onErrorHandler = mockMutate.mock.calls[0][1].onError;
    onErrorHandler(mockError);
    
    expect(console.error).toHaveBeenCalledWith("Mutation Failed:", mockError);
  });

});