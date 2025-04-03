import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import Calculator from '@/components/Calculator';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/index', () => ({
  ResultCalculator: () => <div data-testid="result-calculator">Result Calculator</div>,
}));

describe('Calculator Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    sessionStorage.clear();
  });

  it('renders the header and logo correctly', () => {
    render(<Calculator />);
    expect(screen.getByAltText('Learntor Logo')).toBeInTheDocument();
    expect(screen.getByText('การคำนวณคะแนน TCAS')).toBeInTheDocument();
    expect(screen.getByText('ฟีเจอร์ที่ช่วยคำนวณคะแนน และวิเคราะห์โอกาสสอบติด TCAS ให้กับน้อง ๆ')).toBeInTheDocument();
  });

  it('renders the step indicator correctly', () => {
    render(<Calculator />);
    expect(screen.getByText('เลือกเป้าหมาย')).toBeInTheDocument();
    expect(screen.getByText('กรอกคะแนนสอบ')).toBeInTheDocument();
    expect(screen.getByText('ดูผลและเป้าหมาย')).toBeInTheDocument();
  });

  it('renders the "no result" message when no calculation result exists', () => {
    render(<Calculator />);
    expect(
      screen.getByText('ตอนนี้คุณยังไม่มีบันทึกการคำนวณคะแนน')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('result-calculator')).not.toBeInTheDocument();
  });

  it('renders the ResultCalculator component when calculation result exists', () => {
    sessionStorage.setItem('calculationResult', JSON.stringify({ score: 85 }));
    render(<Calculator />);
    expect(screen.getByTestId('result-calculator')).toBeInTheDocument();
    expect(screen.queryByText('ตอนนี้คุณยังไม่มีบันทึกการคำนวณคะแนน')).not.toBeInTheDocument();
  });

  it('navigates to the calculator page when the "คำนวณคะแนน TCAS" button is clicked', () => {
    render(<Calculator />);
    const button = screen.getByText('คำนวณคะแนน TCAS');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/tcascalculator/1');
  });
});