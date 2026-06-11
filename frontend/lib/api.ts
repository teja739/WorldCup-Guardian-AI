const API_URL = 'http://localhost:4000/api';

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('guardian_token') || '';
  }
  return '';
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guardian_token', token);
  }
};

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('guardian_token');
  }
};

const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'API request failed');
  }

  return res.json();
};

export const api = {
  // Auth
  login: async (email?: string, name?: string, picture?: string) => {
    const data = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: 'mock-google-credential', email, name, picture })
    }).then(r => r.json());
    
    if (data.success && data.token) {
      setAuthToken(data.token);
    }
    return data;
  },
  
  logout: async () => {
    clearAuthToken();
    return { success: true };
  },

  getProfile: async () => {
    return fetchWithAuth('/auth/profile');
  },

  updateProfile: async (profileData: any) => {
    return fetchWithAuth('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Trips
  getTrips: async () => {
    return fetchWithAuth('/trips');
  },

  createTrip: async (tripData: any) => {
    return fetchWithAuth('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData)
    });
  },

  updateTrip: async (tripData: any) => {
    return fetchWithAuth('/trips', {
      method: 'PUT',
      body: JSON.stringify(tripData)
    });
  },

  deleteTrip: async (tripId: string) => {
    return fetchWithAuth(`/trips?tripId=${tripId}`, {
      method: 'DELETE'
    });
  },

  // Budgets
  getBudgets: async () => {
    return fetchWithAuth('/budget');
  },

  addExpense: async (expenseData: any) => {
    return fetchWithAuth('/budget', {
      method: 'POST',
      body: JSON.stringify(expenseData)
    });
  },

  // Notifications
  getNotifications: async () => {
    return fetchWithAuth('/notifications');
  },

  markNotificationsRead: async (notificationId?: string) => {
    return fetchWithAuth('/notifications/read', {
      method: 'PUT',
      body: JSON.stringify({ notificationId })
    });
  },

  triggerEmergencyAlert: async (alertData: { title: string; message: string; type: string }) => {
    return fetchWithAuth('/notifications', {
      method: 'POST',
      body: JSON.stringify(alertData)
    });
  },

  // Events
  getEvents: async () => {
    return fetch(`${API_URL}/events`).then(r => r.json());
  },

  getEventById: async (eventId: string) => {
    return fetch(`${API_URL}/events/${eventId}`).then(r => r.json());
  },

  // Agent Chat / Plan / Execute
  chatAgent: async (message: string) => {
    return fetchWithAuth('/agent/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  },

  // Cricket Hub APIs
  getCricketMatches: async () => {
    return fetchWithAuth('/cricket/matches');
  },

  getCricketVenues: async () => {
    return fetchWithAuth('/cricket/venues');
  },

  getCricketAlerts: async (venueId?: string) => {
    return fetchWithAuth(`/cricket/alerts${venueId ? `?venueId=${venueId}` : ''}`);
  },

  generateCricketTravelPlan: async (matchId: string, budgetLimit?: number) => {
    return fetchWithAuth('/cricket/plan', {
      method: 'POST',
      body: JSON.stringify({ matchId, budgetLimit })
    });
  },

  updateExpense: async (tripId: string, expenseId: string, expenseData: any) => {
    return fetchWithAuth('/budget', {
      method: 'PUT',
      body: JSON.stringify({ tripId, expenseId, ...expenseData })
    });
  },

  deleteExpense: async (tripId: string, expenseId: string) => {
    return fetchWithAuth(`/budget?tripId=${tripId}&expenseId=${expenseId}`, {
      method: 'DELETE'
    });
  }
};
