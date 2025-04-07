import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetBlock from '@/components/resetpasswordblock';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
const mockRouterPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

// Mock trpc
jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    resetVerificationToken: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
      })),
    },
  },
}));
const mockMutate = jest.fn();
(trpc.resetVerificationToken.useMutation as jest.Mock).mockReturnValue({
  mutate: mockMutate,
});

describe('ResetBlock Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders ResetBlock component correctly', () => {
    render(<ResetBlock />);
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address / Username')).toBeInTheDocument();
    expect(screen.getByText('Sent Verification Code')).toBeInTheDocument();
  });

  it('handles input value changes', () => {
    render(<ResetBlock />);
    const input = screen.getByPlaceholderText('Email Address / Username');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input).toHaveValue('test@example.com');
  });

  it('handles form submission and calls mutation', async () => {
    render(<ResetBlock />);
    const input = screen.getByPlaceholderText('Email Address / Username');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    const button = screen.getByText('Sent Verification Code');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        expect.any(Object)
      );
    });
  });

  it('displays error message on mutation failure', async () => {
    mockMutate.mockImplementation((_data, options) => {
      options.onError({ message: 'Test Error Message' });
    });

    render(<ResetBlock />);
    const button = screen.getByText('Sent Verification Code');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Test Error Message')).toBeInTheDocument();
    });
  });

  it('redirects to verification page on mutation success', async () => {
    mockMutate.mockImplementation((_data, options) => {
      options.onSuccess({ status: 200, data: { message: 'Success' } });
    });

    render(<ResetBlock />);
    const input = screen.getByPlaceholderText('Email Address / Username');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    const button = screen.getByText('Sent Verification Code');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/verification?email=test@example.com');
    });
  });
  it('logs warning and sets error message on verification error', async () => {
    const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const mockErrorMessage = 'Test Verification Error';

    mockMutate.mockImplementation((_data, options) => {
      options.onSuccess({ status: 400, data: { message: mockErrorMessage } });
    });

    render(<ResetBlock />);
    const input = screen.getByPlaceholderText('Email Address / Username');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    const button = screen.getByText('Sent Verification Code');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockConsoleWarn).toHaveBeenCalledWith('verification Error:', mockErrorMessage);
      expect(screen.getByText(mockErrorMessage)).toBeInTheDocument();
    });
    mockConsoleWarn.mockRestore();
  });
});