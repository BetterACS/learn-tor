import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompareList from '@/components/comparelist';
import type { University } from '@/db/models';

describe('CompareList Component', () => {
  const mockHandleRemoveItem = jest.fn();
  const mockHandleCompare = jest.fn();
  const mockHandleAddItem = jest.fn();

  const mockSelectedItems: University[] = [
    { logo: '/images/uni1.avif', institution: 'University 1', program: 'Program 1' },
    { logo: '/images/uni2.avif', institution: 'University 2', program: 'Program 2' },
    { logo: '/images/uni3.avif', institution: 'University 3', program: 'Program 3' },
  ];

  const defaultProps = {
    selectedItems: [],
    isCompareListOpen: false,
    handleRemoveItem: mockHandleRemoveItem,
    handleCompare: mockHandleCompare,
    handleAddItem: mockHandleAddItem,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when the compare list is closed', () => {
    const { container } = render(<CompareList {...defaultProps} />);
    expect(container.firstChild).toHaveClass('translate-y-[70px] opacity-0 pointer-events-none');
  });
  
  it('renders correctly with no selected items', () => {
    render(<CompareList {...defaultProps} isCompareListOpen={true} />);
    expect(screen.getByText((content) => content.includes("ไม่มีรายการที่เลือก"))).toBeInTheDocument();
  });  

  it('renders selected items correctly', () => {
    render(<CompareList {...defaultProps} selectedItems={mockSelectedItems} isCompareListOpen={true} />);

    mockSelectedItems.forEach((item) => {
      expect(screen.getByText(item.program)).toBeInTheDocument();
      expect(screen.getByAltText(item.institution)).toHaveAttribute('src', item.logo);
    });
  });

  it('handles removing an item when remove button is clicked', () => {
    render(<CompareList {...defaultProps} selectedItems={mockSelectedItems} isCompareListOpen={true} />);

    const removeButtons = screen.getAllByAltText('remove');
    fireEvent.click(removeButtons[0]); // Click the remove button for the first item

    expect(mockHandleRemoveItem).toHaveBeenCalledTimes(1);
    expect(mockHandleRemoveItem).toHaveBeenCalledWith(0);
  });

  it('displays a warning when the maximum number of items is reached', () => {
    render(<CompareList {...defaultProps} selectedItems={mockSelectedItems} isCompareListOpen={true} />);
    expect(screen.getByText('เลือกได้สูงสุด 3 รายการ')).toBeInTheDocument();
  });

  it('shows the Compare button when more than one item is selected', () => {
    render(<CompareList {...defaultProps} selectedItems={mockSelectedItems} isCompareListOpen={true} />);

    const compareButton = screen.getByText('Compare');
    expect(compareButton).toBeInTheDocument();

    fireEvent.click(compareButton);
    expect(mockHandleCompare).toHaveBeenCalledTimes(1);
  });

  it('hides the Compare button when only one item is selected', () => {
    render(
      <CompareList
        {...defaultProps}
        selectedItems={[mockSelectedItems[0]]}
        isCompareListOpen={true}
      />
    );

    expect(screen.queryByText('Compare')).not.toBeInTheDocument();
  });
});