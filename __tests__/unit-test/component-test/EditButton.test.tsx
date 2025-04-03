import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditButtons from '@/components/EditButtons';

describe('EditButtons Component', () => {
  const mockOnEditClick = jest.fn();
  const mockOnCancelClick = jest.fn();
  const mockOnSaveClick = jest.fn();

  const defaultProps = {
    isEditing: false,
    onEditClick: mockOnEditClick,
    onCancelClick: mockOnCancelClick,
    onSaveClick: mockOnSaveClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the edit button when not editing', () => {
    render(<EditButtons {...defaultProps} />);
    const editButton = screen.getByText('แก้ไขข้อมูล');
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass(
      'w-full sm:w-[100px] md:w-[315px] lg:w-[400px] text-big-button bg-monochrome-50 text-primary-600 border border-primary-600 py-3 px-6 rounded-lg hover:bg-monochrome-100'
    );
  });

  it('calls onEditClick when the edit button is clicked', () => {
    render(<EditButtons {...defaultProps} />);
    const editButton = screen.getByText('แก้ไขข้อมูล');
    fireEvent.click(editButton);

    expect(mockOnEditClick).toHaveBeenCalledTimes(1);
  });

  it('renders cancel and save buttons when editing', () => {
    render(<EditButtons {...defaultProps} isEditing={true} />);
    const cancelButton = screen.getByText('ยกเลิก');
    const saveButton = screen.getByText('บันทึก');

    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();

    expect(cancelButton).toHaveClass(
      'w-full sm:w-[100px] md:w-[400px] text-big-button bg-monochrome-50 text-red-600 border border-red-600 py-3 px-6 rounded-lg hover:bg-monochrome-100'
    );
    expect(saveButton).toHaveClass(
      'w-full sm:w-[100px] md:w-[400px] text-big-button bg-monochrome-50 text-green-600 border border-green-600 py-3 px-6 rounded-lg hover:bg-monochrome-100'
    );
  });

  it('calls onCancelClick when the cancel button is clicked', () => {
    render(<EditButtons {...defaultProps} isEditing={true} />);
    const cancelButton = screen.getByText('ยกเลิก');
    fireEvent.click(cancelButton);

    expect(mockOnCancelClick).toHaveBeenCalledTimes(1);
  });

  it('calls onSaveClick when the save button is clicked', () => {
    render(<EditButtons {...defaultProps} isEditing={true} />);
    const saveButton = screen.getByText('บันทึก');
    fireEvent.click(saveButton);

    expect(mockOnSaveClick).toHaveBeenCalledTimes(1);
  });
});