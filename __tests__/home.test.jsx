import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Home from '@/app/page';
import { supabase } from '@/lib/supabase';

// Mock Supabase to isolate the test from network calls
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('LocalPulse Home Page Integration Tests', () => {
  const mockPosts = [
    {
      id: 1,
      author_id: 'usr_101',
      title: 'Water Main Break on 4th Cross',
      description: 'Water leak causing low pressure across the block.',
      author: 'Shreesh Gunjikar',
      department: 'BWSSB',
      upvotes: 12,
      is_official: false,
      is_private: false,
      tags: ['#Water'],
      status: 'Filed',
      created_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders header logo and loads feed posts from Supabase', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
      }),
    });

    render(<Home />);

    // Verify main brand name is rendered
    expect(screen.getByText('LocalPulse')).toBeInTheDocument();

    // Navigate to Public Issues stream tab
    fireEvent.click(screen.getByRole('button', { name: /Public Issues/i }));

    // Verify mocked post renders correctly
    await waitFor(() => {
      expect(screen.getByText('Water Main Break on 4th Cross')).toBeInTheDocument();
    });
  });

  test('optimistically increments upvote count when upvote button is clicked', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }),
    });

    render(<Home />);

    // Switch to Public Issues tab
    fireEvent.click(screen.getByRole('button', { name: /Public Issues/i }));

    // Find and click the upvote button
    const upvoteButton = await screen.findByRole('button', { name: /12 Upvotes/i });
    fireEvent.click(upvoteButton);

    // Assert that the UI updates immediately to 13 upvotes
    expect(await screen.findByRole('button', { name: /13 Upvotes/i })).toBeInTheDocument();
  });
});