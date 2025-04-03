import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Page from '@/app/home/page';
import { useSession } from 'next-auth/react';

// Mock IntersectionObserver
beforeAll(() => {
  class MockIntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });
});

// Mock dependencies
jest.mock('next-auth/react');

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('@/components/index', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
  Footer: () => <div data-testid="footer">Footer</div>,
  UniLogo: () => <div data-testid="unilogo">UniLogo</div>,
  FeatureSection: ({ title }: { title: string }) => (
    <div data-testid="feature-section">{title}</div>
  ),
}));

// Mock window resize event
beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    value: 1024,
  });
});

describe('Home Page Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all main sections', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Page />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText(/ยินดีต้อนรับเข้าสู่ LearnTor/i)).toBeInTheDocument();
    expect(screen.getByText(/Learntor มีฟีเจอร์อะไรเพื่อน้องๆบ้าง!!/i)).toBeInTheDocument();
    expect(screen.getByText(/พวกเรามีข้อมูลมหาวิทยาลัยชื่อดังทั่วประเทศไทย/i)).toBeInTheDocument();
    expect(screen.getByText(/มาดูกันซิว่าเรามีคณะอะไรกันบ้าง!!/i)).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('displays login/signup buttons when not authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Page />);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('does not display login/signup buttons when authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } }
    });
    render(<Page />);

    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign Up/i)).not.toBeInTheDocument();
  });

  test('renders all feature sections correctly', () => {
    render(<Page />);

    expect(screen.getByText(/Compare Courses/i)).toBeInTheDocument();
    expect(screen.getByText(/Chatbot/i)).toBeInTheDocument();
    expect(screen.getByText(/TCAS Calculate/i)).toBeInTheDocument();
    expect(screen.getByText(/Forum/i)).toBeInTheDocument();
  });

  test('renders university logos section', () => {
    render(<Page />);

    expect(screen.getByTestId('unilogo')).toBeInTheDocument();
  });

  test('renders faculty cards section', () => {
    render(<Page />);

    expect(screen.getByText(/วิศวกรรมศาสตร์/i)).toBeInTheDocument();
    expect(screen.getByText(/แพทยศาสตร์/i)).toBeInTheDocument();
    expect(screen.getByText(/บริหารธุรกิจ/i)).toBeInTheDocument();
  });

  test('adapts to mobile view', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 500,
    });
    window.dispatchEvent(new Event('resize'));

    render(<Page />);

    expect(screen.getByText(/วิศวกรรมศาสตร์/i)).toBeInTheDocument();
  });

  describe('Button Navigation', () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({ data: null });
    });

    test('Login button has correct href', () => {
      render(<Page />);
      const loginButton = screen.getByText(/Login/i).closest('a');
      expect(loginButton).toHaveAttribute('href', '/login');
    });

    test('Sign Up button has correct href', () => {
      render(<Page />);
      const signUpButton = screen.getByText(/Sign Up/i).closest('a');
      expect(signUpButton).toHaveAttribute('href', '/register');
    });
  });
});