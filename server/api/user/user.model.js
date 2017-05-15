'use strict';

import mongoose from 'mongoose';

var UserSchema = new mongoose.Schema({
     role:String,
     link: String,
     email:String, 
     calID: String,
     activeUserLink: String
});

export default mongoose.model('User', UserSchema);
