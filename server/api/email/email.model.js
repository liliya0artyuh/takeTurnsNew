'use strict';

import mongoose from 'mongoose';

var EmailSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Email', EmailSchema);
