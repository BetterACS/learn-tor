import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '@/app/information/services/page';
// ทดสอบการ render ของทั้งหน้า
jest.mock('@/components/index', () => ({
  Navbar: () => <div data-testid="navbar-mock" />,
  Footer: () => <div data-testid="footer-mock" />
}));

describe('Services Page', () => {
  beforeEach(() => {
    render(<Page />);
  });

  test('renders Navbar and Footer components', () => {
    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
  });

  test('renders page title correctly', () => {
    const title = screen.getByText('Our Services');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-headline-2', 'text-center');
  });

  test('renders all service sections', () => {
    expect(screen.getByText(/📊 Compare Courses/)).toBeInTheDocument();
    expect(screen.getByText(/🤖 Chatbot/)).toBeInTheDocument();
    expect(screen.getByText(/🧮 TCAS Calculate/)).toBeInTheDocument();
    expect(screen.getByText(/💬 Forum/)).toBeInTheDocument();
  });

  test('renders service descriptions correctly', () => {
    const descriptions = [
      /เปรียบเทียบหลักสูตรจากมหาวิทยาลัยต่าง ๆ/,
      /แชตบอตอัจฉริยะที่ช่วยตอบคำถาม/,
      /เครื่องมือคำนวณคะแนน TCAS/,
      /พื้นที่สำหรับแลกเปลี่ยนประสบการณ์/
    ];

    descriptions.forEach(desc => {
      expect(screen.getByText(desc)).toBeInTheDocument();
    });
  });

  test('services are rendered in the correct order', () => {
    const serviceElements = document.querySelectorAll('article');
    expect(serviceElements).toHaveLength(4);

    expect(serviceElements[0]).toHaveTextContent(/Compare Courses/);
    expect(serviceElements[1]).toHaveTextContent(/Chatbot/);
    expect(serviceElements[2]).toHaveTextContent(/TCAS Calculate/);
    expect(serviceElements[3]).toHaveTextContent(/Forum/);
  });

  test('renders with correct layout structure', () => {
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('container', 'max-w-3xl');

    const serviceSection = document.querySelector('section');
    expect(serviceSection).toHaveClass('space-y-8');
    
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(4);
    expect(articles[0]).toHaveClass('border-b', 'pb-4');
  });
});