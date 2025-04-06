import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  LoadingCircle,
  ErrorLoading,
  MockupTopicLoadingCard,
} from '@/components/loading';

describe('LoadingCircle Component', () => {
  it('renders a loading spinner with correct container and svg classes', () => {
    const { container } = render(<LoadingCircle />);
    // Outer container check
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('h-full');
    expect(outerDiv).toHaveClass('w-full');
    expect(outerDiv).toHaveClass('flex');
    expect(outerDiv).toHaveClass('justify-center');
    expect(outerDiv).toHaveClass('items-center');

    // SVG spinner check
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass('animate-spin');
    expect(svgElement).toHaveClass('size-10');
    expect(svgElement).toHaveClass('-ml-1');
    expect(svgElement).toHaveClass('mr-3');
    expect(svgElement).toHaveClass('text-monochrome-400');

    // Check for the circle and path within the svg
    const circleElement = svgElement?.querySelector('circle');
    const pathElement = svgElement?.querySelector('path');
    expect(circleElement).toBeInTheDocument();
    expect(pathElement).toBeInTheDocument();
  });
});

describe('ErrorLoading Component', () => {
  it('renders an error message', () => {
    render(<ErrorLoading />);
    const errorText = screen.getByText('Error loading topic');
    expect(errorText).toBeInTheDocument();
  });
});

describe('MockupTopicLoadingCard Component', () => {
  it('renders the loading card with animated pulse and placeholder texts', () => {
    const { container } = render(<MockupTopicLoadingCard />);

    // Check the outer container styling
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('bg-monochrome-50');
    expect(outerDiv).toHaveClass('drop-shadow-[0_0_6px_rgba(0,0,0,0.1)]');
    expect(outerDiv).toHaveClass('rounded-xl');
    expect(outerDiv).toHaveClass('pt-6');
    expect(outerDiv).toHaveClass('pb-3');
    expect(outerDiv).toHaveClass('px-8');

    // Check for the animate-pulse wrapper
    const pulseElement = container.querySelector('.animate-pulse');
    expect(pulseElement).toBeInTheDocument();

    // Check for placeholder text elements
    // Although these texts are rendered with text-transparent and background placeholder classes,
    // they still exist in the DOM with the defined content.
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Lorem ipsum dolor sit amet')).toBeInTheDocument();
    // Optionally, check for one of the longer sentences as well.
    expect(
      screen.getByText(/Lorem ipsum dolor sit amet consectetur adipisicing elit\. Minus magni doloremque/i)
    ).toBeInTheDocument();

    // Also check for the simulated image placeholder container.
    const imagePlaceholder = container.querySelector('.object-cover');
    expect(imagePlaceholder).toBeInTheDocument();
  });
});