import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Loginblock } from '@/components/index';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';

// Mock next-auth and navigation
jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('LoginBlock Component', () => {
  const mockPush = jest.fn();
  const mockSignIn = signIn as jest.Mock;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    mockSignIn.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<Loginblock />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    render(<Loginblock />);
    const passwordInput = screen.getByPlaceholderText('Password');

    // Get all buttons and find the one that's not the submit button
    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons.find(button =>
      button !== screen.getByText('Log in')
    );

    if (!toggleButton) {
      throw new Error('Toggle button not found');
    }

    expect(passwordInput).toHaveAttribute('type', 'password');
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows error when login fails', async () => {
    mockSignIn.mockResolvedValue({ ok: false, error: 'Invalid credentials' });
    render(<Loginblock />);

    await userEvent.type(screen.getByPlaceholderText('Email Address'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrongpass');
    await userEvent.click(screen.getByText('Log in'));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('redirects on successful login', async () => {
    render(<Loginblock />);

    await userEvent.type(screen.getByPlaceholderText('Email Address'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'correctpass');
    await userEvent.click(screen.getByText('Log in'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  it('shows forgot password link that redirects to /forget', () => {
    render(<Loginblock />);
    const forgotLink = screen.getByText('Forgot Password?');
    expect(forgotLink).toHaveAttribute('href', '/forget');
  });

  it('shows sign up link that redirects to /register', () => {
    render(<Loginblock />);
    const signUpLink = screen.getByText('Sign up');
    expect(signUpLink).toHaveAttribute('href', '/register');
  });
});