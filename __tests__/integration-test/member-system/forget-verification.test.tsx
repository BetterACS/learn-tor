import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import Resetpasswordpage from '@/app/forget/page';
import Verificationpage from '@/app/verification/page';
import { trpc } from '@/app/_trpc/client';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

const mockSession = {
  user: {
    id: 'user-123',
    name: "Test User",
    email: "test@example.com",
    image: null,
  },
  expires: new Date(Date.now() + 3600).toISOString(),
};

jest.mock('@/app/_trpc/client', () => {
  return {
    trpc: {
      resetVerificationToken: {
        useMutation: jest.fn() as jest.Mock<Partial<UseMutationResult>>,
      },
      verifiedMutation: {
        useMutation: jest.fn() as jest.Mock<Partial<UseMutationResult>>,
      },
      getJWT: {
        useMutation: jest.fn() as jest.Mock<Partial<UseMutationResult>>,
      },
      getUser: {
        useQuery: jest.fn() as jest.Mock<Partial<UseQueryResult>>,
      },
    },
  };
});

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams('?email=test@example.com'),
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <SessionProvider session={mockSession}>
      {component}
    </SessionProvider>
  );
};

describe('Password Reset Integration Test', () => {
  const trpcMock = trpc as jest.Mocked<typeof trpc>;

  beforeEach(() => {
    jest.clearAllMocks();

    (trpcMock.resetVerificationToken.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((input: any, { onSuccess }: any) => {
        onSuccess({ status: 200, data: { message: 'Success' } });
      }),
      isLoading: false,
    });

    (trpcMock.getUser.useQuery as jest.Mock).mockReturnValue({
      data: {
        _id: 'user-123',
        name: 'Test User',
        email: 'test@example.com'
      },
      isLoading: false,
    });
  });

  it('should submit email successfully', async () => {
    renderWithProviders(<Resetpasswordpage />);

    const emailInput = screen.getByPlaceholderText('Email Address / Username');
    const submitButton = screen.getByRole('button', { name: /Sent Verification Code/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(trpcMock.resetVerificationToken.useMutation).toHaveBeenCalled();
    });
  });

  it('should handle verification code submission', async () => {
    (trpcMock.verifiedMutation.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((input: any, { onSuccess }: any) => {
        onSuccess({ status: 200, data: { message: 'Verified' } });
      }),
      isLoading: false,
    });

    (trpcMock.getJWT.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((input: any, { onSuccess }: any) => {
        onSuccess({ status: 200, data: { token: 'valid-token' } });
      }),
      isLoading: false,
    });

    renderWithProviders(<Verificationpage />);

    const codeInput = screen.getByPlaceholderText('Verification Code');
    const verifyButton = screen.getByRole('button', { name: /Reset Password/i });

    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(trpcMock.verifiedMutation.useMutation).toHaveBeenCalled();
    });
  });
});