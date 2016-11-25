"use strict";

const debug = require('debug')('rookery:api/v3/lib/auth');
const stormpath = require('stormpath');

const apiKey = new stormpath.ApiKey(
  process.env['STORMPATH_CLIENT_APIKEY_ID'],
  process.env['STORMPATH_CLIENT_APIKEY_SECRET']
);

const client = new stormpath.Client({apiKey: apiKey});
const applicationHref = `https://api.stormpath.com/v1/applications/${process.env.STORMPATH_APPLICATION_ID}`;

function getApplication() {
  return new Promise((resolve, reject) => {
    return client.getApplication(applicationHref, (err, app) => {
      if (err) {
        return reject(err);
      }
      else {
        return resolve(app);
      }
    });
  });
}

function authenticateUser(username, password) {
  const authRequest = {
    username,
    password
  };

  return new Promise((resolve, reject) => {
    return getApplication()
      .then(app => app.authenticateAccount(authRequest, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return result.getAccount((err, account) => {
            if (err) {
              return reject(err);
            } else {
              return resolve(account);
            }
          });
        }
      }));
  });
}

function getGroups(account) {
  return new Promise((resolve, reject) => account.getGroups((err, groups) => {
    if (err) {
      return reject(err);
    } else {
      return resolve(groups.items);
    }
  }));
}

function isInstructor(account) {
  return new Promise((resolve, reject) => account.getGroups((err, groups) => {
    if (err) {
      return reject(err);
    }
    else {
      if (groups.items.some(group => group.name === 'instructors')) {
        resolve(true);
      } else {
        resolve(false);
      }
    }
  }));
}

function isStudent(account) {
  return new Promise((resolve, reject) => account.getGroups((err, groups) => {
    if (err) {
      return reject(err);
    }
    else {
      if (groups.items.some(group => group.name === 'students')) {
        resolve(true);
      } else {
        resolve(false);
      }
    }
  }));
}

/**
 *
 * @param username
 * @param password
 * @return {Promise.<JwtAuthenticationResult>}
 */
function generateToken(username, password) {
  const authRequest = {
    username,
    password
  };

  return getApplication()
    .then(app => new stormpath.OAuthPasswordGrantRequestAuthenticator(app))
    .then(authenticator => {
      return new Promise((resolve, reject) => authenticator.authenticate(authRequest, (err, result) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(result.accessTokenResponse);
          }
        }
      ));
    });
}

function authenticateToken(token) {
  return getApplication()
    .then(app => new stormpath.JwtAuthenticator(app))
    .then(authenticator => {
      return new Promise((resolve, reject) => authenticator.authenticate(token, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result)
        }
      }));
    })
    .then(result => {
      return new Promise((resolve, reject) => result.getAccount((err, account) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(account);
        }
      }));
    });
}

// function isInstructorToken(token) {
//   return authenticateToken(token)
//     .then(result => {
//       return new Promise((resolve, reject) => result.getAccount((err, account) => {
//         if (err) {
//           return reject(err);
//         } else {
//           return resolve(account);
//         }
//       }));
//     })
//     .then(account => isInstructor(account));
// }
//
// function isStudentToken(token) {
//   return authenticateToken(token)
//     .then(result => {
//       return new Promise((resolve, reject) => result.getAccount((err, account) => {
//         if (err) {
//           return reject(err);
//         } else {
//           return resolve(account);
//         }
//       }));
//     })
//     .then(account => isStudent(account));
// }

/**
 * Middleware to authenticate a token and populate the groups the token is associated with on the req.rookey.user.groups
 * object, else end the request with a 401 status
 * @param req
 * @param res
 * @param next
 */
function authenticate(req, res, next) {
  const auth_header = req.header('Authorization') || '';

  // extract token part of header value
  const match = /^Bearer (.+)$/.exec(auth_header);

  const token = match ? match[1] : '';

  return authenticateToken(token)
    .then(account => getGroups(account))
    .then(groups => {
      groups = groups || [];
      req.rookery = req.rookery || {};
      req.rookery.user = {
        groups: groups.map(group => group.name)
      };
      return next();
    })
    .catch(err => {
      debug(err);
      return res.sendStatus(401);
    });
}

// const token_1000965 = 'eyJraWQiOiI0OFlRVjZMWTM2T0Q5T0lXWkk4WkRBSFA0Iiwic3R0IjoiYWNjZXNzIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiI3V2NUeTc4Yml6d0ltM21xSVZtdGtrIiwiaWF0IjoxNDc5NzA4OTU3LCJpc3MiOiJodHRwczovL2FwaS5zdG9ybXBhdGguY29tL3YxL2FwcGxpY2F0aW9ucy9rNjBqTGFFWWN1MDFGWUF2a0NrbEUiLCJzdWIiOiJodHRwczovL2FwaS5zdG9ybXBhdGguY29tL3YxL2FjY291bnRzLzF1VllkMVE5d1E4Y3l6ZHIzWG9hQWkiLCJleHAiOjE0Nzk3MTI1NTcsInJ0aSI6IjdXY1BlM3FRTjVUNW5YTWh2WHo0MkEifQ.ZjquBPXK37B1EtHipP6Utd0FI-QuXSetbP-LhHL0Bl0';
//
// isStudentToken(token_1000965)
//   .then(console.log)
//   .catch(console.error);
//
// authenticateUser('1000965', 'Password123')
//   .then(console.log)
//   .catch(console.error);

// isStudent('1000965', 'Password123')
//   .then(console.log)
//   .catch(console.error);

// authenticateUser('1000965', 'Password123')
//   .then(getGroups)
//   .then(groups => groups.map(group => group.name))
//   .then(console.log);

// things I need:
// login for students
// login for instructors
// token for students
// token for instructors
// check if user is student or instructor
// check if token is student or insntructor

module.exports = {
  authenticateUser,
  isInstructor,
  isStudent,
  generateToken,
  authenticateToken,
  authenticate
  // isInstructorToken,
  // isStudentToken
};
