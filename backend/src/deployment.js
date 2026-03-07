const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const { stdout } = require('process');

//Base directory for builds
const BUILD_DIR = path.join(__dirname, '../../tmp/builds');

//Ensure build directory exists
async function ensureBuildDir() {
    try {
        await fs.mkdir(BUILD_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating build directory:', error);

    }
}

//Clone Github repository
async function cloneRepo(repoUrl, deployId) {
    const buildPath = path.join(BUILD_DIR, deployId);

    console.log(`📥 Cloning repository: ${repoUrl}`);
    console.log(`   Build path: ${buildPath}`);

    return new Promise((resolve, reject) => {
        // console.log(`git clone ${repoUrl} ${buildPath}git clone ${repoUrl} ${buildPath}`);
        exec(`git clone ${repoUrl} ${buildPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error('Git clone error:', error.message);
                console.error('stderr:', stderr);
                reject(new Error(`Failed to clone repository: ${error.message}`));
                return;
            }
            console.log('✅ Repository cloned successfully');
            resolve(buildPath);
        });
    });

}

//Detect runtime (Node.js or Python)
async function detectRuntime(buildPath) {
    console.log('🔍 Detecting runtime...');

    try {
        //Check for package.json(Node.js)
        const packageJsonPath = path.join(buildPath, 'package.json');
        try {
            await fs.access(packageJsonPath);
            console.log('✅ Detected: Node.js (package.json found)');

            //Read package.json to get start command
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
            const startCommand = packageJson.scripts?.start || 'node index.js';

            return {
                runtime: 'nodejs',
                version: '18',
                startCommand
            };
        } catch {

        }
        // Check for requirements.txt
        const requirementsPath = path.join(buildPath, 'requirements.txt');
        try {
            await fs.access(requirementsPath);
            console.log('✅ Detected: Python (requirements.txt found)');
            return {
                runtime: 'python',
                version: '3.11',
                startCommand: 'python app.py'
            };
        } catch {

        }
        console.log('⚠️  No runtime detected, defaulting to Node.js');
        return {
            runtime: 'nodejs',
            version: '18',
            startCommand: 'node index.js'
        };
    } catch (error) {
        console.error('Error detecting runtime:', error);
        throw error;
    }
}

//Generate Dockerfile based on the runtime
async function generateDockerfile(buildPath, runtime) {
    console.log(`📝 Generating Dockerfile for ${runtime.runtime}...`);

    let dockerfileContent = '';
    if (runtime.runtime === 'nodejs') {
        dockerfileContent = `FROM node:${runtime.version}-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ${runtime.startCommand}
`;
    } else if (runtime.runtime === 'python') {
        dockerfileContent = `FROM python:${runtime.version}-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start command
CMD ${runtime.startCommand}
`;
    }
    const dockerfilePath = path.join(buildPath, 'Dockerfile');
    await fs.writeFile(dockerfilePath, dockerfileContent);
    console.log('✅ Dockerfile generated');
    return dockerfilePath;
}

//Clean up build directory
async function cleanupBuild(deployId) {
    const buildPath = path.join(BUILD_DIR, deployId);
    try {
        await fs.rm(buildPath, { recursive: true, force: true });
        console.log(`🗑️  Cleaned up build directory: ${deployId}`);
    } catch (error) {
        console.error('Error cleaning up build:', error);
    }
}

//Intialize deployment
async function initializeDeployment(appId,repoUrl,userId){
    const deployId = uuidv4();

    //Create Deployment record
    const deployment = await db.queryOne(
        `INSER INTO deployments (id,app_id,status,created_at)
        VALUES ($1,$2,$3,NOW())
        RETURNING *`,
        [deployId,appId,'initializing']
    );
    console.log(`🚀 Deployment initialized: ${deployId}`);
  
  return {
    deployId,
    deployment
  };
}

//Update deployment status
async function updateDeploymentStatus(deployId,status,logs=null){
    await db.query(
        `UPDATE deployments
        SET status = $1, logs=$2,updated_at= NOW()
        WHERE id = $3`,
        [status,logs,deployId]
    );
    console.log(`📊 Deployment ${deployId} status: ${status}`);
}
module.exports = {
  ensureBuildDir,
  cloneRepo,
  detectRuntime,
  generateDockerfile,
  cleanupBuild,
  initializeDeployment,
  updateDeploymentStatus,
  BUILD_DIR
};