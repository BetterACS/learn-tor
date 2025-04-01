import { Questionbox } from '@/components/index';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('next/image', () => ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} />
));

describe('Questionbox Component', () => {
  const simulateSwipe = (element: HTMLElement, startX: number, endX: number) => {
    fireEvent.mouseDown(element, { clientX: startX });
    fireEvent.mouseMove(element, { clientX: (startX + endX) / 2 });
    fireEvent.mouseMove(element, { clientX: endX });
    fireEvent.mouseUp(element);
  };

  test('renders the component and displays questions', () => {
    render(<Questionbox />);

    expect(screen.getByText('คำถามที่พบบ่อย')).toBeInTheDocument();
    expect(screen.getByText('1. TCAS67 มีอะไรเปลี่ยนไปจาก TCAS66 บ้าง?')).toBeInTheDocument();
  });

  test('allows navigating between questions using buttons', () => {
    render(<Questionbox />);

    const buttons = screen.getAllByRole('button');

    fireEvent.click(buttons[1]);
    expect(screen.getByText('2. เด็กซิ่วยังสามารถสมัครใน TCAS67 ได้หรือไม่?')).toBeInTheDocument();

    fireEvent.click(buttons[0]);
    expect(screen.getByText('1. TCAS67 มีอะไรเปลี่ยนไปจาก TCAS66 บ้าง?')).toBeInTheDocument();
  });

  test('allows swiping right to left to go to next question', () => {
    render(<Questionbox />);

    const sliderContainer = document.querySelector('.relative.overflow-hidden') as HTMLElement;

    simulateSwipe(sliderContainer, 300, 100);

    expect(screen.getByText('2. เด็กซิ่วยังสามารถสมัครใน TCAS67 ได้หรือไม่?')).toBeInTheDocument();
  });

  test('allows swiping left to right to go to previous question', () => {
    render(<Questionbox />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);

    const sliderContainer = document.querySelector('.relative.overflow-hidden') as HTMLElement;

    simulateSwipe(sliderContainer, 100, 300);

    expect(screen.getByText('1. TCAS67 มีอะไรเปลี่ยนไปจาก TCAS66 บ้าง?')).toBeInTheDocument();
  });

  test('renders correct number of pagination buttons', () => {
    render(<Questionbox />);

    const paginationDots = document.querySelectorAll('.w-3.h-3.rounded-full');
    expect(paginationDots.length).toBeGreaterThan(1);
  });
});