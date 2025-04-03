import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerificationBlock from '@/components/verifypassblock';
import { trpc } from '@/app/_trpc/client';
import { useSearchParams, useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock TRPC client
jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    verifiedMutation: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isLoading: false,
        isError: false,
      })),
    },
    resetVerificationToken: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isLoading: false,
        isError: false,
      })),
    },
    getJWT: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isLoading: false,
        isError: false,
      })),
    },
  },
}));

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn().mockReturnValue('test@example.com'),
  })),
}));

// Mock AlertBox component
jest.mock('@/components/index', () => ({
  AlertBox: jest.fn(({ alertType, title, message }) => (
    <div data-testid="alert-box">
      {title}: {message} ({alertType})
    </div>
  )),
}));

describe('VerificationBlock Component', () => {
  const mockVerifiedMutate = jest.fn();
  const mockResetMutate = jest.fn();
  const mockTokenMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (trpc.verifiedMutation.useMutation as jest.Mock).mockReturnValue({
      mutate: mockVerifiedMutate,
      isLoading: false,
      isError: false,
    });
    
    (trpc.resetVerificationToken.useMutation as jest.Mock).mockReturnValue({
      mutate: mockResetMutate,
      isLoading: false,
      isError: false,
    });
    
    (trpc.getJWT.useMutation as jest.Mock).mockReturnValue({
      mutate: mockTokenMutate,
      isLoading: false,
      isError: false,
    });
  });

  it('should render the verification form', () => {
    render(<VerificationBlock />);
    
    expect(screen.getByText('Verification')).toBeInTheDocument();
    expect(screen.getByText('Enter your verification code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Verification Code')).toBeInTheDocument();
    expect(screen.getByText('Resend')).toBeInTheDocument();
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
  });

  it('should show error when email is missing', () => {
    (useSearchParams as jest.Mock).mockReturnValueOnce({
      get: jest.fn().mockReturnValue(''),
    });
    
    render(<VerificationBlock />);
    
    const submitButton = screen.getByText('Reset Password');
    fireEvent.click(submitButton);
    
    expect(mockPush).toHaveBeenCalledWith('forget');
  });

  it('should show error when verification code is invalid', () => {
    render(<VerificationBlock />);
    
    const input = screen.getByPlaceholderText('Verification Code');
    const submitButton = screen.getByText('Reset Password');
    
    // Test empty code
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(submitButton);
    expect(screen.getByTestId('alert-box')).toHaveTextContent('Error: Verification code is required (error)');
    
    // Test code with less than 6 digits
    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.click(submitButton);
    expect(screen.getByTestId('alert-box')).toHaveTextContent('Error: Verification code must be 6 characters (error)');
  });

  it('should only accept numeric input for verification code', () => {
    render(<VerificationBlock />);
    
    const input = screen.getByPlaceholderText('Verification Code') as HTMLInputElement;
    
    // Try to enter non-numeric characters
    fireEvent.change(input, { target: { value: 'abc123' } });
    expect(input.value).toBe(''); // Should reject non-numeric input
    
    // Enter numeric characters
    fireEvent.change(input, { target: { value: '123456' } });
    expect(input.value).toBe('123456');
  });

  it('should call resend function when resend button is clicked', async () => {
    mockResetMutate.mockImplementationOnce(({ email }, { onSuccess }) => {
      onSuccess({ status: 200, data: { message: 'Code resent' } });
    });
    
    render(<VerificationBlock />);
    
    const resendButton = screen.getByText('Resend');
    fireEvent.click(resendButton);
    
    await waitFor(() => {
      expect(mockResetMutate).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
      expect(screen.getByTestId('alert-box')).toHaveTextContent('Info: Verification code has been resent (info)');
    });
  });

  it('should submit verification code and redirect on success', async () => {
    mockVerifiedMutate.mockImplementationOnce(({ email, token }, { onSuccess }) => {
      onSuccess({ status: 200, data: { message: 'Verified' } });
    });
    
    mockTokenMutate.mockImplementationOnce(({ email }, { onSuccess }) => {
      onSuccess({ status: 200, data: { token: 'test-token' } });
    });
    
    render(<VerificationBlock />);
    
    const input = screen.getByPlaceholderText('Verification Code');
    const submitButton = screen.getByText('Reset Password');
    
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockVerifiedMutate).toHaveBeenCalledWith(
        { email: 'test@example.com', token: '123456' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
      
      expect(mockTokenMutate).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
      
      expect(mockPush).toHaveBeenCalledWith(
        '/update-password?email=test@example.com&token=test-token'
      );
    });
  });

  it('should show error when verification fails', async () => {
    mockVerifiedMutate.mockImplementationOnce(({ email, token }, { onError }) => {
      onError(new Error('Invalid code'));
    });
    
    render(<VerificationBlock />);
    
    const input = screen.getByPlaceholderText('Verification Code');
    const submitButton = screen.getByText('Reset Password');
    
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('alert-box')).toHaveTextContent('Error: Invalid code (error)');
    });
  });
});