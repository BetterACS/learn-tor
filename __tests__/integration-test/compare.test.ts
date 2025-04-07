import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '@/app/compare-courses/page';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import '@testing-library/jest-dom';

// Mock the trpc hooks
jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    searchUniversities: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isLoading: false,
        isError: false,
      })),
    },
  },
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

describe('Compare Feature Integration Test', () => {
  const mockUniversities = [
    {
      course_id: '1',
      institution: 'University A',
      faculty: 'Faculty of Science',
      program: 'Computer Science',
      logo: '/logo1.png',
      image: '/image1.jpg',
      info: {
        'ค่าใช้จ่าย': '100,000 THB',
        'อัตราการสำเร็จการศึกษา': '90%',
      },
      'รอบ 3 Admission': [
        {
          register: 1000,
          passed: 200,
          max_score: 95.5,
          min_score: 75.2,
          acceptance_rate: 20,
          enrollment_rate: 80,
          criterion: "Information about admission criteria",
        },
      ],
    },
    {
      course_id: '2',
      institution: 'University B',
      faculty: 'Faculty of Engineering',
      program: 'Data Science',
      logo: '/logo2.png',
      image: '/image2.jpg',
      info: {
        'ค่าใช้จ่าย': '120,000 THB',
        'อัตราการสำเร็จการศึกษา': '85%',
      },
      'รอบ 3 Admission': [
        {
          register: 800,
          passed: 160,
          max_score: 93.7,
          min_score: 78.4,
          acceptance_rate: 20,
          enrollment_rate: 75,
          criterion: "Information about admission criteria",
        },
      ],
    },
  ];

  beforeEach(() => {
    // Mock the searchUniversities mutation response
    (trpc.searchUniversities.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((params, options) => {
        if (params.course_id) {
          // For individual university fetch
          const university = mockUniversities.find(u => u.course_id === params.course_id);
          options.onSuccess({
            status: 200,
            data: { universities: university ? [university] : [] },
          });
        } else {
          // For initial search
          options.onSuccess({
            status: 200,
            data: { universities: mockUniversities },
            maxPage: 1,
          });
        }
      }),
      isLoading: false,
    });

    // Mock useSearchParams to return test data
    (require('next/navigation').useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(() => JSON.stringify(['1', '2'])),
    });
  });

  test('should render comparison page with selected universities', async () => {
    render(<Page />);
    
    // Wait for universities to load
    await waitFor(() => {
      expect(screen.getByText('University A')).toBeInTheDocument();
      expect(screen.getByText('University B')).toBeInTheDocument();
    });
  });

  test('should display comparison criteria options', async () => {
    render(<Page />);
    
    await waitFor(() => {
      expect(screen.getByText('What do you need to compare?')).toBeInTheDocument();
      expect(screen.getByLabelText('ค่าใช้จ่ายตลอดทั้งหลักสูตร')).toBeInTheDocument();
      expect(screen.getByLabelText('อัตราการสำเร็จการศึกษา')).toBeInTheDocument();
      expect(screen.getByLabelText('รอบ 3 Admission')).toBeInTheDocument();
      expect(screen.getByLabelText('All')).toBeInTheDocument();
    });
  });

  test('should show comparison results when criteria are selected and compare button is clicked', async () => {
    render(<Page />);
    
    // Wait for universities to load
    await waitFor(() => {
      expect(screen.getByText('University A')).toBeInTheDocument();
    });

    // Select comparison criteria
    fireEvent.click(screen.getByLabelText('ค่าใช้จ่ายตลอดทั้งหลักสูตร'));
    fireEvent.click(screen.getByLabelText('รอบ 3 Admission'));

    // Click compare button
    fireEvent.click(screen.getByText('Compare'));

    // Verify comparison results are shown
    await waitFor(() => {
      expect(screen.getByText('ค่าใช้จ่ายตลอดทั้งหลักสูตร')).toBeInTheDocument();
      expect(screen.getByText('100,000 THB')).toBeInTheDocument();
      expect(screen.getByText('120,000 THB')).toBeInTheDocument();
      expect(screen.getByText('รอบ 3 Admission')).toBeInTheDocument();
    });
  });

  test('should highlight max, min, and median values in comparison results', async () => {
    render(<Page />);
    
    // Wait for universities to load
    await waitFor(() => {
      expect(screen.getByText('University A')).toBeInTheDocument();
    });

    // Select comparison criteria and compare
    fireEvent.click(screen.getByLabelText('รอบ 3 Admission'));
    fireEvent.click(screen.getByText('Compare'));

    // Verify values are highlighted
    await waitFor(() => {
      // University A has higher max score (95.5 vs 93.7)
      const maxScoreA = screen.getByText('95.5');
      expect(maxScoreA).toHaveStyle('color: green');

      // University B has higher min score (78.4 vs 75.2)
      const minScoreB = screen.getByText('78.4');
      expect(minScoreB).toHaveStyle('color: green');
    });
  });

  test('should show error message when no criteria are selected', async () => {
    render(<Page />);
    
    // Wait for universities to load
    await waitFor(() => {
      expect(screen.getByText('University A')).toBeInTheDocument();
    });

    // Click compare button without selecting criteria
    fireEvent.click(screen.getByText('Compare'));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText('Please select the topic you want to compare.')).toBeInTheDocument();
    });
  });

  test('should allow navigating between different admission round data', async () => {
    // Add multiple round 3 data for University A
    const universitiesWithMultipleRounds = [...mockUniversities];
    universitiesWithMultipleRounds[0]['รอบ 3 Admission'].push({
      register: 1200,
      passed: 240,
      max_score: 96.0,
      min_score: 76.0,
      acceptance_rate: 20,
      enrollment_rate: 85,
      criterion: "Additional admission criteria",
    });

    (trpc.searchUniversities.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((params, options) => {
        const university = universitiesWithMultipleRounds.find(u => u.course_id === params.course_id);
        options.onSuccess({
          status: 200,
          data: { universities: university ? [university] : [] },
        });
      }),
      isLoading: false,
    });

    render(<Page />);
    
    // Wait for universities to load and compare
    await waitFor(() => {
      expect(screen.getByText('University A')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText('รอบ 3 Admission'));
    fireEvent.click(screen.getByText('Compare'));

    // Find and click the "Next" button
    const nextButton = await screen.findByText('ถัดไป');
    fireEvent.click(nextButton);

    // Verify the data changed
    await waitFor(() => {
      expect(screen.getByText('96.0')).toBeInTheDocument();
    });
  });
});