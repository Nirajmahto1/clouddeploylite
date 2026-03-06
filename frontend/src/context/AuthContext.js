import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const response = await authAPI.getCurrentUser();
            setUser(response.data.user);
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('token');
            setError('Session expired');
        } finally {
            setLoading(false);
        }
    };

    const login = ()=>{
        authAPI.loginWithGithub();
    };
    const logout = async()=>{
        try {
            await authAPI.logout();
            setUser(null);
            window.location.href='/login';
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated:!!user
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}