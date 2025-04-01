import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '@/app/information/faq/page';
// ทดสอบการ render ของทั้งหน้า
const mockFAQs = [
  {
    question: 'Learntor คืออะไร?',
    answer: 'Learntor เป็นแพลตฟอร์มที่ช่วยให้ผู้ใช้สามารถเข้าถึงข้อมูลเกี่ยวกับ TCAS'
  },
  {
    question: 'ต้องสมัครสมาชิกหรือไม่ถึงจะใช้ Learntor ได้?',
    answer: 'ไม่จำเป็น! ผู้ใช้สามารถดูข้อมูล TCAS'
  },
];

jest.mock('@/components/index', () => ({
  Navbar: () => <div data-testid="navbar-mock" />,
  Footer: () => <div data-testid="footer-mock" />,
}));

describe('FAQ Page', () => {
  beforeEach(() => {
    render(<Page />);
  });

  test('renders Navbar and Footer components', () => {
    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
  });

  test('renders page title correctly', () => {
    // Changed from getByRole('heading') to getByText since it's a <p> tag
    expect(screen.getByText('FAQs')).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toHaveClass('text-headline-2');
  });

  test('renders all FAQ questions', () => {
    mockFAQs.forEach(faq => {
      expect(screen.getByText(faq.question)).toBeInTheDocument();
    });
  });

  test('renders FAQ answer texts', () => {
    mockFAQs.forEach(faq => {
      const elements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes(faq.answer) || false;
      });
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  test('renders contact email link with correct attributes', () => {
    const emailLink = screen.getByRole('link', { name: /Learntor@example.gmail.com/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:Learntor@example.gmail.com');
    expect(emailLink).toHaveClass('text-primary-600');
  });

  test('renders at least one FAQ item', () => {
    const faqQuestions = mockFAQs.map(faq =>
      screen.getByText(faq.question)
    );
    expect(faqQuestions.length).toBeGreaterThan(0);
  });
});