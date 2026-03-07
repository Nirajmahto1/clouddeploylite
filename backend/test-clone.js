const { 
  ensureBuildDir, 
  cloneRepo, 
  detectRuntime, 
  generateDockerfile,
  cleanupBuild
} = require('./src/deployment');

async function testCloneAndDetect() {
  console.log('🧪 Testing Git clone and runtime detection\n');
  
  // Test repo (simple Node.js app)
  const testRepo = 'https://github.com/docker/getting-started.git';
  const deployId = 'test-' + Date.now();
  
  try {
    // Ensure build directory exists
    await ensureBuildDir();
    console.log('✅ Build directory ready\n');
    
    // Clone repository
    console.log('--- STEP 1: Clone Repository ---');
    const buildPath = await cloneRepo(testRepo, deployId);
    console.log('');
    
    // Detect runtime
    console.log('--- STEP 2: Detect Runtime ---');
    const runtime = await detectRuntime(buildPath);
    console.log('Runtime info:', runtime);
    console.log('');
    
    // Generate Dockerfile
    console.log('--- STEP 3: Generate Dockerfile ---');
    const dockerfilePath = await generateDockerfile(buildPath, runtime);
    console.log('Dockerfile created at:', dockerfilePath);
    console.log('');
    
    // Show Dockerfile content
    const fs = require('fs').promises;
    const dockerfileContent = await fs.readFile(dockerfilePath, 'utf8');
    console.log('--- Dockerfile Content ---');
    console.log(dockerfileContent);
    console.log('');
    
    // Cleanup
    console.log('--- STEP 4: Cleanup ---');
    await cleanupBuild(deployId);
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testCloneAndDetect();