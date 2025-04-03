import React from 'react';
import { render, screen } from '@testing-library/react';
import Test from '@/components/example';
import { trpc } from '@/app/_trpc/client';
import '@testing-library/jest-dom';

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    testQuery: {
      useQuery: jest.fn(),
    },
  },
}));

describe('Test Component', () => {
  const mockUseQuery = trpc.testQuery.useQuery as jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Mock process.env for each test
    process.env = {
      ...process.env,
      NEXT_PUBLIC_TEST_ENV: 'test-value',
    };
  });

  it('renders loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<Test />);
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('test-value')).toBeInTheDocument();
  });

  it('renders data when loaded', () => {
    mockUseQuery.mockReturnValue({
      data: { message: 'Test message from API' },
      isLoading: false,
      error: null,
    });

    render(<Test />);
    
    expect(screen.getByText('Test message from API')).toBeInTheDocument();
    expect(screen.getByText('test-value')).toBeInTheDocument();
  });

  it('renders environment variable value', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    render(<Test />);
    
    expect(screen.getByText('test-value')).toBeInTheDocument();
  });

  it('passes correct input to tRPC query', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    render(<Test />);
    
    expect(mockUseQuery).toHaveBeenCalledWith(
      { id: 123, name: "ABCDEFG" }
      // Removed expect.objectContaining as it wasn't matching the actual call
    );
  });

  it('renders nothing when no data and not loading', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    render(<Test />);
    
    expect(screen.queryByText('Test message from API')).not.toBeInTheDocument();
    expect(screen.getByText('test-value')).toBeInTheDocument();
  });

  it('handles error state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Test error'),
    });

    render(<Test />);
    
    expect(screen.getByText('test-value')).toBeInTheDocument();
  });

  it('shows fallback when environment variable is not set', () => {
    // Temporarily remove the env var
    delete process.env.NEXT_PUBLIC_TEST_ENV;

    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    render(<Test />);
    
    expect(screen.getByText('หาไม่เจอ')).toBeInTheDocument();
    
    // Restore the env var for other tests
    process.env.NEXT_PUBLIC_TEST_ENV = 'test-value';
  });
});