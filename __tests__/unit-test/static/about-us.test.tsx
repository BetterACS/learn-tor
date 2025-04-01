import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '@/app/information/about/page';
//  ทดสอบการ render ของทั้งหน้า
jest.mock('@/components/index', () => ({
  Navbar: () => <div data-testid="navbar" />,
  Footer: () => <div data-testid="footer" />,
}));

describe('About Page', () => {
  beforeEach(() => {
    render(<Page />);
  });

  it('renders navbar and footer', () => {
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('has correct main content structure', () => {
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('container', 'mx-auto', 'px-4', 'py-8', 'max-w-3xl');
  });

  it('displays correct page title', () => {
    const title = screen.getByText('About Us');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('P');
    expect(title).toHaveClass('text-center', 'mb-6');
  });

  it('renders all content sections', () => {
    const sections = document.querySelectorAll('section.mb-6');
    expect(sections.length).toBe(4);

    const sectionTitles = [
      'เราให้บริการอะไรบ้าง?',
      'ใครคือผู้ใช้ของเรา?',
      'ข้อจำกัดของเรา'
    ];

    sectionTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

it('contains introduction text', () => {
    const introSection = screen.getByText((content, element) => {
      const hasText = (text: string) => element?.textContent?.includes(text) || false;
      return element?.tagName === 'P' &&
             hasText('Learntor') &&
             hasText('แพลตฟอร์มที่รวบรวมข้อมูลสำคัญ');
    });

    expect(introSection).toBeInTheDocument();

    const introContainer = document.querySelector('section p');
    expect(introContainer).toHaveTextContent(/Learntor.*แพลตฟอร์มที่รวบรวมข้อมูลสำคัญ/);
    expect(introContainer).toHaveTextContent('TCAS');
  });

  it('lists all services', () => {
    const services = [
      'ข้อมูลหลักสูตรมหาวิทยาลัย',
      'TCAS Guide',
      'เครื่องมือช่วยตัดสินใจ',
      'Forum พูดคุย & แชร์ประสบการณ์'
    ];

    services.forEach(service => {
      expect(screen.getByText(service)).toBeInTheDocument();
    });
  });

  it('lists all target audience groups', () => {
    const audiences = [
      'นักเรียนมัธยมปลาย',
      'ผู้ที่สนใจศึกษาต่อระดับอุดมศึกษา',
      'นักศึกษา & ผู้มีประสบการณ์'
    ];

    audiences.forEach(audience => {
      expect(screen.getByText(audience)).toBeInTheDocument();
    });
  });

  it('lists all limitations', () => {
    const limitations = [
      'ไม่ให้คำปรึกษาเชิงลึกแบบรายบุคคล',
      'ไม่รับประกันการตอบรับเข้าศึกษาจากมหาวิทยาลัย'
    ];

    limitations.forEach(limitation => {
      expect(screen.getByText(limitation)).toBeInTheDocument();
    });
  });

  it('displays footer tagline', () => {
    const tagline = screen.getByText('Learntor – คู่มือการศึกษาที่คุณวางใจได้');
    expect(tagline).toBeInTheDocument();
    expect(tagline).toHaveClass('text-center');
  });
});