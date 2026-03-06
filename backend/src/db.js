const {Pool} = require('pg');
require('dotenv').config()

const pool = new Pool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    max:20,
    idleTimeoutMillis:3000,
    connectionTimeoutMillis:2000,
})
pool.on('connect',()=>{
 console.log('✅ Connected to PostgreSQL database');
 
})
pool.on('error',(err)=>{
    console.error('❌ Unexpected database error:', err);
    process.exit(-1);
})
//Execution of queries
const query = async (text,params)=>{
    const start = Date.now();
    try{
        const res = await pool.query(text,params);
        const duration = Date.now()-start;
        console.log('Executed query', { text, duration, rows: res.rowCount })
        return res;

    } catch(error){
         console.error('Database query error:', error);
    throw error;
    }
};

// Get single row

const queryOne = async (text,params)=>{
    const res = await query(text,params);
    return res.rows[0];
};


// Get all rows

const queryAll = async(text,params)=>{
    const res = await query(text,params);
    return res.rows;
}

//Test db connection

const testConnection = async()=>{
    try {
        const result = await query('SELECT NOW() as current_time');
        console.log('📅 Database time:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('❌ Database connection test failed:', error.message);
    return false;
    }
};

module.exports={
    pool,
    query,
    queryOne,
    queryAll,
    testConnection
};