import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerificationBlock from '@/components/verifypassblock';
import { trpc } from '@/app/_trpc/client';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    verifiedMutation: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
      })),
    },
    resetVerificationToken: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
      })),
    },
    getJWT: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
      })),
    },
  },
}));

describe('VerificationBlock', () => {
  const mockPush = jest.fn();
  const mockMutate = jest.fn();
  const mockResetMutate = jest.fn();
  const mockTokenMutate = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('test@example.com'),
    });

    (trpc.verifiedMutation.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    });
    (trpc.resetVerificationToken.useMutation as jest.Mock).mockReturnValue({
      mutate: mockResetMutate,
    });
    (trpc.getJWT.useMutation as jest.Mock).mockReturnValue({
      mutate: mockTokenMutate,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with initial state', () => {
    render(<VerificationBlock />);
    expect(screen.getByPlaceholderText('Verification Code')).toBeInTheDocument();
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByText('Resend')).toBeInTheDocument();
  });

  it('shows error if verification code is not provided', async () => {
    render(<VerificationBlock />);
    fireEvent.click(screen.getByText('Reset Password'));
    await waitFor(() => {
      expect(screen.getByText('Verification code is required')).toBeInTheDocument();
    });
  });

  it('shows error if verification code is not 6 characters', async () => {
    render(<VerificationBlock />);
    const input = screen.getByPlaceholderText('Verification Code');
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(screen.getByText('Reset Password'));
    await waitFor(() => {
      expect(screen.getByText('Verification code must be 6 characters')).toBeInTheDocument();
    });
  });

  it('calls reset API when Resend button is clicked', async () => {
    render(<VerificationBlock />);
    fireEvent.click(screen.getByText('Resend'));
    await waitFor(() => {
      expect(mockResetMutate).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        expect.any(Object)
      );
    });
  });

  it('submits verification code and calls mutation', async () => {
    render(<VerificationBlock />);
    const input = screen.getByPlaceholderText('Verification Code');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Reset Password'));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: 'test@example.com', token: '123456' },
        expect.any(Object)
      );
    });
  });

  it('redirects to update-password on successful token generation', async () => {
    mockMutate.mockImplementation((_, { onSuccess }) => {
      onSuccess({ status: 200, data: { message: 'Verified' } });
    });
    mockTokenMutate.mockImplementation((_, { onSuccess }) => {
      onSuccess({ status: 200, data: { token: 'jwt-token' } });
    });

    render(<VerificationBlock />);
    const input = screen.getByPlaceholderText('Verification Code');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Reset Password'));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        '/update-password?email=test@example.com&token=jwt-token'
      );
    });
  });

  it('shows error on API failure during verification', async () => {
    mockMutate.mockImplementation((_, { onError }) => {
      onError(new Error('Verification Failed'));
    });

    render(<VerificationBlock />);
    const input = screen.getByPlaceholderText('Verification Code');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Reset Password'));
    await waitFor(() => {
      expect(screen.getByText('Verification Failed')).toBeInTheDocument();
    });
  });
});
