import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '@/app/tcas-info/page';

jest.mock('@/components/index', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
  Footer: () => <div data-testid="footer">Footer</div>,
  Questionbox: () => <div data-testid="questionbox">Questionbox</div>
}));

const getTabElement = (text: string) => {
  return screen.getByText(text).closest('div');
};

describe('TCAS Info Page', () => {
  beforeEach(() => {
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
  });

  test('renders all main sections', () => {
    render(<Page />);

    expect(screen.getByText('TCAS คือ')).toBeInTheDocument();
    expect(screen.getByText('ข้อมูลรอบรับ 67')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('questionbox')).toBeInTheDocument();
  });

  test('displays general TCAS information', () => {
    render(<Page />);

    expect(screen.getByText(/TCAS ย่อมาจาก Thai University Central Admission System/)).toBeInTheDocument();
    expect(screen.getByText(/รอบที่ 1 รอบ Portfolio/)).toBeInTheDocument();
    expect(screen.getByText(/รอบที่ 2 รอบ Quota/)).toBeInTheDocument();
    expect(screen.getByText(/รอบที่ 3 รอบ Admission/)).toBeInTheDocument();
    expect(screen.getByText(/รอบที่ 4 รอบ Direct Admission/)).toBeInTheDocument();
  });

  test('renders all round tabs correctly', () => {
    render(<Page />);

    expect(screen.getByText('รอบ 1 Portfolio')).toBeInTheDocument();
    expect(screen.getByText('รอบ 2 โควตา')).toBeInTheDocument();
    expect(screen.getByText('รอบ 3 Admission')).toBeInTheDocument();
    expect(screen.getByText('รอบ 4 รับตรงอิสระ')).toBeInTheDocument();
  });

  test('defaults to showing portfolio round details', () => {
    render(<Page />);

    expect(screen.getByText((content, element) => {
      return content.startsWith('รอบ Portfolio') && element?.tagName.toLowerCase() === 'span';
    })).toBeInTheDocument();

    const gradeInfoSection = screen.getByText('ใช้เกรดกี่เทอม:').parentElement;
    expect(gradeInfoSection).toHaveTextContent('4 - 5 เทอม');
  });

  test('switches between round details when tabs are clicked', () => {
    render(<Page />);

    expect(screen.getByText((content, element) => {
      return content.startsWith('รอบ Portfolio') && element?.tagName.toLowerCase() === 'span';
    })).toBeInTheDocument();

    fireEvent.click(screen.getByText('รอบ 2 โควตา'));
    expect(screen.getByText((content, element) => {
      return content.startsWith('รอบโควตา') && element?.tagName.toLowerCase() === 'span';
    })).toBeInTheDocument();

    const gradeInfoSection = screen.getByText('ใช้เกรดกี่เทอม:').parentElement;
    expect(gradeInfoSection).toHaveTextContent('6 เทอม');

    fireEvent.click(screen.getByText('รอบ 3 Admission'));
    expect(screen.getByText((content, element) => {
      return content.startsWith('รอบ Admission') && element?.tagName.toLowerCase() === 'span';
    })).toBeInTheDocument();
    expect(gradeInfoSection).toHaveTextContent('6 เทอม');

    fireEvent.click(screen.getByText('รอบ 4 รับตรงอิสระ'));
    expect(screen.getByText('รอบ 4 Direct Admission หรือ รับตรงอิสระ')).toBeInTheDocument();
    expect(gradeInfoSection).toHaveTextContent('6 เทอม');

    fireEvent.click(screen.getByText('รอบ 1 Portfolio'));
    expect(screen.getByText((content, element) => {
      return content.startsWith('รอบ Portfolio') && element?.tagName.toLowerCase() === 'span';
    })).toBeInTheDocument();
    expect(gradeInfoSection).toHaveTextContent('4 - 5 เทอม');
  });

  test('highlights the active tab', () => {
    render(<Page />);

    const portfolioTab = getTabElement('รอบ 1 Portfolio');
    const quotaTab = getTabElement('รอบ 2 โควตา');

    expect(portfolioTab).toHaveClass('text-primary-600');
    expect(quotaTab).toHaveClass('text-monochrome-950');

    fireEvent.click(screen.getByText('รอบ 2 โควตา'));
    expect(portfolioTab).toHaveClass('text-monochrome-950');
    expect(quotaTab).toHaveClass('text-primary-600');
  });

  test('shows mobile-friendly round numbers on small screens', () => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    render(<Page />);

    expect(screen.getAllByText(/รอบ [1-4]/).length).toBeGreaterThanOrEqual(4);

    expect(screen.getByText('รอบ 1').closest('span')).toHaveClass('block');
    expect(screen.getByText('รอบ 1 Portfolio').closest('span')).toHaveClass('hidden');
  });
});