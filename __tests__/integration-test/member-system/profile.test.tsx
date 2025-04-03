import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import UserProfile from '@/app/profile/page';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import '@testing-library/jest-dom';

// Mock data
const mockSession = {
  data: {
    user: {
      id: 'user123',
      username: 'testuser',
      email: 'test@example.com'
    }
  },
  status: 'authenticated'
};

const mockUserData = {
  data: {
    user: {
      username: 'testuser',
      email: 'test@example.com',
      avatar: 'https://example.com/avatar.jpg',
      major: 'Science',
      talent: 'Programming',
      lesson_plan: 'Computer Science',
      GPAX: '3.5'
    },
    scores: {
      TGAT1: '80',
      TGAT2: '75',
      TGAT3: '85',
      TPAT21: '70',
      TPAT22: '65',
      TPAT23: '75',
      TPAT3: '80',
      TPAT4: '85',
      TPAT5: '90',
      A_MATH1: '90',
      A_MATH2: '85',
      A_SCIENCE: '80',
      A_PHYSIC: '85',
      A_BIOLOGY: '90',
      A_CHEMISTRY: '85',
      A_SOCIAL: '80',
      A_THAI: '85',
      A_ENGLISH: '90',
      A_FRANCE: '75',
      A_GERMANY: '70',
      A_JAPAN: '80',
      A_PALI: '65',
      A_CHINESE: '75',
      A_KOREAN: '70',
      A_SPANISH: '65'
    }
  }
};

// Mock implementations
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => mockSession)
}));

jest.mock('@/app/_trpc/client', () => {
  const mockTrpc = {
    getUser: {
      useQuery: jest.fn(() => ({
        data: mockUserData,
        isLoading: false,
        isError: false,
        isSuccess: true
      }))
    },
    editUser: {
      useMutation: jest.fn(() => ({
        mutateAsync: jest.fn(() => Promise.resolve({ status: 200 }))
      }))
    },
    addScore: {
      useMutation: jest.fn(() => ({
        mutateAsync: jest.fn(() => Promise.resolve({ status: 200 }))
      }))
    },
    updateAvatar: {
      useMutation: jest.fn(() => ({
        mutateAsync: jest.fn(() => Promise.resolve({ status: 200 }))
      }))
    }
  };
  return { trpc: mockTrpc };
});

jest.mock('next-cloudinary', () => ({
  CldUploadWidget: ({ children }: { children: any }) => 
    children({ 
      open: jest.fn(),
      close: jest.fn()
    })
}));

describe('UserProfile Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('allows editing profile when edit button is clicked', async () => {
    render(<UserProfile />);
    await screen.findByDisplayValue('testuser');
    
    fireEvent.click(screen.getByText('แก้ไขข้อมูล'));
    
    // Check that fields are now editable
    const usernameInput = screen.getByDisplayValue('testuser');
    const majorInput = screen.getByDisplayValue('Science');
    expect(usernameInput).not.toBeDisabled();
    expect(majorInput).not.toBeDisabled();
  });

  it('cancels changes when cancel button is clicked', async () => {
    render(<UserProfile />);
    await screen.findByDisplayValue('testuser');
    
    // Enter edit mode
    fireEvent.click(screen.getByText('แก้ไขข้อมูล'));
    
    // Change some values
    const usernameInput = screen.getByDisplayValue('testuser');
    fireEvent.change(usernameInput, { target: { value: 'newusername' } });
    
    // Click cancel
    fireEvent.click(screen.getByText('ยกเลิก'));
    
    // Verify values reverted
    expect(await screen.findByDisplayValue('testuser')).toBeInTheDocument();
  });

  it('validates GPAX input', async () => {
    render(<UserProfile />);
    await screen.findByDisplayValue('testuser');
    
    fireEvent.click(screen.getByText('แก้ไขข้อมูล'));
    
    const gpaInput = screen.getByDisplayValue('3.5');
    
    // Test invalid characters
    fireEvent.change(gpaInput, { target: { value: '3.5a' } });
    expect(screen.getByDisplayValue('3.5')).toBeInTheDocument();
    
    // Test more than 2 decimal places
    fireEvent.change(gpaInput, { target: { value: '3.555' } });
    expect(screen.getByDisplayValue('3.5')).toBeInTheDocument();
    
    // Test value > 4
    fireEvent.change(gpaInput, { target: { value: '4.1' } });
    expect(screen.getByDisplayValue('3.5')).toBeInTheDocument();
    
    // Test valid input
    fireEvent.change(gpaInput, { target: { value: '3.75' } });
    expect(screen.getByDisplayValue('3.75')).toBeInTheDocument();
  });

  it('displays the change password button with email parameter', async () => {
    render(<UserProfile />);
    await screen.findByDisplayValue('testuser');
    
    const changePasswordButton = screen.getByText('เปลี่ยนรหัสผ่าน');
    expect(changePasswordButton).toBeInTheDocument();
    expect(changePasswordButton.closest('a')).toHaveAttribute('href', '/verification?email=test@example.com');
  });

});