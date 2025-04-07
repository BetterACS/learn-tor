import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';
import Calculator1 from '@/app/tcascalculator/1/page';
import Calculator2 from '@/app/tcascalculator/2/page';
import Calculator3 from '@/app/tcascalculator/3/page';
import '@testing-library/jest-dom';

// Mock the router and trpc client
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    getFilteredUniversities: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isLoading: false,
      })),
    },
  },
}));

describe('Calculator Integration Tests', () => {
  const mockOptions = {
    unique_universities: ['Chulalongkorn University', 'Thammasat University'],
    unique_faculties: ['Engineering', 'Science'],
    unique_campuses: ['Main Campus', 'Satellite Campus'],
    unique_programs: ['Computer Science', 'Data Science'],
    unique_course_types: ['Thai', 'International'],
    unique_admissionTypes: ['Portfolio', 'Admission'],
  };

  beforeEach(() => {
    // Mock the API response
    (trpc.getFilteredUniversities.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((params, options) => {
        options.onSuccess({
          data: mockOptions,
        });
      }),
      isLoading: false,
    });
  });

  describe('Step 1: Target Selection', () => {
    test('renders step 1 correctly', async () => {
      render(<Calculator1 />);
      
      expect(screen.getByText('เลือกเป้าหมาย')).toBeInTheDocument();
      expect(screen.getByText('คำนวณโอกาสสอบติดจากเป้าหมายที่เลือก')).toBeInTheDocument();
    });

    test('allows adding and removing targets', async () => {
      render(<Calculator1 />);
      
      // Add a target
      fireEvent.click(screen.getByText('+ เพิ่มเป้าหมายที่ต้องการเลือก'));
      expect(screen.getAllByText('มหาวิทยาลัย').length).toBe(1);
      
      // Add second target
      fireEvent.click(screen.getByText('+ เพิ่มเป้าหมายที่ต้องการเลือก'));
      expect(screen.getAllByText('มหาวิทยาลัย').length).toBe(2);
      
      // Remove a target
      const removeButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(removeButtons[0]);
      expect(screen.getAllByText('มหาวิทยาลัย').length).toBe(1);
    });

    test('populates dropdown options from API', async () => {
      render(<Calculator1 />);
      
      // Wait for options to load
      await waitFor(() => {
        expect(screen.getByText('Chulalongkorn University')).toBeInTheDocument();
        expect(screen.getByText('Thammasat University')).toBeInTheDocument();
      });
    });

    test('navigates to step 2 when next button is clicked', async () => {
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValueOnce({ push: mockPush });
      
      render(<Calculator1 />);
      fireEvent.click(screen.getByText('ขั้นตอนต่อไป'));
      
      expect(mockPush).toHaveBeenCalledWith('/tcascalculator/2');
    });
  });

  describe('Step 2: Score Input', () => {
    test('renders step 2 correctly', () => {
      render(<Calculator2 />);
      
      expect(screen.getByText('กรอกคะแนนสอบ')).toBeInTheDocument();
      expect(screen.getByLabelText('TGAT1 การสื่อสารภาษาอังกฤษ')).toBeInTheDocument();
      expect(screen.getByLabelText('A-Level คณิตศาสตร์ประยุกต์ 1')).toBeInTheDocument();
    });

    test('allows inputting scores', () => {
      render(<Calculator2 />);
      
      const tgatInput = screen.getByLabelText('TGAT1 การสื่อสารภาษาอังกฤษ') as HTMLInputElement;
      fireEvent.change(tgatInput, { target: { value: '85' } });
      expect(tgatInput.value).toBe('85');
      
      const mathInput = screen.getByLabelText('A-Level คณิตศาสตร์ประยุกต์ 1') as HTMLInputElement;
      fireEvent.change(mathInput, { target: { value: '90' } });
      expect(mathInput.value).toBe('90');
    });

    test('navigates to step 3 when calculate button is clicked', () => {
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValueOnce({ push: mockPush });
      
      render(<Calculator2 />);
      fireEvent.click(screen.getByText('คำนวณคะแนน'));
      
      expect(mockPush).toHaveBeenCalledWith('/tcascalculator/3');
    });

    test('navigates back to step 1 when back button is clicked', () => {
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValueOnce({ push: mockPush });
      
      render(<Calculator2 />);
      fireEvent.click(screen.getByText('กลับ'));
      
      expect(mockPush).toHaveBeenCalledWith('/tcascalculator/1');
    });
  });

  describe('Step 3: Results', () => {
    test('renders step 3 correctly', () => {
      render(<Calculator3 />);
      
      expect(screen.getByText('ผลการคำนวณคะแนน')).toBeInTheDocument();
      expect(screen.getByText('ผลการคำนวณ')).toBeInTheDocument();
    });

    test('navigates back to step 2 when back button is clicked', () => {
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValueOnce({ push: mockPush });
      
      render(<Calculator3 />);
      fireEvent.click(screen.getByText('กลับ'));
      
      expect(mockPush).toHaveBeenCalledWith('/tcascalculator/2');
    });
  });

  describe('Navigation Flow', () => {
    test('completes full navigation flow', async () => {
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
      
      // Start at step 1
      const { rerender } = render(<Calculator1 />);
      
      // Go to step 2
      fireEvent.click(screen.getByText('ขั้นตอนต่อไป'));
      expect(mockPush).toHaveBeenCalledWith('/tcascalculator/2');
      
      // Render step 2
      rerender(<Calculator2 />);
      
      // Go to step 3
      fireEvent.click(screen.getByText('คำนวณคะแนน'));
      expect(mockPush).toHaveBeenCalledWith('/tcascalculator/3');
      
      // Render step 3
      rerender(<Calculator3 />);
      
      // Back to step 2
      fireEvent.click(screen.getByText('กลับ'));
      expect(mockPush).toHaveBeenCalledWith('/tcascalculator/2');
      
      // Back to step 1
      rerender(<Calculator2 />);
      fireEvent.click(screen.getByText('กลับ'));
      expect(mockPush).toHaveBeenCalledWith('/tcascalculator/1');
    });
  });
});