import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Updatepassblock } from '@/components/index';
import { trpc } from '@/app/_trpc/client';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock dependencies
jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    editUser: {
      useMutation: jest.fn(),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('UpdateBlock Component', () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };
  const mockMutate = jest.fn();
  let consoleWarnMock: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console.warn
    consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('email=test@example.com'));
    
    (trpc.editUser.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });
  });

  afterEach(() => {
    // Restore console.warn after each test
    consoleWarnMock.mockRestore();
  });

  it('renders update password form correctly', () => {
    render(<Updatepassblock />);

    expect(screen.getByText(/update password/i, { selector: 'div.text-headline-3' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    render(<Updatepassblock />);

    await userEvent.type(screen.getByPlaceholderText(/new password/i), 'password123');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'different123');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('shows error when email is missing', async () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    render(<Updatepassblock />);

    await userEvent.type(screen.getByPlaceholderText(/new password/i), 'password123');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(mockRouter.push).toHaveBeenCalledWith('forget');
    });
  });

  it('submits form and redirects on success', async () => {
    mockMutate.mockImplementation((_data, { onSuccess }) => {
      onSuccess({ status: 200, data: { message: 'Success' } });
    });

    render(<Updatepassblock />);

    await userEvent.type(screen.getByPlaceholderText(/new password/i), 'newpassword123');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'newpassword123');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          updates: { password: 'newpassword123' },
        },
        expect.any(Object)
      );
      expect(mockRouter.push).toHaveBeenCalledWith('/login?updated=true');
    });
  });

  it('shows error on mutation failure', async () => {
    mockMutate.mockImplementation((_data, { onError }) => {
      onError(new Error('Mutation failed'));
    });

    render(<Updatepassblock />);

    await userEvent.type(screen.getByPlaceholderText(/new password/i), 'newpassword123');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'newpassword123');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText(/mutation failed/i)).toBeInTheDocument();
    });
  });

  it('shows verification error message from API response', async () => {
    const errorMessage = 'Password must contain special characters';

    mockMutate.mockImplementation((_data, { onSuccess }) => {
      onSuccess({
        status: 400,
        data: {
          message: errorMessage,
          statusCode: 400
        }
      });
    });

    render(<Updatepassblock />);

    await userEvent.type(screen.getByPlaceholderText(/new password/i), 'newpassword123');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'newpassword123');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(console.warn).toHaveBeenCalledWith('verification Error:', errorMessage);
    });
  });
});