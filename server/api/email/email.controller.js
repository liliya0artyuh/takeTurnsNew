/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /api/emails              ->  create
 */

'use strict';

import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

//get email user account
var options={
    service:'gmail',
    auth:{
        user:'testact0123@gmail.com',
        pass:'pass0123'
    }
};

/*configure smtp server*/
var transporter=nodemailer.createTransport(smtpTransport(options));


// sends Email. This is not parsing data in request - request is empty for some reason
export function sendEmail(req, res) {
    if (req.body._id) {
    delete req.body._id;
  }
 var mailOptions={
        from:'takeTurns Web App <testact0123@gmail.com>',
        to :req.body.to,
        subject: req.body.subject,
        text:req.body.emailBody }

    transporter.sendMail(mailOptions,function(error,response){
        if (error){
            res.end("error");
        }else{
            res.end("sent");    
        }
    });
}


/*
function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Emails
export function index(req, res) {
  return Email.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Email from the DB
export function show(req, res) {
  return Email.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Email in the DB
export function create(req, res) {
  return Email.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Email in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Email.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Email from the DB
export function destroy(req, res) {
  return Email.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
*/