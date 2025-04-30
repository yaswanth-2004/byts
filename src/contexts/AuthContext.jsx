
import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulating JWT token storage
  const storeToken = (token) => {
    localStorage.setItem('auth_token', token);
  };

  const getToken = () => {
    return localStorage.getItem('auth_token');
  };

  const removeToken = () => {
    localStorage.removeItem('auth_token');
  };

  // Mock user data for demo purposes
  const mockUsers = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      bio: 'Platform administrator with full access to all features.',
      followersCount: 128,
      followingCount: 45,
      joinDate: '2022-02-15',
    },
    {
      id: '2',
      name: 'Moderator User',
      email: 'mod@example.com',
      password: 'password123',
      role: 'moderator',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moderator',
      bio: 'Community moderator responsible for content review.',
      followersCount: 87,
      followingCount: 32,
      joinDate: '2022-03-20',
    },
    {
      id: '3',
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      bio: 'Regular community member passionate about discussions.',
      followersCount: 42,
      followingCount: 56,
      joinDate: '2022-05-10',
    }
  ];
  
  function signup(name, email, password) {
    // Check if email already exists
    if (mockUsers.find(user => user.email === email)) {
      return Promise.reject(new Error('Email already in use'));
    }
    
    // Create a new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      password,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      bio: '',
      followersCount: 0,
      followingCount: 0,
      joinDate: new Date().toISOString().substring(0, 10),
    };
    
    // Add to mock users
    mockUsers.push(newUser);
    
    // Create a mock token
    const token = btoa(JSON.stringify({ id: newUser.id, email: newUser.email }));
    storeToken(token);
    setCurrentUser(newUser);
    
    return Promise.resolve();
  }
  
  function login(email, password) {
    // Find user
    const user = mockUsers.find(user => user.email === email && user.password === password);
    
    if (!user) {
      return Promise.reject(new Error('Invalid email or password'));
    }
    
    // Create a mock token
    const token = btoa(JSON.stringify({ id: user.id, email: user.email }));
    storeToken(token);
    setCurrentUser(user);
    
    return Promise.resolve();
  }
  
  function logout() {
    removeToken();
    setCurrentUser(null);
    return Promise.resolve();
  }
  
  function resetPassword(email) {
    const user = mockUsers.find(user => user.email === email);
    
    if (!user) {
      return Promise.reject(new Error('No user found with that email'));
    }
    
    toast.success("Password reset email sent");
    return Promise.resolve();
  }
  
  function updateProfile(updates) {
    if (!currentUser) {
      return Promise.reject(new Error('No user logged in'));
    }
    
    // Update the current user
    const updatedUser = { ...currentUser, ...updates };
    
    // Update in mock users array
    const index = mockUsers.findIndex(user => user.id === currentUser.id);
    if (index !== -1) {
      mockUsers[index] = updatedUser;
    }
    
    setCurrentUser(updatedUser);
    return Promise.resolve();
  }
  
  // Check for stored token on init
  useEffect(() => {
    const token = getToken();
    
    if (token) {
      try {
        const decoded = JSON.parse(atob(token));
        const user = mockUsers.find(user => user.id === decoded.id);
        
        if (user) {
          setCurrentUser(user);
        } else {
          removeToken();
        }
      } catch (error) {
        removeToken();
      }
    }
    
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
