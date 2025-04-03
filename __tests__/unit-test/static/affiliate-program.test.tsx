import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '@/app/information/affiliate-program/page';

jest.mock('@/components/index', () => ({
  Navbar: () => <div data-testid="navbar-mock" />,
  Footer: () => <div data-testid="footer-mock" />
}));

describe('Affiliate Program Page', () => {
  beforeEach(() => {
    render(<Page />);
  });

  test('renders Navbar and Footer components', () => {
    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
  });

  test('renders page title correctly', () => {
    const title = screen.getByText('Affiliate Program');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-headline-3', 'text-center');
  });

  test('renders affiliate program information', () => {
    const infoTexts = [
      /ที่ Learntor เรามีแผนจะเปิดตัวโปรแกรมพันธมิตรในเร็ว ๆ นี้/,
      /โปรแกรมพันธมิตรนี้จะเปิดโอกาสให้คุณสร้างรายได้/,
      /โปรดติดตามข้อมูลเพิ่มเติมเกี่ยวกับโปรแกรมพันธมิตร/
    ];

    infoTexts.forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test('renders in the right container structure', () => {
    const rootContainer = screen.getByTestId('navbar-mock').parentElement;
    expect(rootContainer).toHaveClass('min-h-screen', 'flex', 'flex-col');

    const contentContainer = screen.getByText('Affiliate Program')
      .nextElementSibling as HTMLElement;
    expect(contentContainer).toHaveClass('max-w-3xl', 'mx-auto', 'px-4', 'py-3');

    const contentDiv = document.querySelector('.max-w-3xl.mx-auto');
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv).toHaveClass('bg-monochrome-50', 'rounded-lg');
  });
});