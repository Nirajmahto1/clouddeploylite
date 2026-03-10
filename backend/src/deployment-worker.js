const db = require('./db');
const {
  ensureBuildDir,
  cloneRepo,
  detectRuntime,
  generateDockerfile,
  cleanupBuild
} = require('./deployment');

const {
  buildImage,
  createAndStartContainer
} = require('./docker');

async function processDeployment(deployId, appId, repoUrl, userId) {
  console.log(`\n🚀 Processing deployment: ${deployId}`);
  console.log(`   App ID: ${appId}`);
  console.log(`   Repo: ${repoUrl}\n`);
  
  let buildPath = null;
  
  try {
    // Update status: cloning
    await updateStatus(deployId, appId, 'cloning');
    
    // Ensure build directory exists
    await ensureBuildDir();
    
    // Clone repository
    buildPath = await cloneRepo(repoUrl, deployId);
    
    // Update status: detecting
    await updateStatus(deployId, appId, 'detecting');
    
    // Detect runtime
    const runtime = await detectRuntime(buildPath);
    console.log(`Runtime detected: ${runtime.runtime}`);
    
    // Generate Dockerfile
    await generateDockerfile(buildPath, runtime);
    
    // Update status: building
    await updateStatus(deployId, appId, 'building');
    
    // Build Docker image
    const imageName = `app-${appId}`;
    await buildImage(buildPath, imageName);
    
    // Update status: starting
    await updateStatus(deployId, appId, 'starting');
    
    // Create and start container
    const containerName = `app-${appId}`;
    // Get app details for subdomain
const app = await db.queryOne('SELECT subdomain FROM apps WHERE id = $1', [appId]);

   const containerResult = await createAndStartContainer(imageName, containerName, {
  subdomain: app.subdomain,
  domain: process.env.APP_DOMAIN || 'localhost',  // localhost for dev
  containerPort: runtime.runtime === 'nodejs' ? 3000 : 8000,
  memory: 256 * 1024 * 1024,  // 256MB
  labels: {
    'clouddeploylite.app-id': containerName,
    'clouddeploylite.deploy-id': deployId
  }
});
    
    // Update app with container info
 await db.query(
  `UPDATE apps 
   SET container_id = $1, status = $2, url = $3
   WHERE id = $4`,
  [containerResult.containerId, 'running', containerResult.url, appId]
);
    
    // Update deployment status: success
    await updateStatus(deployId, appId, 'success');
    
    console.log(`✅ Deployment successful!`);
    console.log(`   Container: ${containerResult.containerId.substring(0, 12)}`);
    console.log(`   Port: ${containerResult.port}\n`);
    
    // Cleanup build directory
    await cleanupBuild(deployId);
    
    return {
      success: true,
      containerId: containerResult.containerId,
      port: containerResult.port
    };
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    
    // Update deployment status: failed
    await updateStatus(deployId, appId, 'failed', error.message);
    
    // Update app status
    await db.query(
      'UPDATE apps SET status = $1 WHERE id = $2',
      ['failed', appId]
    );
    
    // Cleanup
    if (buildPath) {
      await cleanupBuild(deployId);
    }
    
    throw error;
  }
}

async function updateStatus(deployId, appId, status, error = null) {
  await db.query(
    `UPDATE deployments 
     SET status = $1, logs = $2
     WHERE id = $3`,
    [status, error, deployId]
  );
  
  console.log(`📊 Status: ${status}`);
}

module.exports = {
  processDeployment
};