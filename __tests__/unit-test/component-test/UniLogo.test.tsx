import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UniversityLogos from '@/components/uni-logo';

// Mock Next.js Image component to simplify testing
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('UniversityLogos Component', () => {
  const singleLogo = [{ src: '/test-logo.png', alt: 'Test University Logo' }];
  const mockLogos = [
    { src: '/logo1.png', alt: 'University 1' },
    { src: '/logo2.png', alt: 'University 2' },
    { src: '/logo3.png', alt: 'University 3' },
    { src: '/logo4.png', alt: 'University 4' },
    { src: '/logo5.png', alt: 'University 5' },
    { src: '/logo6.png', alt: 'University 6' },
  ];

  describe('Single Logo', () => {
    it('renders without crashing', () => {
      render(<UniversityLogos logos={singleLogo} />);
      expect(screen.getByAltText(singleLogo[0].alt)).toBeInTheDocument();
    });

    it('initially renders with opacity-0 and scale-75 classes', () => {
      render(<UniversityLogos logos={singleLogo} />);
      const container = screen.getByAltText(singleLogo[0].alt).parentElement;
      expect(container).toHaveClass('opacity-0');
      expect(container).toHaveClass('scale-75');
    });

    it('renders the image with correct attributes', () => {
      render(<UniversityLogos logos={singleLogo} />);
      const image = screen.getByAltText(singleLogo[0].alt);
      expect(image).toHaveAttribute('src', singleLogo[0].src);
      expect(image).toHaveAttribute('width', '100');
      expect(image).toHaveAttribute('height', '100');
      expect(image).toHaveClass('opacity-50');
      expect(image).toHaveClass('hover:opacity-100');
      expect(image).toHaveClass('hover:scale-110');
    });

    it('sets up IntersectionObserver on mount', () => {
      render(<UniversityLogos logos={singleLogo} />);
      expect(mockIntersectionObserver).toHaveBeenCalled();
    });

    it('changes classes when intersecting', async () => {
      let intersectionCallback: (entries: { isIntersecting: boolean }[]) => void = () => {};
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      render(<UniversityLogos logos={singleLogo} />);
      const container = screen.getByAltText(singleLogo[0].alt).parentElement;

      // Before intersection
      expect(container).toHaveClass('opacity-0');
      expect(container).toHaveClass('scale-75');

      // Trigger intersection
      intersectionCallback([{ isIntersecting: true }]);

      // After intersection
      await waitFor(() => {
        expect(container).toHaveClass('opacity-100');
        expect(container).toHaveClass('scale-100');
      });
    });
  });

  describe('Multiple Logos', () => {
    it('renders without crashing', () => {
      render(<UniversityLogos logos={mockLogos} />);
      expect(screen.getAllByRole('img').length).toBeGreaterThan(0);
    });

    it('renders correct number of logos', () => {
      render(<UniversityLogos logos={mockLogos} />);
      expect(screen.getAllByRole('img').length).toBe(mockLogos.length);
    });

    it('has correct grid layout classes', () => {
      render(<UniversityLogos logos={mockLogos} />);
      const grid = screen.getAllByRole('img')[0].closest('.grid');
      expect(grid).toBeInTheDocument();
      if (grid) {
        expect(grid).toHaveClass('grid-cols-3');
        expect(grid).toHaveClass('sm:grid-cols-6');
        expect(grid).toHaveClass('lg:grid-cols-6');
      }
    });

    it('applies correct container styling', () => {
      const { container } = render(<UniversityLogos logos={mockLogos} />);
      const outerDiv = container.firstChild;
      expect(outerDiv).toHaveClass('bg-monochrome-50');
      expect(outerDiv).toHaveClass('py-12');

      const innerDiv = outerDiv?.firstChild;
      expect(innerDiv).toHaveClass('container');
      expect(innerDiv).toHaveClass('mx-auto');
    });
  });
});