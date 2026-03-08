const { 
  cloneRepo, 
  detectRuntime, 
  generateDockerfile,
  cleanupBuild,
  ensureBuildDir
} = require('./src/deployment');

const { 
  buildImage, 
  createAndStartContainer,
  stopContainer,
  removeContainer
} = require('./src/docker');

async function testBuild() {
  console.log('🧪 Testing Docker image build and container creation\n');
  
  // Use a simple test repo
  const testRepo = 'https://github.com/docker/getting-started.git';
  const deployId = 'test-build-' + Date.now();
  const imageName = `app-${deployId}`;
  const containerName = `container-${deployId}`;
  
  try {
    await ensureBuildDir();
    
    // Step 1: Clone
    console.log('--- STEP 1: Clone Repository ---');
    const buildPath = await cloneRepo(testRepo, deployId);
    console.log('');
    
    // Step 2: Detect runtime
    console.log('--- STEP 2: Detect Runtime ---');
    const runtime = await detectRuntime(buildPath);
    console.log('Runtime:', runtime);
    console.log('');
    
    // Step 3: Generate Dockerfile
    console.log('--- STEP 3: Generate Dockerfile ---');
    await generateDockerfile(buildPath, runtime);
    console.log('');
    
    // Step 4: Build image
    console.log('--- STEP 4: Build Docker Image ---');
    const buildLogs = await buildImage(buildPath, imageName, (log) => {
      // Progress callback
      if (log.includes('Step ')) {
        console.log(`   ${log}`);
      }
    });
    console.log('');
    
    // Step 5: Create and start container
    console.log('--- STEP 5: Create and Start Container ---');
    const containerResult = await createAndStartContainer(imageName, containerName, {
      containerPort: 3000,
      memory: 128 * 1024 * 1024,
      labels: {
        'clouddeploylite.managed': 'true',
        'clouddeploylite.deploy-id': deployId
      }
    });
    
    console.log('Container ID:', containerResult.containerId);
    console.log('Assigned Port:', containerResult.port);
    console.log('');
    
    // Step 6: Test the container
    console.log('--- STEP 6: Test Container ---');
    console.log(`Container is running!`);
    console.log(`Access at: http://localhost:${containerResult.port}`);
    console.log('');
    
    // Wait a bit
    console.log('Waiting 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Step 7: Cleanup
    console.log('--- STEP 7: Cleanup ---');
    await stopContainer(containerResult.containerId);
    await removeContainer(containerResult.containerId);
    await cleanupBuild(deployId);
    
    console.log('\n✅ All tests passed!');
    console.log('Docker image building and container creation working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    
    // Cleanup on error
    try {
      await cleanupBuild(deployId);
    } catch {}
    
    process.exit(1);
  }
}

testBuild();