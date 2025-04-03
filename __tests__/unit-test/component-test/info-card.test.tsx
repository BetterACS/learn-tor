import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InfoCard from '@/components/info-card';
import '@testing-library/jest-dom';
import { University } from '@/db/models';

describe('InfoCard Component', () => {
  const mockUniversityData: University = {
    id: 1,
    name: 'Test University',
    // Add other required University fields here
  };

  const mockProps = {
    university: 'Test University',
    faculty: 'Engineering',
    major: 'Computer Science',
    logo: '/test-logo.png',
    image: '/test-image.jpg',
    rounds: [
      { name: 'Round 1', quota: '10' },
      { name: 'Round 2', quota: '15' },
    ],
    all_data: mockUniversityData,
    onAddToCompare: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(<InfoCard {...mockProps} />);
    
    // Check university information is displayed
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Test University')).toBeInTheDocument();
    
    // Check rounds information
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Round 2')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    
    // Check images are rendered (we'll mock these)
    const universityImage = screen.getByAltText('Image of Test University');
    const logoImage = screen.getByAltText('Test University logo');
    expect(universityImage).toBeInTheDocument();
    expect(logoImage).toBeInTheDocument();
    
    // Check add button is present
    const addButton = screen.getByRole('button');
    expect(addButton).toBeInTheDocument();
  });

  it('calls onAddToCompare when add button is clicked', () => {
    render(<InfoCard {...mockProps} />);
    
    const addButton = screen.getByRole('button');
    fireEvent.click(addButton);
    
    expect(mockProps.onAddToCompare).toHaveBeenCalledTimes(1);
    expect(mockProps.onAddToCompare).toHaveBeenCalledWith({
      all_data: mockUniversityData,
    });
  });

  it('displays all rounds correctly', () => {
    render(<InfoCard {...mockProps} />);
    
    const rounds = screen.getAllByText(/Round \d/);
    expect(rounds).toHaveLength(2);
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('Round 2')).toBeInTheDocument();
  });

  it('renders the correct image sources', () => {
    render(<InfoCard {...mockProps} />);
    
    const universityImage = screen.getByAltText('Image of Test University');
    const logoImage = screen.getByAltText('Test University logo');
    
    expect(universityImage).toHaveAttribute('src', '/test-image.jpg');
    expect(logoImage).toHaveAttribute('src', '/test-logo.png');
  });

  it('renders the add button icon correctly', () => {
    render(<InfoCard {...mockProps} />);
    
    const addIcon = screen.getByAltText('Add');
    expect(addIcon).toBeInTheDocument();
    expect(addIcon).toHaveAttribute('src', '/images/uni-pic/add.avif');
  });
});

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));