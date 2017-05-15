'use strict';

import mongoose from 'mongoose';

var CalendarSchema = new mongoose.Schema({
   members: [{   name: String, 
                email: String
  }],              
  name:         String,
  description:  String,
  dateCreated:  Date,
  events:[{     title: String,
                host: String, 
                date: Date,
                startTime: Date, 
                endTime: Date,
                info: String,
                reminder: Date,
                guestList: [String]
      }]
});

export default mongoose.model('Calendar', CalendarSchema);
