import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/login/page';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('@/components/Navbar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar-mock">Navbar</div>,
}));

jest.mock('@/components/Loginblock', () => {
  const { useRouter } = jest.requireMock('next/navigation');

  return {
    __esModule: true,
    default: ({
      needVerify,
      updated
    }: {
      needVerify?: boolean;
      updated?: boolean
    }) => {
      const router = useRouter();
      const [error, setError] = React.useState('');

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;

        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (result?.ok) {
          router.push('/home');
        } else {
          setError(result?.error || 'Login failed');
        }
      };

      return (
        <div data-testid="loginblock-mock">
          <div>Login Block Component</div>
          {needVerify && <div>Verify Alert</div>}
          {updated && <div>Password Updated</div>}
          {error && <div>{error}</div>}
          <form data-testid="login-form" onSubmit={handleSubmit}>
            <input
              name="email"
              placeholder="Email Address"
              data-testid="email-input"
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              data-testid="password-input"
            />
            <button type="submit">Log in</button>
          </form>
        </div>
      );
    },
  };
});

describe('Login Page Integration Test', () => {
  const mockPush = jest.fn();
  const mockSignIn = signIn as jest.Mock;

  beforeAll(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
  });

  beforeEach(() => {
    mockSignIn.mockReset();
    mockPush.mockReset();
  });

  it('renders all components correctly', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('loginblock-mock')).toBeInTheDocument();
  });

  it('handles login success', async () => {
    mockSignIn.mockResolvedValue({ ok: true });

    render(<LoginPage />);

    await userEvent.type(
      screen.getByTestId('email-input'),
      'test@example.com'
    );
    await userEvent.type(
      screen.getByTestId('password-input'),
      'password123'
    );
    await userEvent.click(screen.getByText('Log in'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  it('shows error on login failure', async () => {
    mockSignIn.mockResolvedValue({
      ok: false,
      error: 'Invalid credentials'
    });

    render(<LoginPage />);

    await userEvent.type(
      screen.getByTestId('email-input'),
      'wrong@example.com'
    );
    await userEvent.type(
      screen.getByTestId('password-input'),
      'wrongpass'
    );
    await userEvent.click(screen.getByText('Log in'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});