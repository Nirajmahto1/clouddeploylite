const { testConnection, listContainers } = require('./src/docker');

async function testDocker() {
  console.log('🔍 Testing Docker connection...\n');
  
  // Test connection
  const connected = await testConnection();
  
  if (!connected) {
    console.error('\n❌ Docker connection failed. Please fix before continuing.');
    process.exit(1);
  }
  
  console.log('\n📦 Listing containers...');
  const containers = await listContainers(true);
  
  if (containers.length === 0) {
    console.log('   No containers found (this is normal for a fresh setup)');
  } else {
    console.log(`   Found ${containers.length} container(s):`);
    containers.forEach(container => {
      console.log(`   - ${container.Names[0]} (${container.State})`);
    });
  }
  
  console.log('\n✅ Docker SDK is working correctly!');
  process.exit(0);
}

testDocker();