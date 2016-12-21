const mongoose = require('mongoose');
const encryption = require('./../utilities/encryption');
const Role = require('mongoose').model('Role');

// променлива userleSchema която съдържа различни пропъртита за User-a и съответния тип в който ги искаме да ни се подадът
let userSchema = mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
        fullName: {type: String, required: true},
        articles: [{type: mongoose.Schema.Types.ObjectId, ref:'Article'}],
        roles: [{type: mongoose.Schema.Types.ObjectId, ref:'Role'}],
        salt: {type: String, required: true}
    }
);

userSchema.method ({

    //автентикираща функция която приема парола
   authenticate: function (password) {
       //използваме encryption,hashPassword -> подаваме паролата , използваме солта
       let inputPasswordHash = encryption.hashPassword(password, this.salt);
       let isSamePasswordHash = inputPasswordHash === this.passwordHash;

       return isSamePasswordHash;
   },
    isAuthor: function (article) {
        if(!article) {
            return false;
        }
        let isAuthor = article.author.equals(this.id);

        return isAuthor;
    },
    isInRole: function (roleName) {
        //намери ми такава роля чието име е равно на roleName и после ми го върни и ми кажи роля
        return Role.findOne({name: roleName}).then(role => {
            if (!role) {
                return false;
            }
            //this roles(ролята с която съм влязал в момента)
            let isInRole = this.roles.indexOf(role.id) !== -1;
            return isInRole;
        })
    },
    prepareDelete: function () {
    for (let role of this.roles) {
        Role.findById(role).then(role => {
            role.users.remove(this.id);
            role.save();
        })
    }
    let Article = mongoose.model('Article');
        for (let article of this.articles) {
            Article.findById(article).then(article => {
                article.prepareDelete();
                article.remove();
            })
        }
    },
});

//създаваме модел User който използва пропъртитата на userSchema
const User = mongoose.model('User', userSchema);
//правим User глобално
module.exports = User;

module.exports.seedAdmin = () => {
    let email = 'admin@softuni.bg';

    //търся в базата има ли такъв User и ако има неправя нищо ако няма ->
    User.findOne({email: email}).then(admin => {
        //питаме базата имаме ли потребител с служебния емайл, то ест няма и си го създавам
        if(!admin) {
            Role.findOne({name: 'Admin'}).then(role => {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword('admin', salt);

                let roles = [];
                roles.push(role.id);

                let user = {
                    email: email,
                    passwordHash: passwordHash,
                    fullName: 'Admin',
                    articles: [],
                    salt: salt,
                    roles: roles
                };

                User.create(user).then(user => {
                    role.users.push(user.id);
                    role.save(err => {
                        if(err) {
                            console.log(err.message);
                        } else {
                            console.log('Admin seeded successfully')
                        }
                    });
                })
            })
        }
    })
};







