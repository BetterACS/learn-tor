import { render, screen } from '@testing-library/react';
import Loginpage from '@/app/login/page';

jest.mock('@/components/Navbar', () => ({
  __esModule: true,
  default: () => <div>Navbar Mock</div>,
}));

jest.mock('@/components/LoginBlock', () => ({
  __esModule: true,
  default: () => <div>LoginBlock Mock</div>,
}));

describe('Loginpage', () => {
  it('renders with correct layout', () => {
    render(<Loginpage />);
    expect(screen.getByText('Navbar Mock')).toBeInTheDocument();
    expect(screen.getByText('LoginBlock Mock')).toBeInTheDocument();
  });
});