import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompareSidebar from '@/components/compare-sidebar';
import { trpc } from '@/app/_trpc/client';

jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    searchUniversities: {
      useMutation: jest.fn(() => ({ mutate: jest.fn() }))
    }
  }
}));

describe('CompareSidebar Component', () => {
  const mockOnToggleSidebar = jest.fn();
  const mockOnAddToCompare = jest.fn();
  const mockOnSearchChange = jest.fn();
  const mockSetOptions = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders sidebar and toggles visibility', () => {
    render(
      <CompareSidebar
        onToggleSidebar={mockOnToggleSidebar}
        onAddToCompare={mockOnAddToCompare}
        onSearchChange={mockOnSearchChange}
        setOptions={mockSetOptions}
      />
    );

    const toggleButton = screen.getByAltText('Hide Icon');
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(mockOnToggleSidebar).toHaveBeenCalledWith(false);
  });

  test('calls onSearchChange when searching', () => {
    render(
      <CompareSidebar
        onToggleSidebar={mockOnToggleSidebar}
        onAddToCompare={mockOnAddToCompare}
        onSearchChange={mockOnSearchChange}
        setOptions={mockSetOptions}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search here');
    fireEvent.change(searchInput, { target: { value: 'Engineering' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('Engineering');
  });

  test('opens and selects sort option', async () => {
    render(
      <CompareSidebar
        onToggleSidebar={mockOnToggleSidebar}
        onAddToCompare={mockOnAddToCompare}
        onSearchChange={mockOnSearchChange}
        setOptions={mockSetOptions}
      />
    );

    const sortButton = screen.getByText('เลือกวิธีการเรียงลำดับ');
    fireEvent.click(sortButton);
    
    const sortOption = screen.getByText('ชื่อมหาลัย “ ก - ฮ “');
    fireEvent.click(sortOption);
    
    await waitFor(() => expect(mockSetOptions).toHaveBeenCalledWith('ชื่อมหาลัย “ ก - ฮ “'));
  });
});