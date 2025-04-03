import React from 'react';
import { render, screen } from '@testing-library/react';
import TrendingTopic from '@/components/trending-topic';
import '@testing-library/jest-dom';

describe('TrendingTopic Component', () => {
  beforeEach(() => {
    render(<TrendingTopic />);
  });

  it('should render the trending section with correct title', () => {
    const title = screen.getByText('Stayed on Trend Topics');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-primary-600');
  });

  it('should render multiple topic cards', () => {
    const cards = screen.getAllByText(/likes.*comments/i).map(item =>
      item.closest('.py-4')
    );
    expect(cards.length).toBe(5);

    const topicImages = screen.getAllByAltText('image');
    expect(topicImages.length).toBe(2);
  });

  it('should render user information in each card', () => {
    const images = screen.getAllByRole('img');
    const profileImages = images.filter(img =>
      img.getAttribute('src')?.includes('profile.avif')
    );
    expect(profileImages.length).toBe(5);

    const usernames = screen.getAllByText(/Username\d{3}/);
    expect(usernames.length).toBe(5);
  });

  it('should display engagement metrics correctly', () => {
    const metrics = screen.getAllByText(/\d+ likes • \d+ comments/i);
    expect(metrics.length).toBe(5);

    metrics.forEach(metric => {
      expect(metric.textContent).toMatch(/^\d+ likes • \d+ comments$/);
    });
  });

  it('should conditionally render topic images', () => {
    const images = screen.getAllByRole('img');

    const profileImages = images.filter(img =>
      img.getAttribute('src')?.includes('profile.avif')
    );
    const topicImages = images.filter(img =>
      !img.getAttribute('src')?.includes('profile.avif')
    );

    expect(profileImages.length).toBe(5);
    expect(topicImages.length).toBe(2);

    topicImages.forEach(img => {
      expect(img).toHaveClass('rounded-[0.5rem]');
      expect(img).toHaveAttribute('alt', 'image');
    });
  });

  it('should have scrollable container', () => {
    const container = screen.getByText('Stayed on Trend Topics').closest('.overflow-y-auto');
    expect(container).toBeInTheDocument();
  });
});