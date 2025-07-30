import { create } from 'zustand';

interface Credentials {
  facilityName: string;
  userId: string;
}

interface AuthState {
  isAuthenticated: boolean;
  facilityName: string | null;
  userId: string | null;
  login: (credentials: Credentials) => boolean;
  logout: () => void;
}

// Hardcoded credentials - in a real app, these would come from a secure backend
const VALID_CREDENTIALS = {
  facilityName: "UMaT Clinic",
  userId: "umat001"
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  facilityName: null,
  userId: null,
  login: (credentials: Credentials) => {
    const isValid = 
      credentials.facilityName.trim().toLowerCase() === VALID_CREDENTIALS.facilityName.toLowerCase() && 
      credentials.userId.trim().toLowerCase() === VALID_CREDENTIALS.userId.toLowerCase();
    
    if (isValid) {
      set({ 
        isAuthenticated: true,
        facilityName: credentials.facilityName,
        userId: credentials.userId
      });
    }
    return isValid;
  },
  logout: () => {
    set({ 
      isAuthenticated: false,
      facilityName: null,
      userId: null
    });
  }
}));
