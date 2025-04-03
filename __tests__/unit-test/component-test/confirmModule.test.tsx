import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmModule from '@/components/confirmModule';

jest.mock('@/components/index', () => ({
  Button: ({ button_name, onClick }: { button_name: string; onClick: () => void }) => (
    <button onClick={onClick}>{button_name}</button>
  ),
}));

describe('ConfirmModule Component', () => {
  const mockConfirmHandle = jest.fn();
  const mockCancelHandle = jest.fn();

  const defaultProps = {
    text: 'Are you sure?',
    description: 'This action cannot be undone.',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmHandle: mockConfirmHandle,
    cancelHandle: mockCancelHandle,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with text and description', () => {
    render(<ConfirmModule {...defaultProps} />);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls confirmHandle when Confirm button is clicked', () => {
    render(<ConfirmModule {...defaultProps} />);
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    expect(mockConfirmHandle).toHaveBeenCalledTimes(1);
  });

  it('calls cancelHandle when Cancel button is clicked', () => {
    render(<ConfirmModule {...defaultProps} />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockCancelHandle).toHaveBeenCalledTimes(1);
  });

  it('does not call cancelHandle when clicking inside the modal', () => {
    render(<ConfirmModule {...defaultProps} />);
    // Target the modal content by its unique class
    const modalContent = screen.getByText('Are you sure?').closest('div'); // Find the parent div of the content

    fireEvent.mouseDown(modalContent!);
    expect(mockCancelHandle).not.toHaveBeenCalled();
  });
});