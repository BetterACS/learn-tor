import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Carousel from '@/components/carousel';

const mockCarouselItems = [
  { _id: 1, img: 'https://via.placeholder.com/150', title: 'Item 1', body: 'Description 1' },
  { _id: 2, img: '', title: 'Item 2', body: 'Description 2' },
  { _id: 3, img: 'https://via.placeholder.com/150', title: 'Item 3', body: 'Description 3' },
  { _id: 4, img: 'https://via.placeholder.com/150', title: 'Item 4', body: 'Description 4' },
];

describe('Carousel Component', () => {

  it('renders images correctly when they are provided', () => {
    render(<Carousel carousel_items={mockCarouselItems} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(3);
    images.forEach((image) => {
      expect(image).toBeInTheDocument();
    });
  });
});