const express = require('express');
const axios = require('axios');
const db = require('../db');
const {generateToken} = require('../utils/jwt')

const router = express.Router();


//1. Redirect to Github for authorization
router.get('/github',(req,res)=>{
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email,read:user`;

    console.log('Redirecting to Github OAauth');
    res.redirect(githubAuthUrl);
});

//2. Github Callback - exchange code for token
router.get('/github/callback',async(req,res)=>{
    const {code} = req.query;

    if(!code){
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
    }
    try {
        //Exchange code for access token
        console.log('Exchanging code for access token...');
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {client_id:process.env.GITHUB_CLIENT_ID,
                client_secret:process.env.GITHUB_CLIENT_SECRET,
                code
            },
            {
                headers:{Accept:'application/json'}
            }
        );

        const accessToken = tokenResponse.data.access_token;

        if(!accessToken){
            throw new Error('Failed to get access token from Github');
        }

        // User info from GitHub
    console.log('Fetching user info from GitHub...');
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

     const githubUser = userResponse.data;
    console.log('GitHub user:', githubUser.login);

    let user = await db.queryOne(
      'SELECT * FROM users WHERE github_id = $1',
      [githubUser.id]
    );

    if(user){
        //Update existing User
        console.log('Updating existing User');
        user = await db.queryOne(
            `UPDATE users
            SET username = $1 ,email = $2, avatar_url = $3
            WHERE github_id = $4
            RETURNING *`,
            [githubUser.login,githubUser.email,githubUser.avatar_url,githubUser.id]
        );
    }else{
         // Create new user
      console.log('Creating new user...');
      user = await db.queryOne(
        `INSERT INTO users (github_id, username, email, avatar_url)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [githubUser.id, githubUser.login, githubUser.email, githubUser.avatar_url]
      );
    }

    //Generate JWT Token
    const jwtToken = generateToken({
        userId:user.id,
        username:user.username
    });
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${jwtToken}`);
    
    } catch (error) {
         console.error('OAuth error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
});

router.get('/me',async(req,res)=>{
    const {requireAuth} = require('../middleware/auth')

    await requireAuth(req,res,async()=>{
        res.json({
            user:req.user
        });
    });
});

// Logout (client-side just deletes token, but we can log it)
router.post('/logout', (req, res) => {
  console.log('User logged out');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;