/* eslint-disable */
const { OAuth2, Client } = require('../../dist');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./simpledb');
const { parsed: env } = require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const getID = () => '_' + Math.random().toString(36).substr(2, 9);

const app = express();

const auth = new OAuth2();
const client = new Client(auth);

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// routeGuard middleware
const routeGuard = (visibility = 'private', strict = false) => (req, res, next) => {
  if (visibility === 'private' && !req.isAuthenticated) {
    return next(new Error('You are not authorized!'));
  }

  if (strict && req.isAuthenticated) {
    return next(new Error('You are already authenticated!'));
  }

  next();
  return;
};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.send('OK');
    return;
  }

  next();
});

// middleware
app.use((req, res, next) => {
  const data = db.get('users').filter({ id: req.cookies.auth }).value()[0];
  req.isAuthenticated = 'auth' in req.cookies && data;

  if (req.isAuthenticated) {
    // api client will have the necessary tokens in place for next calls
    auth.setCredentials(data.credentials);
    auth.setAccessToken(data.accessToken);
  }

  res.app.locals.isAuthenticated = req.isAuthenticated;

  next();
});

app.get('/', (req, res) => {
  res.render('index', {
    accessToken: req.isAuthenticated
      ? Buffer.from(JSON.stringify(auth.getAccessToken(), null, 4)).toString('base64')
      : null,
    scopes: [OAuth2.Scope.ITEMS_READ, OAuth2.Scope.STORES_READ],
    credentials: {
      clientID: env.LOYVERSE_CLIENT_ID ?? '',
      clientSecret: env.LOYVERSE_CLIENT_SECRET ?? '',
      redirectURL: env.LOYVERSE_REDIRECT_URL ?? '',
    },
  });
});

app.post('/auth/login', routeGuard('public', true), (req, res, next) => {
  let { clientID, clientSecret, redirectURL, scope } = req.body;

  const authID = getID();
  const state = getID();

  db.get('pendingAuth')
    .push({
      id: authID,
      state,
      credentials: req.body,
    })
    .write();

  res.cookie('pendingAuth', authID, {
    httpOnly: true,
    sameSite: 'lax',
    expires: new Date(Date.now() + 15 * 60 * 1000),
  });

  // set OAuth credentials
  auth.setCredentials({ clientID, clientSecret, redirectURL, scope });
  // redirect the user to loyverse for authentication
  res.json({
    data: {
      redirectTo: auth.getAuthURL(state),
    },
  });
});

app.use('/auth/logout', (req, res) => {
  if (!req.isAuthenticated) {
    res.redirect('/');
    return;
  }

  db.get('users').remove({ id: req.cookies.auth }).write();
  res.clearCookie('auth');
  res.send('You have logged out!');
});

app.get('/auth/redirects/loyverse', routeGuard('public', true), async (req, res, next) => {
  try {
    const { code, state } = req.query;

    const pendingAuth = db.get('pendingAuth').filter({ state }).value()[0];

    if (!pendingAuth) {
      next(new Error('No pending auth found'));
      return;
    }

    // set credentials
    auth.setCredentials(pendingAuth.credentials);
    const accessToken = await auth.authorize(code);
    // accessToken, store it somewhere for later use
    // whenever you need to communicate with loyverse
    // on the users behalf

    db.get('users')
      .push({
        id: pendingAuth.id,
        accessToken,
        credentials: pendingAuth.credentials,
      })
      .write();

    db.get('pendingAuth').remove({ id: pendingAuth.id }).write();

    const expiryDate = new Date(Date.now() + 86400 * 7 * 1000); // 7 days
    res.clearCookie('pendingAuth');
    res.cookie('auth', pendingAuth.id, { httpOnly: true, sameSite: 'lax', expires: expiryDate });
    res.send('Authentication successful!');
  } catch (error) {
    next(error);
  }
});

app.get('/api/items', routeGuard('private'), async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await client.items.getItems(req.query),
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/stores', routeGuard('private'), async (req, res) => {
  try {
    res.json({
      success: true,
      data: await client.stores.getStores({ limit: 2 }),
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  res.statusCode = 404;
  next(new Error(`Path "${req.path}" was NOT found using method ${req.method}`));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
