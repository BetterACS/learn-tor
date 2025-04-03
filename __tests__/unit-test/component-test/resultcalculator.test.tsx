import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResultCalculator from '@/components/resultcalculator';
import '@testing-library/jest-dom';

// Mock useRouter with proper implementation
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

describe('ResultCalculator Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders main sections correctly', () => {
    render(<ResultCalculator />);
    
    // Check for main container using class names
    const mainContainer = document.querySelector('.relative.flex.flex-col.items-center');
    expect(mainContainer).toBeInTheDocument();
    
    // Check for content card
    expect(document.querySelector('.bg-white.rounded-lg.shadow-lg')).toBeInTheDocument();
    
    // Check for flex layout
    expect(document.querySelectorAll('.flex-col.lg\\:flex-row').length).toBeGreaterThan(0);
  });

  it('has faculty information section', () => {
    render(<ResultCalculator />);
    
    // Check for faculty header using class names
    const facultyHeader = document.querySelector('.text-headline-5.font-bold.text-primary-600');
    expect(facultyHeader).toBeInTheDocument();
    expect(facultyHeader?.textContent).toBeTruthy();
    
    // Check for university name
    const universityName = document.querySelector('.text-headline-6.text-monochrome-700');
    expect(universityName).toBeInTheDocument();
    expect(universityName?.textContent).toBeTruthy();
  });

  it('has action buttons', () => {
    render(<ResultCalculator />);
    
    // Check all buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
    
    // Check confirm button by its unique class
    expect(document.querySelector('.bg-primary-600.text-white')).toBeInTheDocument();
    
    // Check toggle button by its unique class
    expect(document.querySelector('.text-primary-600.hover\\:text-primary-900')).toBeInTheDocument();
  });

  it('toggles details visibility', async () => {
    render(<ResultCalculator />);
    
    // Find toggle button by its text pattern
    const toggleButton = screen.getByText(/แสดงรายละเอียด|ซ่อนรายละเอียด/);
    fireEvent.click(toggleButton);
    
    // Wait for details to hide
    await waitFor(() => {
      expect(screen.queryByText('วิธีการคำนวณคะแนน')).not.toBeInTheDocument();
    });
    
    fireEvent.click(toggleButton);
    // Wait for details to show
    await waitFor(() => {
      expect(screen.getByText('วิธีการคำนวณคะแนน')).toBeInTheDocument();
    });
  });

  it('opens and closes modals', async () => {
    render(<ResultCalculator />);
    
    // Find and click basic requirements button
    const basicButton = screen.getByText('คุณสมบัติพื้นฐาน');
    fireEvent.click(basicButton);
    
    // Check modal is open
    await waitFor(() => {
      expect(screen.getByText('รับผู้สมัครที่จบจาก รร. หลักสูตรแกนกลาง')).toBeInTheDocument();
    });
    
    // Find and click close button (last confirm button in DOM)
    const closeButtons = screen.getAllByText('ตกลง');
    fireEvent.click(closeButtons[closeButtons.length - 1]);
    
    // Check modal is closed
    await waitFor(() => {
      expect(screen.queryByText('รับผู้สมัครที่จบจาก รร. หลักสูตรแกนกลาง')).not.toBeInTheDocument();
    });
  });

  it('handles confirm click', () => {
    render(<ResultCalculator />);
    
    const confirmButton = screen.getByText('ตกลง');
    fireEvent.click(confirmButton);
    
    // Verify router was called
    expect(mockReplace).toHaveBeenCalledWith('/tcascalculator');
  });

  it('shows delete button when details are hidden', async () => {
    render(<ResultCalculator />);
    
    // Hide details first
    const toggleButton = screen.getByText(/แสดงรายละเอียด|ซ่อนรายละเอียด/);
    fireEvent.click(toggleButton);
    
    // Wait for delete button to appear
    await waitFor(() => {
      expect(screen.getByText('ลบการคำนวณนี้')).toBeInTheDocument();
    });
  });

  it('hides confirm button when hideConfirmButton prop is true', () => {
    render(<ResultCalculator hideConfirmButton={true} />);
    expect(screen.queryByText('ตกลง')).not.toBeInTheDocument();
  });
});