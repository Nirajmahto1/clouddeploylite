const Docker = require('dockerode');
require('dotenv').config();

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
async function getContainer(containerId){
    return docker.getContainer(containerId);
}

//Stop Container
async function stopContainer(containerId){
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
async function removeContainer(containerId){
    try {
        const container = docker.getContainer(containerId);
        await container.remove({force:true});
        console.log(`Removed container: ${containerId}`);
    return true;
    } catch (error) {
         console.error(`Error removing container ${containerId}:`, error.message);
    throw error;
    }
}

//Get container logs
async function getContainerLogs(containerId){
    try {
        const container = docker.getContainer(containerId);
        const logs = await container.logs({
            stdout:true,
            stderr:true,
            tail:100
        });
        return logs.toString('utf8');

    } catch (error) {
        console.error(`Error getting logs for ${containerId}:`, error.message);
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
    getContainerLogs
}