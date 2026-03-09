const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;


//MiddleWares

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Auth Routes

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Deployment routes
const appsRoutes = require('./routes/apps');
app.use('/api/apps', appsRoutes);

// Request Logger
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.path}`,{body:req.body,query:req.query});
    next();
});

// Health Checkpoint

app.get('/health',(req,res)=>{
    res.json({
        status:'ok',
        timestamp:new Date().toISOString(),
        uptime:process.uptime()
    });
});

// API routes
app.get('/api',(req,res)=>{
    res.json({
        message:'CloudDeployLite API',
        version:'1.0.0',
        endpoints:{
            auth:'/auth/*',
            apps:'/api/apps',
            deploy:'/api/deploy'
        }
    });
});

// 404 handler
app.use((req,res)=>{
    res.status(404).json({
        error:'Not Found',
        message:`Cannot ${req.method} ${req.path}`
    });
});

// Error Handler
app.use((err,req,res,next)=>{
    console.error('Error:',err);
    res.status(err.status || 500).json({
        error:err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' &&{stack :err.stack})
    });
});

//Start server

async function startServer(){
    try {
        //Test DB
        const dbConnected = await db.testConnection();
        if(!dbConnected){
            throw new Error('Database connection failed');
        }

        //Start Server

        app.listen(PORT,()=>{
            console.log(`🚀 CloudDeployLite Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server running on: http://localhost:${PORT}
🗄️  Database: Connected
🌍 Environment: ${process.env.NODE_ENV}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
    process.exit(1);
    }
}
startServer();