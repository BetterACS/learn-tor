import { Footer } from "@/components/index";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Footer Component', () => {
  it('renders the Learntor logo', () => {
    render(<Footer />);

    const logo = screen.getByAltText('Learntor Logo Footer');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/Learntorbgg.avif');
  });

  it('renders the Learntor links', () => {
    render(<Footer />);

    const faqLink = screen.getByText('FAQ');
    expect(faqLink).toBeInTheDocument();
    expect(faqLink).toHaveAttribute('href', '/information/faq');

    const aboutUsLink = screen.getByText('About Us');
    expect(aboutUsLink).toBeInTheDocument();
    expect(aboutUsLink).toHaveAttribute('href', '/information/about');

    const ourServicesLink = screen.getByText('Our Services');
    expect(ourServicesLink).toBeInTheDocument();
    expect(ourServicesLink).toHaveAttribute('href', '/information/services');

    const privacyPolicyLink = screen.getByText('Privacy Policy');
    expect(privacyPolicyLink).toBeInTheDocument();
    expect(privacyPolicyLink).toHaveAttribute('href', '/information/privacy-policy');

    const affiliateProgramLink = screen.getByText('Affiliate Program');
    expect(affiliateProgramLink).toBeInTheDocument();
    expect(affiliateProgramLink).toHaveAttribute('href', '/information/affiliate-program');
  });

  it('renders the Link for Function links', () => {
    render(<Footer />);

    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/home');

    const tcasInfoLink = screen.getByText('TCAS Info');
    expect(tcasInfoLink).toBeInTheDocument();
    expect(tcasInfoLink).toHaveAttribute('href', '/tcas-info');

    const compareCoursesLink = screen.getByText('Compare Courses');
    expect(compareCoursesLink).toBeInTheDocument();
    expect(compareCoursesLink).toHaveAttribute('href', '/compare-courses');

    const forumLink = screen.getByText('Forum');
    expect(forumLink).toBeInTheDocument();
    expect(forumLink).toHaveAttribute('href', '/forum');

    const tcasCalculateLink = screen.getByText('TCAS Calculate');
    expect(tcasCalculateLink).toBeInTheDocument();
    expect(tcasCalculateLink).toHaveAttribute('href', '/tcascalculator');

    const chatbotLink = screen.getByText('Chatbot');
    expect(chatbotLink).toBeInTheDocument();
    expect(chatbotLink).toHaveAttribute('href', '/chatbot');
  });

  it('renders the social media icons with correct links', () => {
    render(<Footer />);

    const instagramIcon = screen.getByLabelText('Instagram');
    expect(instagramIcon).toBeInTheDocument();
    expect(instagramIcon).toHaveAttribute('href', 'https://www.instagram.com');

    const facebookIcon = screen.getByLabelText('Facebook');
    expect(facebookIcon).toBeInTheDocument();
    expect(facebookIcon).toHaveAttribute('href', 'https://www.facebook.com');

    const twitterIcon = screen.getByLabelText('Twitter');
    expect(twitterIcon).toBeInTheDocument();
    expect(twitterIcon).toHaveAttribute('href', 'https://www.twitter.com');

    const linkedinIcon = screen.getByLabelText('LinkedIn');
    expect(linkedinIcon).toBeInTheDocument();
    expect(linkedinIcon).toHaveAttribute('href', 'https://www.linkedin.com');
  });
});
