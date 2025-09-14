const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  message: string;
  data?: T;
  user?: any;
  token?: string;
  leaderboard?: any[];
  totalGames?: number;
  sessionId?: string;
  startTime?: string;
}

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || 'An error occurred', response.status);
  }

  return data;
}

export const authApi = {
  register: async (name: string, phone: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, phone }),
    });
  },

  getProfile: async (token: string) => {
    return apiRequest('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const gameApi = {
  startGame: async (token: string) => {
    return apiRequest('/game/start', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  completeGame: async (token: string, sessionId: string, totalTime: number) => {
    return apiRequest('/game/complete', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sessionId, totalTime }),
    });
  },

  getLeaderboard: async () => {
    return apiRequest('/game/leaderboard');
  },
};

export const iconApi = {
  getRandomSets: async (count: number = 10) => {
    return apiRequest(`/icons/sets/random/${count}`);
  },

  getAllSets: async () => {
    return apiRequest('/icons/sets');
  },
};

export { ApiError };