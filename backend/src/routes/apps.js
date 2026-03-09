const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all apps for current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const apps = await db.queryAll(
      `SELECT * FROM apps 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    
    res.json({ apps });
  } catch (error) {
    console.error('Error fetching apps:', error);
    res.status(500).json({ error: 'Failed to fetch apps' });
  }
});

// Get single app
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const app = await db.queryOne(
      `SELECT * FROM apps 
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    // Get deployments
    const deployments = await db.queryAll(
      `SELECT * FROM deployments 
       WHERE app_id = $1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [app.id]
    );
    
    res.json({ app, deployments });
  } catch (error) {
    console.error('Error fetching app:', error);
    res.status(500).json({ error: 'Failed to fetch app' });
  }
});

// Create new app and trigger deployment
router.post('/', requireAuth, async (req, res) => {
  const { name, repoUrl } = req.body;
  
  // Validation
  if (!name || !repoUrl) {
    return res.status(400).json({ 
      error: 'Name and repository URL are required' 
    });
  }
  
  // Validate repo URL
  if (!repoUrl.startsWith('https://github.com/')) {
    return res.status(400).json({ 
      error: 'Only GitHub repositories are supported' 
    });
  }
  
  try {
    // Generate subdomain from app name
    const subdomain = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Check if subdomain already exists
    const existing = await db.queryOne(
      'SELECT id FROM apps WHERE subdomain = $1',
      [subdomain]
    );
    
    if (existing) {
      return res.status(400).json({ 
        error: 'An app with this name already exists' 
      });
    }
    
    // Create app record
    const app = await db.queryOne(
      `INSERT INTO apps (user_id, name, subdomain, repo_url, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, name, subdomain, repoUrl, 'pending']
    );
    
    // Create deployment record
    const deployId = uuidv4();
    await db.query(
      `INSERT INTO deployments (id, app_id, status)
       VALUES ($1, $2, $3)`,
      [deployId, app.id, 'queued']
    );
    
    // TODO: Add to queue (Phase 4)
    // For now, we'll process immediately
    
    // Trigger deployment in background
    const { processDeployment } = require('../deployment-worker');
    processDeployment(deployId, app.id, repoUrl, req.user.id)
      .catch(error => {
        console.error('Deployment error:', error);
      });
    
    res.status(201).json({
      app,
      deployId,
      message: 'Deployment started'
    });
    
  } catch (error) {
    console.error('Error creating app:', error);
    res.status(500).json({ error: 'Failed to create app' });
  }
});

// Delete app
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const app = await db.queryOne(
      'SELECT * FROM apps WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    // Stop and remove container if running
    if (app.container_id) {
      const { stopContainer, removeContainer } = require('../docker');
      try {
        await stopContainer(app.container_id);
        await removeContainer(app.container_id);
      } catch (error) {
        console.error('Error removing container:', error);
      }
    }
    
    // Delete app (cascade will delete deployments and env_vars)
    await db.query('DELETE FROM apps WHERE id = $1', [app.id]);
    
    res.json({ message: 'App deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting app:', error);
    res.status(500).json({ error: 'Failed to delete app' });
  }
});

module.exports = router;