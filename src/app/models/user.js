const mongoose = require('mongoose');

const { Schema } = mongoose; 
const UserSchema = mongoose.Schema({
    _id: Schema.Types.ObjectId, 
    username: {
        type: String,
        required: [true, "Please enter username"], 
        unique: true
    },
},
{
    timestamps: true
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
