import { api } from '../client';

// Mock axios
jest.mock('axios');
const axios = require('axios');

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates axios instance with correct base URL', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: expect.stringContaining('/api/v1'),
      timeout: 30000,
    });
  });

  it('handles successful requests', async () => {
    const mockResponse = { data: { success: true } };
    axios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponse),
      post: jest.fn().mockResolvedValue(mockResponse),
      put: jest.fn().mockResolvedValue(mockResponse),
      delete: jest.fn().mockResolvedValue(mockResponse),
    });

    const response = await api.get('/test');
    expect(response).toEqual(mockResponse);
  });

  it('handles request errors', async () => {
    const mockError = new Error('Network error');
    axios.create.mockReturnValue({
      get: jest.fn().mockRejectedValue(mockError),
      post: jest.fn().mockRejectedValue(mockError),
      put: jest.fn().mockRejectedValue(mockError),
      delete: jest.fn().mockRejectedValue(mockError),
    });

    await expect(api.get('/test')).rejects.toThrow('Network error');
  });

  it('includes retry logic for failed requests', async () => {
    const mockResponse = { data: { success: true } };
    const mockGet = jest.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockResponse);

    axios.create.mockReturnValue({
      get: mockGet,
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    });

    const response = await api.get('/test');
    expect(mockGet).toHaveBeenCalledTimes(2);
    expect(response).toEqual(mockResponse);
  });

  it('handles authentication headers', async () => {
    const mockResponse = { data: { success: true } };
    const mockGet = jest.fn().mockResolvedValue(mockResponse);

    axios.create.mockReturnValue({
      get: mockGet,
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    });

    // Mock localStorage
    const mockToken = 'test-jwt-token';
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn().mockReturnValue(mockToken),
      },
      writable: true,
    });

    await api.get('/test');
    
    expect(mockGet).toHaveBeenCalledWith('/test', {
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
  });
});
