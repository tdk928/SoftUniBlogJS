const mongoose = require('mongoose');

let roleSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    // user-a е обект защото си има име/парола ... и го достъпвъме с ref: 'User'
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const Role = mongoose.model('Role', roleSchema);
const encryption = require('./../../utilities/encryption');

module.exports = Role;

module.exports.initialize = () => {
    //бъркам в базата и търся роля -> User и ако не намериш такава ми я създай
    Role.findOne({name: 'User'}).then(role => {
        if (!role) {
            Role.create({name: 'User'});
        }
    });


    Role.findOne({name: 'Admin'}).then(role => {
        if (!role) {
            Role.create({name: 'Admin'});
        }
    });
};

