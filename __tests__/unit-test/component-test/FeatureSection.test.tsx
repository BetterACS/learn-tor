import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FeatureSection } from '@/components/index';

describe('FeatureSection Component', () => {
  const mockProps = {
    title: 'Test Feature',
    description: 'This is a test description for the feature section.',
    img: '/test-image.jpg',
    link: '/test-link'
  };

  test('renders with basic props', () => {
    render(<FeatureSection {...mockProps} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockProps.img);
    expect(image).toHaveAttribute('alt', mockProps.title);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', mockProps.link);
    expect(link).toHaveTextContent('เรียนรู้เพิ่มเติม');
  });

  test('applies default styling correctly', () => {
    render(<FeatureSection {...mockProps} />);

    const container = screen.getByText(mockProps.title).parentElement;
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'text-monochrome-50', 'h-full');

    const button = screen.getByRole('link');
    expect(button).toHaveClass(
      'bg-monochrome-50',
      'text-primary-600',
      'hover:bg-primary-600',
      'hover:text-monochrome-50'
    );
  });

  test('applies hover effects correctly', () => {
    render(<FeatureSection {...mockProps} />);

    const button = screen.getByRole('link');
    expect(button).toHaveClass(
      'hover:border-monochrome-50',
      'hover:bg-primary-600',
      'hover:text-monochrome-50'
    );
  });
});