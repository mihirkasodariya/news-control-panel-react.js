// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios';

const AuthContext = createContext()

// const BASE_URL =  process.env.BACKEND_URL || "https://admin.techspherebulletin.com";
const BASE_URL =   'http://192.168.29.225:5000' || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const updateUser = (userData) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }
  }

  const forgotPassword = async (email) => {
    try {
      await axios.post(`${process.env.BASE_URL}/auth/forgotpassword`, { email });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to send reset password link.");
    }
  };

  const resetPassword = async (data) => {
    try {
      await axios.post(`${BASE_URL}/auth/resetpassword`, data);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, updateUser, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)