import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
    baseURL:API_URL,
    headers:{
        'Content-Type':'application/json'
    }
});

// Add token to request if available
api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);
api.interceptors.response.clear.use(
    (response)=>response,
    (error)=>{
        if(error.response?.status === 401){
            //Unauthorized -clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
// Auth endpoints
export const authAPI={
    loginWithGithub:()=>{
        window.location.href = `${API_URL}/auth/github`;
    },
    getCurrentUser:()=>api.get('/auth/me'),
    logout:()=>{
        localStorage.removeItem('token');
        return api.post('/auth/logout');
    }
};

//Apps Endpoints
export const appsAPI ={
    getAll:()=>api.get('/api/apps'),
    getOne:(id)=>api.get(`/api/apps/${id}`),
    create:(data)=>api.post('api/apps',data),
    delete:(id)=>api.delete(`/api/apps/${id}`)
};

export default api;