const db = require('./src/db');

async function testDB() {
  console.log('Testing database connection...');
  
  // Test connection
  const isConnected = await db.testConnection();
  
  if (isConnected) {
    // Test query
    const users = await db.queryAll('SELECT * FROM users');
    console.log('Users in database:', users.length);
    
    process.exit(0);
  } else {
    console.error('Failed to connect to database');
    process.exit(1);
  }
}

testDB();