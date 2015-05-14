var Waterline = require('waterline'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    express = require('express'),
    bcrypt = require('bcrypt'),
    DiskAdapter = require('sails-disk');


function hashPassword(password, cb) {
    bcrypt.genSalt(12, function (err, salt) {
        if (err) return cb(err);
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) return cb(err);
            password = salt + '##' + hash;
            cb(null, password);
        });
    });
}

var User = Waterline.Collection.extend({
    identity: 'user',
    connection: 'disk',
    attributes: {
        username: {
            type: 'string',
            required: true,
            minLength: 5,
            maxLength: 32,
            unique: true
        },
        password: {
            type: 'string',
            minLength: 2
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        },

        authenticate: function (password, cb) {
            var parts = this.password.split('##');
            bcrypt.hash(password, parts[0], function (err, hash) {
                if (!err && hash === parts[1]) {
                    cb(null);
                } else {
                    cb(new Error('Incorrect password'));
                }
            });
        }
    },

    beforeCreate: function (values, cb) {
        // ensure the username doesn't already exist
        this.findOne().where({username: values.username}).exec(function (err, user) {
            if (user) {
                cb(new Error("User already exists"));
            } else {
                hashPassword(values.password, function (err, password) {
                    if (err) return cb(err);
                    values.password = password;
                    cb();
                });
            }
        });
    },

    beforeUpdate: function (values, cb) {
        if (values.password) {
            hashPassword(values.password, function (err, password) {
                if (err) return cb(err);
                values.password = password;
                cb();
            });
        }
    }
});


var router = express.Router();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(methodOverride());

router.post('/login', function (req, res) {
    var username = req.body.username,
        password = req.body.password;

    if (!username || !password) {
        return res.status(401).json({error: "Invalid parameters"});
    }

    req.app.models["user"].findOne().where({username: username}).exec(function (err, user) {
        if (err || !user) return res.status(404).json({error: 'Did not match any records'});
        user.authenticate(password, function (err) {
            if (err) return res.status(401).json({error: err.message});
            // TODO add to session
            return res.json({user: user});
        });
    });
});


router.all('/logout', function (req, res) {
    // TODO destroy the session
    //delete req.session.uid;
    return res.status(200).send();
});

var orm = new Waterline();

var dbConfig = {
    adapters: {
        disk: DiskAdapter
    },
    connections: {
        disk: {
            adapter: 'disk'
        }
    },
    defaults: {
        migrate: 'alter'
    }
};

module.exports = function (app) {
    orm.loadCollection(User);
    orm.initialize(dbConfig, function (err, models) {

        // on a reload the collections will already be registered, so use them
        var collections = err ? orm.collections : models.collections;
        if (collections) {
            app.models = collections;

            // FIXTURE...
            app.models["user"].create({username: 'letme', password: 'in'}, function (err, user) {
            });
        }
    });

    app.use('/api', router);
};