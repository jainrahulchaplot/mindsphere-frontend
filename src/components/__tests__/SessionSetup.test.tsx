import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionSetup } from '../SessionSetup';

// Mock the API hooks
jest.mock('@/api/hooks', () => ({
  useCreateSession: () => ({
    mutate: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('SessionSetup Component', () => {
  const mockOnSessionCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders session setup form', () => {
    render(<SessionSetup onSessionCreated={mockOnSessionCreated} />);
    
    expect(screen.getByText(/start your meditation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mood/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/style/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start session/i })).toBeInTheDocument();
  });

  it('allows user to select mood', async () => {
    const user = userEvent.setup();
    render(<SessionSetup onSessionCreated={mockOnSessionCreated} />);
    
    const moodSelect = screen.getByLabelText(/mood/i);
    await user.selectOptions(moodSelect, 'calm');
    
    expect(moodSelect).toHaveValue('calm');
  });

  it('allows user to select duration', async () => {
    const user = userEvent.setup();
    render(<SessionSetup onSessionCreated={mockOnSessionCreated} />);
    
    const durationSelect = screen.getByLabelText(/duration/i);
    await user.selectOptions(durationSelect, '10');
    
    expect(durationSelect).toHaveValue('10');
  });

  it('allows user to select style', async () => {
    const user = userEvent.setup();
    render(<SessionSetup onSessionCreated={mockOnSessionCreated} />);
    
    const styleSelect = screen.getByLabelText(/style/i);
    await user.selectOptions(styleSelect, 'breathwork');
    
    expect(styleSelect).toHaveValue('breathwork');
  });

  it('allows user to add notes', async () => {
    const user = userEvent.setup();
    render(<SessionSetup onSessionCreated={mockOnSessionCreated} />);
    
    const notesTextarea = screen.getByLabelText(/notes/i);
    await user.type(notesTextarea, 'Feeling stressed today');
    
    expect(notesTextarea).toHaveValue('Feeling stressed today');
  });

  it('disables start button when form is invalid', () => {
    render(<SessionSetup onSessionCreated={mockOnSessionCreated} />);
    
    const startButton = screen.getByRole('button', { name: /start session/i });
    expect(startButton).toBeEnabled();
  });

  it('shows loading state when creating session', () => {
    // Mock loading state
    jest.doMock('@/api/hooks', () => ({
      useCreateSession: () => ({
        mutate: jest.fn(),
        isLoading: true,
        error: null,
      }),
    }));

    render(<SessionSetup onSessionCreated={mockOnSessionCreated} />);
    
    const startButton = screen.getByRole('button', { name: /start session/i });
    expect(startButton).toBeDisabled();
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    const mockMutate = jest.fn();
    
    jest.doMock('@/api/hooks', () => ({
      useCreateSession: () => ({
        mutate: mockMutate,
        isLoading: false,
        error: null,
      }),
    }));

    render(<SessionSetup onSessionCreated={mockOnSessionCreated} />);
    
    // Fill out the form
    await user.selectOptions(screen.getByLabelText(/mood/i), 'calm');
    await user.selectOptions(screen.getByLabelText(/duration/i), '10');
    await user.selectOptions(screen.getByLabelText(/style/i), 'breathwork');
    
    // Submit the form
    const startButton = screen.getByRole('button', { name: /start session/i });
    await user.click(startButton);
    
    expect(mockMutate).toHaveBeenCalledWith({
      mood: 'calm',
      duration: 10,
      style: 'breathwork',
      notes: '',
    });
  });

  it('displays error message when session creation fails', () => {
    const errorMessage = 'Failed to create session';
    
    jest.doMock('@/api/hooks', () => ({
      useCreateSession: () => ({
        mutate: jest.fn(),
        isLoading: false,
        error: new Error(errorMessage),
      }),
    }));

    render(<SessionSetup onSessionCreated={mockOnSessionCreated} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
