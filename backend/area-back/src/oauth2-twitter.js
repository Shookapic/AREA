/**
 * @file oauth2-twitter.js
 * @description Express router module for handling Twitter OAuth2 authentication.
 */

const express = require('express');
const { TwitterApi } = require('twitter-api-v2');
const { getUserIdByEmail, createUserServiceID } = require('./crud_user_services'); // Import the functions
require('dotenv').config();
const { getServiceByName } = require('./crud_services'); // Add this import
const client = require('./db');


const router = express.Router();

const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
});

const callbackURL = 'http://localhost:3000/api/auth/twitter/callback';
/**
 * Route for initiating Twitter authentication.
 * @name GET /api/auth/twitter
 * @function
 * @memberof module:oauth2-twitter
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} req.query.email - The email address of the user.
 * @param {Object} res - The response object.
 */
router.get('/api/auth/twitter', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return res.status(404).send('User not found');
    }

    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(callbackURL, {
      scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    });

    // Store in session
    req.session.userId = userId;
    req.session.codeVerifier = codeVerifier;
    req.session.state = state;
    
    // Force session save before redirect
    await new Promise((resolve, reject) => {
      req.session.save(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Stored state:', state);
    res.redirect(url);
  } catch (error) {
    console.error('Error in Twitter auth:', error);
    res.status(500).send('Internal server error');
  }
});

/**
 * Route for handling Twitter authentication callback.
 * @name GET /api/auth/twitter/callback
 * @function
 * @memberof module:oauth2-twitter
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} req.query.state - The state parameter returned by Twitter.
 * @param {string} req.query.code - The authorization code returned by Twitter.
 * @param {Object} res - The response object.
 */
router.get('/api/auth/twitter/callback', async (req, res) => {
  const { state, code } = req.query;

  console.log('Received state:', state);
  console.log('Session state:', req.session.state);

  if (!req.session.state) {
    console.error('No state found in session');
    return res.redirect('http://localhost/services?error=session_expired');
  }

  if (state !== req.session.state) {
    console.error('State mismatch:', {
      received: state,
      stored: req.session.state
    });
    return res.redirect('http://localhost/services?error=state_mismatch');
  }

  try {
    const { client: loggedClient, accessToken, refreshToken } = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier: req.session.codeVerifier,
      redirectUri: callbackURL,
    });

    // Fetch user information
    const { data: user } = await loggedClient.v2.me();

    // Store accessToken and refreshToken in the database
    const service_id = await getServiceByName('Twitter');
    console.log(`Service ID: ${service_id}`);
    
    if (!service_id) {
      console.error('Twitter service ID not found');
      return res.redirect('http://localhost/services?error=service_not_found');
    }

    await createUserServiceID(req.session.userId, service_id, accessToken, refreshToken, true);
    console.log(`User ${user.username} connected to Twitter`);

    // Redirect with success flag and username
    res.redirect(`http://localhost/x-service`);
  } catch (error) {
    console.error('Error during Twitter authentication:', error);
    res.redirect('http://localhost/services?error=auth_failed&message=' + encodeURIComponent(error.message));
  }
});

module.exports = router;