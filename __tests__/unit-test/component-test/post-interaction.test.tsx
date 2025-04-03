import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import { trpc } from "@/app/_trpc/client";
import PostInteractionBar from "@/components/post-interaction-bar";

jest.mock("@/app/_trpc/client", () => ({
  trpc: {
    checkLike: {
      useMutation: jest.fn(() => ({ mutate: jest.fn() }))
    },
    likeTopic: {
      useMutation: jest.fn(() => ({ mutate: jest.fn() }))
    }
  }
}));

describe("PostInteractionBar Component", () => {
  const mockSession = {
    user: { email: "test@example.com" },
  };

  const mockPost = {
    id: "123",
    img: "test.jpg",
    title: "Test Post",
    body: "This is a test post",
    like: 5,
    isLiked: false,
  };

  const renderComponent = (commentEnable = true) => {
    return render(
      <SessionProvider session={mockSession}>
        <PostInteractionBar post={mockPost} comment_enable={commentEnable} />
      </SessionProvider>
    );
  };

  test("handles like button click", async () => {
    renderComponent();
    const likeButton = screen.getByRole("button", { name: /like/i });
    fireEvent.click(likeButton);
    await waitFor(() => expect(likeButton).toHaveClass("bg-primary-500"));
  });

  test("handles comment button click when enabled", async () => {
    const mockOnCommentClicked = jest.fn();
    render(
      <SessionProvider session={mockSession}>
        <PostInteractionBar post={mockPost} comment_enable={true} onCommentClicked={mockOnCommentClicked} />
      </SessionProvider>
    );

    const commentButton = screen.getByRole("button", { name: /comment/i });
    fireEvent.click(commentButton);
    expect(mockOnCommentClicked).toHaveBeenCalled();
  });

  test("does not render comment button when disabled", () => {
    renderComponent(false);
    expect(screen.queryByText("Comment")).toBeNull();
  });
});
