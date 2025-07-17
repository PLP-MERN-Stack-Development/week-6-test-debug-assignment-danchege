import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BugList from '../BugList';
import axios from 'axios';

// Mock axios
jest.mock('axios');

const mockBugs = [
  {
    _id: '1',
    title: 'Test Bug 1',
    description: 'Description 1',
    status: 'open',
    priority: 'medium',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Test Bug 2',
    description: 'Description 2',
    status: 'resolved',
    priority: 'high',
    createdAt: new Date().toISOString()
  }
];

describe('BugList', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockBugs });
  });

  test('renders bug list with all bugs', async () => {
    render(
      <MemoryRouter>
        <BugList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    });
  });

  test('handles delete button click', async () => {
    axios.delete.mockResolvedValue({ data: { message: 'Bug deleted' } });

    render(
      <MemoryRouter>
        <BugList />
      </MemoryRouter>
    );

    await waitFor(() => {
      const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
      fireEvent.click(deleteButton);
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:5000/api/bugs/1');
    });
  });

  test('handles edit button click', async () => {
    render(
      <MemoryRouter>
        <BugList />
      </MemoryRouter>
    );

    await waitFor(() => {
      const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
      fireEvent.click(editButton);
      expect(window.location.pathname).toBe('/edit/1');
    });
  });

  test('handles error state', async () => {
    axios.get.mockRejectedValue({ message: 'Network error' });

    render(
      <MemoryRouter>
        <BugList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });

  test('handles loading state', () => {
    axios.get.mockResolvedValue({ data: mockBugs });

    render(
      <MemoryRouter>
        <BugList />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
