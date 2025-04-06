import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Registerblock } from '@/components/index';
import Registerpage from '@/app/register/page';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    register: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isLoading: false,
        isError: false,
        error: null,
        data: null,
      })),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('@/components/navbar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar-mock">Navbar Mock</div>,
}));

jest.mock('@/components/alert-box', () => ({
  __esModule: true,
  default: ({ alertType, title, message }: any) => (
    <div data-testid="alert-box" data-alert-type={alertType}>
      {title}: {message}
    </div>
  ),
}));

const mockWindowLocation = {
    href: '',
    assign: jest.fn(),
    replace: jest.fn(),
  };
  Object.defineProperty(window, 'location', {
    value: mockWindowLocation,
    writable: true,
  });

  describe('Registerblock Component', () => {
    let mockMutate: jest.Mock;

    beforeEach(() => {
      mockMutate = jest.fn();
      window.location.href = '';

      (trpc.register.useMutation as jest.Mock).mockReturnValue({
        mutate: mockMutate,
        isLoading: false,
        isError: false,
        error: null,
      });
    });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders the registration form with all required fields', () => {
    render(<Registerblock />);

    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create an account' })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
  });

  it('toggles password visibility for both password fields', async () => {
    render(<Registerblock />);

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

    // Find toggle buttons by their position (next to password inputs)
    const passwordContainer = passwordInput.parentElement;
    const confirmPasswordContainer = confirmPasswordInput.parentElement;

    const passwordToggle = passwordContainer?.querySelector('button');
    const confirmPasswordToggle = confirmPasswordContainer?.querySelector('button');

    // Initial state - passwords should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Toggle password visibility
    if (passwordToggle) {
      await userEvent.click(passwordToggle);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    }

    // Toggle confirm password visibility
    if (confirmPasswordToggle) {
      await userEvent.click(confirmPasswordToggle);
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    }
  });

  it('persists username and email in localStorage', async () => {
    render(<Registerblock />);

    const username = 'testuser';
    const email = 'test@example.com';

    await userEvent.type(screen.getByPlaceholderText('Username'), username);
    await userEvent.type(screen.getByPlaceholderText('Email Address'), email);

    await waitFor(() => {
      const storedValues = JSON.parse(localStorage.getItem('formValues') || '{}');
      expect(storedValues.username).toBe(username);
      expect(storedValues.email).toBe(email);
    });
  });

  it('pre-fills form from localStorage on mount', async () => {
    const savedData = {
      username: 'saveduser',
      email: 'saved@example.com'
    };
    localStorage.setItem('formValues', JSON.stringify(savedData));

    render(<Registerblock />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toHaveValue(savedData.username);
      expect(screen.getByPlaceholderText('Email Address')).toHaveValue(savedData.email);
    });
  });

  it('shows error when passwords do not match', async () => {
    render(<Registerblock />);

    await userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
    await userEvent.type(screen.getByPlaceholderText('Email Address'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.type(screen.getByPlaceholderText('Confirm Password'), 'different123');

    await userEvent.click(screen.getByRole('button', { name: 'Create an account' }));

    await waitFor(() => {
      expect(screen.getByTestId('alert-box')).toHaveTextContent('Error: Passwords do not match');
      expect(screen.getByPlaceholderText('Password')).toHaveValue('');
      expect(screen.getByPlaceholderText('Confirm Password')).toHaveValue('');
    });
  });

  it('validates email format before submission', async () => {
    render(<Registerblock />);
    const emailInput = screen.getByPlaceholderText('Email Address') as HTMLInputElement;

    // Test invalid email
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);

    // Check HTML5 validation
    expect(emailInput.validity.valid).toBe(false);
    expect(emailInput.validationMessage).not.toBe('');

    // Test valid email
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'valid@example.com');
    fireEvent.blur(emailInput);

    expect(emailInput.validity.valid).toBe(true);
    expect(emailInput.validationMessage).toBe('');
  });

  it('submits form successfully and redirects', async () => {
    // Setup mock success response
    mockMutate.mockImplementation((values, options) => {
      options.onSuccess({
        status: 200,
        data: { message: 'User created successfully' }
      });
    });

    render(<Registerblock />);

    // Fill out form
    await userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
    await userEvent.type(screen.getByPlaceholderText('Email Address'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.type(screen.getByPlaceholderText('Confirm Password'), 'password123');

    // Submit form
    await userEvent.click(screen.getByRole('button', { name: 'Create an account' }));

    // Verify submission
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }, expect.any(Object));
    });

    // Verify redirect
    expect(window.location.href).toBe('/login?need-verify=true');
  });

  it('handles registration errors properly', async () => {
    const testCases = [
      { error: new Error('Email already exists'), expectedMessage: 'Email already exists' },
    ];

    for (const testCase of testCases) {
      // Setup mock error response
      mockMutate.mockImplementationOnce((values, options) => {
        options.onError(testCase.error);
      });

      render(<Registerblock />);

      // Fill out form
      await userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
      await userEvent.type(screen.getByPlaceholderText('Email Address'), 'test@example.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
      await userEvent.type(screen.getByPlaceholderText('Confirm Password'), 'password123');

      // Submit form
      await userEvent.click(screen.getByRole('button', { name: 'Create an account' }));

      // Verify error message
      await waitFor(() => {
        expect(screen.getByTestId('alert-box')).toHaveTextContent(`Error: ${testCase.expectedMessage}`);
      });

      // Cleanup before next test case
      cleanup();
    }
  });
});

describe('RegisterPage Component', () => {
  it('renders with proper layout and styling', () => {
    render(<Registerpage />);

    // Verify navbar is rendered
    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();

    // Verify page container
    const pageContainer = screen.getByRole('main');
    expect(pageContainer).toBeInTheDocument();
    expect(pageContainer).toHaveClass('bg-regis-image');
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('contains a working login link', () => {
    render(<Registerpage />);

    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});