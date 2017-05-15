/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/calendars              ->  index
 * POST    /api/calendars              ->  create
 * GET     /api/calendars/:id          ->  show
 * PUT     /api/calendars/:id          ->  update
 * DELETE  /api/calendars/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Calendar from './calendar.model';



var sendResult = 1;

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

//code for removing event-----------------------------------
function removeEvent(calId, eventId, res, sendResult){
   Calendar.update({_id: calId}, {$pull: {events: {_id: eventId}}} )
    .then(checkIfModified(calId, eventId, res, sendResult))
    .catch(handleError(res));
}

function checkIfModified(calId, eventId, res, sendResult){
         return function(entity) {
        if(entity.nModified===0){
           res.status(404).end();
           return null;
        }else{
          if(sendResult === 1){
          getRemovedEventCal(calId, eventId, res);
        }
        return entity;
      }
  };
}



function getEventForView(updates) {
  return function(entity) {
    var indexEvent = _.findIndex(entity.events, "id", updates);
    var deletedArray  =_.pullAt(entity.events, indexEvent );
    var updated = entity;
        return updated;
  };
}


function getRemovedEventCal(calId, eventId, res){
    Calendar.findById(calId)
    .then(handleEntityNotFound(res))
    .then(getEventForView(eventId))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
//code for removing event end-----------------------------

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .spread(updated => {
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

// Gets a list of Calendars
export function index(req, res) {
  Calendar.find()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Calendar from the DB
export function show(req, res) {
  Calendar.findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Calendar in the DB
export function create(req, res) {
  Calendar.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}


// Deletes a Calendar from the DB
export function destroy(req, res) {
  Calendar.findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


// Deletes event from an existing Calendar in the DB
export function deleteEvent(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  sendResult = 1;
   removeEvent( req.params.calId, req.params.eventId, res, sendResult);
}

//Adding Events to an existing calendar
export function addEvent(req, res){
    if (req.body._id) {
        delete req.body._id;
    }
    Calendar.update({_id: req.params.calId},
    {$push:{events: req.body}})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

//Updating event START
export function updateEvent(req, res){
    if (req.body._id) {
    delete req.body._id;
  }
  sendResult = 1;
Calendar.update( { _id: req.params.calId, 
  events: { "$elemMatch": { _id: req.body.eventId }}}, 
  {$set: {"events.$.title": req.body.title ,
          "events.$.date": req.body.date,
          "events.$.host": req.body.host,
          "events.$.startTime": req.body.startTime,
          "events.$.endTime": req.body.endTime,
          "events.$.info": req.body.info}})
    .then(checkIfModified(req.params.calId, req.body.eventId, res, sendResult));
}

// Updates an existing Calendar in the DB START
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
    Calendar.update( { _id: req.params.id }, 
                          {$set: {members: req.body.members}, 
                          name: req.body.name, 
                          description: req.body.description})
    .then(checkIfCalendarModified(req.params.id, res))
    .catch(handleError(res));
}

function checkIfCalendarModified(calId, res){
      return function(entity) {
        if(entity.nModified===0){
           res.status(404).end();
           return null;
        }else{
           getCalendar(calId, res);
        }
        return entity;
      }
  }

function getCalendar(calId, res){
      Calendar.findById(calId)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Updates an existing Calendar in the DB ---- END --------------------


// -------------------- time trigered events ----------------------------------
// ------------------- 1 - delete old events logic start -----------------------
//event triggered by time to delete extra records in the database
var events = {};
var members = {};
var calendarIds = [];
var calendarIdsToDelete = [];
var intervalPeriod = 50000;//3600000 - 10000 is 30 seconds - update this if you want more time
var deleteOldEventsInterval = setInterval(myTimer, intervalPeriod);
var counter = 0;
var day;
var hour;
var monthsInput = 1;
var isoDateToCheckAgainst = getIsoDateToDeleteOldEvents(monthsInput);

function myTimer() {
 var d = new Date();
    var res;
    counter++;
    day = d.getDay();
    hour = d.getHours();
    if(day === 7){
      if(hour >= hour && hour < hour + 5 ){
      Calendar.find({"events.date": {$lte: isoDateToCheckAgainst}}, {$limit: 1})
       .then(getCalendarIds(res))
       .catch(handleError(res));
      }
    }
}

function getCalendarIds(res) {
  return function(entity) {
    //populate array of calendar Ids
    if (entity) {
        for (var i = 0; i < entity.length; i++) { 
          calendarIds.push(entity[i]._id);
    }
    //loop through calendars and delete events older than set date
    for(var t = 0; t < calendarIds.length; t++){
      Calendar.update({_id: calendarIds[t]},  {$pull : {events: {date: {$lte: isoDateToCheckAgainst}}}} )
      .then(getEvents(res))
      .catch(handleError(res));
    }
    resetVarsForDeleteOldEvents();
    }
  };
}

function  resetVarsForDeleteOldEvents(){
calendarIds=[];
}

//this method is only for viewing if the response from task to delete events is completed with nModified1
function getEvents(res) {
  return function(entity) {
    if (entity) {
    }
  };
}

function getIsoDateToDeleteOldEvents(months){
var deductMiliseconds = (1000 * 3600 * 24 * (months * 30));
var dateInMiliseconds = ((new Date().getTime())- deductMiliseconds);
return (new Date(dateInMiliseconds)).toISOString();
}
// ------------------- 1 - delete old events logic end -----------------------
// ------------------- 2 - delete old empty calendars logic start -----------------------

var deleteOldCalendarInterval = setInterval(myCalTimer, intervalPeriod);
var isoDateToCompare = getIsoDateToDeleteOldCalendars(monthsInput);

function myCalTimer() {
 var d = new Date();
    var res;
    counter++;
    day = d.getDay();
    hour = d.getHours();
    if(day === day){
        //check for calendar older than 30 and has a title name then delete
         Calendar.find({$and: [ {"dateCreated": {$lte: isoDateToCompare}}, {"events.title": {$exists: false}} ] })
       .then(getCalendarId(res));
      }
    }

    function getCalendarId(res) {
    return function(entity) {
        //populate array of calendar Ids
        if (entity) {
            for (var i = 0; i < entity.length; i++) { 
            calendarIdsToDelete.push(entity[i]._id);
            
        }
        //Loop through canlendar and delete old empty calendars
        for(var r = 0; r < calendarIdsToDelete.length; r++){
            Calendar.findById(calendarIdsToDelete[r])
            .then(removeEmptyCalendars(res));
            }
                  resetVarsForDeleteOldCalendars();
        }
        };
        }
        //reset Id of the deleted calendars
        function  resetVarsForDeleteOldCalendars(){
        calendarIdsToDelete=[];
        }
        //to remove old empty calendars
        function removeEmptyCalendars(res) {
        return function(entity) {
            if (entity) {
              console.log("\n\nThe following calendar will be removed \n" + JSON.stringify(entity));
             return entity.remove()
              .then(() => {
        });
    }
  };
}
    function getIsoDateToDeleteOldCalendars(months){
    var deductMiliseconds = (1000 * 3600 * 24 * (months * 30));
    var dateInMiliseconds = ((new Date().getTime())- deductMiliseconds);
    return (new Date(dateInMiliseconds)).toISOString();
    }
// ------------------- 2 - delete old empty calendars logic end -----------------------
// ------------------- 3 - delete old unused calendars logic start -----------------------
// ------------------- 3 - delete old unused calendars logic end -----------------------


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

// Gets a list of Calendars
export function index(req, res) {
  return Calendar.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Calendar from the DB
export function show(req, res) {
  return Calendar.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Calendar in the DB
export function create(req, res) {
  return Calendar.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Calendar in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Calendar.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Calendar from the DB
export function destroy(req, res) {
  return Calendar.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
*/