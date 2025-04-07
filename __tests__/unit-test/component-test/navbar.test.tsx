import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Navbar } from "@/components/index";
import { SessionProvider } from "next-auth/react";
import { trpc } from '@/app/_trpc/client';
import mockRouter from 'next-router-mock';
//ทดสอบการ link การใช้งาน ปุ่ม dropdown การเปลี่ยน ปุ่มเป็นรูป การแสดงรูปที่ update
jest.mock('next/router', () => jest.requireActual('next-router-mock'));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
  signOut: jest.fn(),
}));

jest.mock("@/app/_trpc/client", () => ({
  trpc: {
    getUser: {
      useQuery: jest.fn(() => ({
        data: { data: { user: { avatar: "default-avatar.png" } } },
        isLoading: false,
        isError: false,
      })),
    },
  },
}));

describe("Navbar Component", () => {
  const mockUseSession = jest.spyOn(require("next-auth/react"), "useSession");
  const mockSignOut = jest.spyOn(require("next-auth/react"), "signOut");
  const mockGetUser = jest.spyOn(
    require("@/app/_trpc/client").trpc.getUser,
    "useQuery"
  );

  const authenticatedUser = {
    id: "123",
    username: "testuser",
    email: "test@example.com",
    avatar: "test-avatar.png"
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
    mockGetUser.mockReturnValue({
      data: { data: { user: { avatar: "default-avatar.png" } } },
      isLoading: false,
      isError: false,
    });
    mockRouter.setCurrentUrl("/");
  });

  describe("Authentication", () => {
    it("renders login button when unauthenticated", () => {
      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      expect(screen.getByText("Login")).toBeInTheDocument();
      expect(screen.queryByAltText("Profile")).not.toBeInTheDocument();
    });

    it("shows profile dropdown when authenticated", async () => {
      mockUseSession.mockReturnValue({
        data: { user: authenticatedUser },
        status: "authenticated",
      });

      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      const avatarImage = await screen.findByAltText("Profile");
      fireEvent.click(avatarImage);

      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Log out")).toBeInTheDocument();
    });

    it("calls signOut when log out is clicked", async () => {
      mockUseSession.mockReturnValue({
        data: { user: authenticatedUser },
        status: "authenticated",
      });

      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      const avatarImage = await screen.findByAltText("Profile");
      fireEvent.click(avatarImage);

      const logoutButton = screen.getByText("Log out");
      fireEvent.click(logoutButton);

      expect(mockSignOut).toHaveBeenCalled();
    });

    it("displays updated avatar from database", async () => {
      mockUseSession.mockReturnValue({
        data: { user: authenticatedUser },
        status: "authenticated",
      });

      mockGetUser.mockReturnValue({
        data: {
          data: {
            user: {
              avatar: "new-updated-avatar.jpg"
            }
          }
        },
        isLoading: false,
      });

      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      const avatarImage = await screen.findByAltText("Profile");
      expect(avatarImage).toHaveAttribute("src", "new-updated-avatar.jpg");
    });
  });

  describe("Menu Interactions", () => {
    it("toggles menu visibility when menu button is clicked", async () => {
      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      const menuButton = screen.getByRole("button", { name: /menu/i });
      fireEvent.click(menuButton);

      expect(screen.getByText("TCAS Info")).toBeInTheDocument();
      expect(screen.getByText("Courses")).toBeInTheDocument();

      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.queryByText("TCAS Info")).not.toBeInTheDocument();
      });
    });

    it("closes dropdown when clicking outside", async () => {
      mockUseSession.mockReturnValue({
        data: { user: authenticatedUser },
        status: "authenticated",
      });

      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      const avatarImage = await screen.findByAltText("Profile");
      fireEvent.click(avatarImage);
      expect(screen.getByText("Profile")).toBeInTheDocument();

      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(screen.queryByText("Profile")).not.toBeInTheDocument();
      });
    });
  });

  describe("Loading States", () => {
    it("handles loading state without crashing", () => {
      mockUseSession.mockReturnValue({
        data: { user: authenticatedUser },
        status: "authenticated",
      });

      mockGetUser.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      });

      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      expect(screen.getByRole('img', { name: 'Logo' })).toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    it("logo should link to home page", () => {
      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      const logoLink = screen.getByRole('link', { name: /logo/i });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it("should navigate to home page when logo is clicked", () => {
      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      const logoLink = screen.getByRole('link', { name: /logo/i });
      fireEvent.click(logoLink);
      expect(mockRouter.asPath).toBe('/');
    });

    it("TCAS Info should link to TCAS info page", () => {
      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      fireEvent.click(screen.getByText("Information"));
      const tcasInfoLink = screen.getByText("TCAS Info").closest('a');
      expect(tcasInfoLink).toHaveAttribute('href', '/tcas-info');
    });

    it("Courses should link to compare courses page", () => {
      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      fireEvent.click(screen.getByText("Information"));
      const coursesLink = screen.getByText("Courses").closest('a');
      expect(coursesLink).toHaveAttribute('href', '/compare-courses');
    });

    it("Forum should link to forum page", () => {
      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      const forumLink = screen.getByText("Forum").closest('a');
      expect(forumLink).toHaveAttribute('href', '/forum');
    });

    it("TCAS Calculate should link to calculator page", () => {
      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      const tcasCalLink = screen.getByText("TCAS Calculate").closest('a');
      expect(tcasCalLink).toHaveAttribute('href', '/tcascalculator');
    });

    it("Chatbot should link to chatbot page", () => {
      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      const chatbotLink = screen.getByText("Chatbot").closest('a');
      expect(chatbotLink).toHaveAttribute('href', '/chatbot');
    });

    it("Profile should link to profile page when authenticated", async () => {
      mockUseSession.mockReturnValue({
        data: { user: authenticatedUser },
        status: "authenticated",
      });

      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      const avatarImage = await screen.findByAltText("Profile");
      fireEvent.click(avatarImage);

      const profileLink = screen.getByText("Profile").closest('a');
      expect(profileLink).toHaveAttribute('href', '/profile');
    });

    it("Login should link to login page", () => {
      render(
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );

      const loginLink = screen.getByText("Login").closest('a');
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });
});