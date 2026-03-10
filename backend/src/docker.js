const Docker = require('dockerode');
require('dotenv').config();
const tar = require('tar-fs');
const path = require('path');

const isWindows = process.platform === 'win32';

const dockerOptions = isWindows ? {
    socketPath: '//./pipe/docker_engine',
} : {
    socketPath: process.env.DOCKER_SOCKET_PATH || 'var/run/docker.sock'
};
const docker = new Docker(dockerOptions)
console.log('🐳 Docker connection configured for:', process.platform);

//Test docker connection

async function testConnection() {
    try {
        const version = await docker.version();
        console.log('✅ Connected to Docker Engine:', version.Version);
        console.log('   API Version:', version.ApiVersion);
        console.log('   OS:', version.Os);
        console.log('   Architecture:', version.Arch);
        return true;
    } catch (error) {
        console.error('❌ Docker connection failed:', error.message);
        console.log('💡 Troubleshooting:');
        console.log('   1. Is Docker Desktop running?');
        console.log('   2. Try: docker ps');
        console.log('   3. Restart Docker Desktop');
        return false;
    }
}

//List All Containers

async function listContainers(all = false) {
    try {
        const containers = await docker.listContainers({ all });
        return containers;
    } catch (error) {
        console.error('Error listing containers:', error);
        throw error;
    }
}

//Get container by ID
async function getContainer(containerId) {
    return docker.getContainer(containerId);
}

//Stop Container
async function stopContainer(containerId) {
    try {
        const container = docker.getContainer(containerId);
        await container.stop();
        console.log(`Stopped Container: ${containerId}`);
        return true;

    } catch (error) {
        console.error(`Error stopping container ${containerId}:`, error.message);
        throw error;
    }
}

//Remove Container
async function removeContainer(containerId) {
    try {
        const container = docker.getContainer(containerId);
        await container.remove({ force: true });
        console.log(`Removed container: ${containerId}`);
        return true;
    } catch (error) {
        console.error(`Error removing container ${containerId}:`, error.message);
        throw error;
    }
}

//Get container logs
async function getContainerLogs(containerId) {
    try {
        const container = docker.getContainer(containerId);
        const logs = await container.logs({
            stdout: true,
            stderr: true,
            tail: 100
        });
        return logs.toString('utf8');

    } catch (error) {
        console.error(`Error getting logs for ${containerId}:`, error.message);
        throw error;
    }
}
//Build docker image from directory
async function buildImage(buildPath, imageName, onProgress) {
    console.log(`🔨 Building Docker image: ${imageName}`);
    console.log(`   Source: ${buildPath}`);

    return new Promise((resolve,reject)=>{
        //Create tar archive of build directory
        const tarStream = tar.pack(buildPath,{
            ignore:(name)=>{
                //Ignore node_modules ,.git,etc.
                const relativeName = path.relative(buildPath,name);
                return relativeName.includes('node_modules')|| relativeName.includes('.git')||relativeName.startsWith('.');
            }
        });
        //Build Image
        docker.buildImage(tarStream,{
            t:imageName,
        },(err,stream)=>{
            if(err){
                console.error('Build image error:',err);
                reject(err);
                return;
            }
            let buildLogs='';
            //Follow the build Stream
            stream.on('data',(chunk)=>{
                const output = chunk.toString('utf8');
                buildLogs +=output;

                try{
                    const lines = output.split('\n').filter(Boolean);
                    lines.forEach(line=>{
                        const parsed = JSON.parse(line);
                        if(parsed.stream){
                            console.log(parsed.stream.trim());
                            //Call progress callback if provided
                            if(onProgress){
                                onProgress(parsed.stream.trim());
                            }
                        }
                        if(parsed.error){
                            console.error('Build error:',parsed.error);
                        }
                    })
                }catch(parseError){

                }
            });
            stream.on('end',()=>{
                console.log('✅ Image built successfully');
        resolve(buildLogs);
            });
            stream.on('error',(error)=>{
                console.error('Build stream error:', error);
        reject(error);
            });
        });
    });
}
//Create and start container
async function createAndStartContainer(imageName, containerName, options = {}) {
  console.log(`🚀 Creating container: ${containerName}`);
  
  const subdomain = options.subdomain || containerName;
  const domain = options.domain || 'localhost';
  const containerPort = options.containerPort || 3000;
  
  // Fix labels - ensure all values are strings
  const customLabels = {};
  if (options.labels) {
    Object.keys(options.labels).forEach(key => {
      customLabels[key] = String(options.labels[key]);
    });
  }
  
  const labels = {
    'traefik.enable': 'true',
    
    // HTTP Router
    [`traefik.http.routers.${containerName}.rule`]: `Host(\`${subdomain}.${domain}\`)`,
    [`traefik.http.routers.${containerName}.entrypoints`]: 'web',
    
    // Service - Tell Traefik which internal port to use
    [`traefik.http.services.${containerName}.loadbalancer.server.port`]: String(containerPort),
    
    // Custom labels
    'clouddeploylite.managed': 'true',
    ...customLabels
  };
  
  console.log('📋 Container labels:', JSON.stringify(labels, null, 2));
  
  // Container config for Traefik routing
  const containerConfig = {
    Image: imageName,
    name: containerName,
    
    // Expose the port (internal Docker network only)
    ExposedPorts: {
      [`${containerPort}/tcp`]: {}
    },
    
    HostConfig: {
      // Memory limit
      Memory: options.memory || 256 * 1024 * 1024,
      
      // Restart policy
      RestartPolicy: {
        Name: 'unless-stopped'
      },
      
      // Connect to web network (same as Traefik)
      NetworkMode: 'web'
      
      // NO PortBindings! Traefik handles routing
    },
    
    Env: options.env || [],
    Labels: labels
  };
  
  try {
    const container = await docker.createContainer(containerConfig);
    console.log(`   Container created: ${container.id.substring(0, 12)}`);
    
    // Start container
    await container.start();
    console.log('   Container started');
    
    // Get container info
    const containerInfo = await container.inspect();
    
    // Build URL (accessed via Traefik, not direct port)
    const protocol = options.enableHttps && domain !== 'localhost' ? 'https' : 'http';
    const url = `${protocol}://${subdomain}.${domain}`;
    
    console.log(`✅ Container running`);
    console.log(`   Internal port: ${containerPort}`);
    console.log(`   Access URL (via Traefik): ${url}`);
    console.log(`   Container network: web`);
    
    return {
      containerId: container.id,
      subdomain: `${subdomain}.${domain}`,
      url,
      containerInfo
    };
    
  } catch (error) {
    console.error('Error creating container:', error.message);
    throw error;
  }
}




module.exports = {
    docker,
    testConnection,
    listContainers,
    getContainer,
    stopContainer,
    removeContainer,
    getContainerLogs,
    buildImage,
    createAndStartContainer
}