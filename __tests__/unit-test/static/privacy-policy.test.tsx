import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '@/app/information/privacy-policy/page';
// ทดสอบการ render ของทั้งหน้า
jest.mock('@/components/index', () => ({
  Navbar: () => <div data-testid="navbar-mock" />,
  Footer: () => <div data-testid="footer-mock" />
}));

describe('Privacy Policy Page', () => {
  beforeEach(() => {
    render(<Page />);
  });

  test('renders Navbar and Footer components', () => {
    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
  });

  test('renders page title correctly', () => {
    const title = screen.getByText('Privacy Policy');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-headline-2', 'text-primary-600');
  });

  test('renders all policy sections', () => {
    const sectionTitles = [
      '1. ข้อมูลที่เรารวบรวม',
      '2. การใช้ข้อมูลของเรา',
      '3. การแชร์ข้อมูลของคุณ',
      '4. ความปลอดภัยของข้อมูล',
      '5. สิทธิของคุณ',
      '6. การเปลี่ยนแปลงนโยบายความเป็นส่วนตัว',
      '7. ลิงก์ไปยังเว็บไซต์ของบุคคลที่สาม',
      '8. ความเป็นส่วนตัวของเด็ก'
    ];

    sectionTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test('renders intro paragraph correctly', () => {
    const introText = screen.getByText((content, element) => {
      const hasText = (text: string) => element?.textContent?.includes(text) || false;
      return element?.tagName === 'P' && 
             hasText('ที่ Learntor เรามุ่งมั่นที่จะปกป้องและเคารพความเป็นส่วนตัวของคุณ');
    });
    expect(introText).toBeInTheDocument();

    const introContainer = screen.getByText('Privacy Policy')
      .closest('div')
      ?.querySelector('p.text-headline-6');
    expect(introContainer).toHaveTextContent(/ที่ Learntor เรามุ่งมั่นที่จะปกป้องและเคารพความเป็นส่วนตัวของคุณ/);
  });

  test('renders all information collection types', () => {
    const infoTypes = [
      /ข้อมูลส่วนบุคคล:/,
      /ข้อมูลที่ไม่ระบุตัวตน:/,
      /คุกกี้ \(Cookies\):/
    ];

    infoTypes.forEach(type => {
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });

  test('renders contact email information', () => {
    expect(screen.getByText(/อีเมล: Learntor@example.gmail.com/)).toBeInTheDocument();
  });

  test('renders correct styling and layout', () => {
    const rootContainer = screen.getByTestId('navbar-mock').parentElement;
    expect(rootContainer).toHaveClass('bg-white', 'text-gray-800');

    const contentContainer = screen.getByText('Privacy Policy').closest('div');
    expect(contentContainer).toHaveClass('max-w-4xl', 'mx-auto', 'p-6');
  });
});