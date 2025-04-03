import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import Updatepasspage from '@/app/update-password/page';
import { trpc } from '@/app/_trpc/client';
import { UseMutationResult } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

const mockSession = {
  user: {
    id: 'user-123',
    name: "Test User",
    email: "test@example.com",
    image: null,
  },
  expires: new Date(Date.now() + 3600).toISOString(),
};

const mockMutate = jest.fn();
jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    editUser: {
      useMutation: jest.fn(() => ({
        mutate: mockMutate,
        isLoading: false,
        isError: false,
      })),
    },
  },
}));

const mockPush = jest.fn();
const mockGet = jest.fn().mockReturnValue('test@example.com');

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
  useSearchParams: jest.fn(() => ({
    get: mockGet,
  })),
}));

jest.mock('@/components/navbar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">Navbar Mock</div>,
}));

jest.mock('@/components/alert-box', () => ({
  __esModule: true,
  default: ({ alertType, title, message }: any) => (
    <div data-testid="alert-box">
      {title}: {message} ({alertType})
    </div>
  ),
}));

describe('Update Password Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue('test@example.com');
    mockMutate.mockImplementation(({ updates }, { onSuccess, onError }) => {
      if (updates.password === 'matching-password') {
        onSuccess({ status: 200, data: { message: 'Success' } });
      } else {
        onError(new Error('Update failed'));
      }
    });
  });

  const renderWithProviders = () => {
    return render(
      <SessionProvider session={mockSession}>
        <Updatepasspage />
      </SessionProvider>
    );
  };

  it('should render the update password form', () => {
    renderWithProviders();

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update Password' })).toBeInTheDocument();
  });

  it('should show error when passwords do not match', async () => {
    renderWithProviders();

    fireEvent.change(screen.getByPlaceholderText('New Password'), {
      target: { name: 'password', value: 'password1' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { name: 'confirmPassword', value: 'password2' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update Password' }));

    await waitFor(() => {
      expect(screen.getByTestId('alert-box')).toBeInTheDocument();
      expect(screen.getByTestId('alert-box')).toHaveTextContent('Error: Passwords do not match');
    });
  });

  it('should successfully submit matching passwords and redirect', async () => {
    renderWithProviders();

    fireEvent.change(screen.getByPlaceholderText('New Password'), {
      target: { name: 'password', value: 'matching-password' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { name: 'confirmPassword', value: 'matching-password' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update Password' }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          updates: { password: 'matching-password' }
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function)
        })
      );
      expect(mockPush).toHaveBeenCalledWith('/login?updated=true');
    });
  });

  it('should show error when API update fails', async () => {
    renderWithProviders();

    fireEvent.change(screen.getByPlaceholderText('New Password'), {
      target: { name: 'password', value: 'failing-password' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { name: 'confirmPassword', value: 'failing-password' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update Password' }));

    await waitFor(() => {
      expect(screen.getByTestId('alert-box')).toBeInTheDocument();
      expect(screen.getByTestId('alert-box')).toHaveTextContent('Error: Update failed');
    });
  });
});