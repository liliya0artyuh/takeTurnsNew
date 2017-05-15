/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/emails', require('./api/email'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/calendars', require('./api/calendar'));
  // All undefined asset or api routes should return a 404
  //app.route('/:url(api|auth|components|app|bower_components|assets)/*')
  // .get(errors[404]);

  // All other routes should redirect to the index.html
   app.route('/')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
 app.route('/calendar/:id')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
     app.route('/calendar')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
     app.route('/admin/:id')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
    app.route('/week')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
     app.route('/admin')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
    app.route('/about')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
    app.route('/event')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
    app.route('/emailSender')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
    app.route('/unknown')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/errors/unknown.html'));
    });
    app.route('/404')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/errors/404.html'));
    });
    app.route('/userError')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/errors/userError.html'));
    });
   app.route('/500')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/errors/500.html'));
    });
}
