const RandExp = require("randexp");
const bcrypt = require('bcryptjs');
const merge = require('lodash.merge');


// Nano supports making requests using CouchDB's cookie authentication functionality. If you initialise Nano so that it is cookie-aware, you may call nano.auth first to get a session cookie. Nano will behave like a web browser, remembering your session cookie and refreshing it if a new one is received in a future HTTP response.
const nano = require('nano')({
    url: 'http://admin:123456@localhost:5984',
    requestDefaults: {
        jar: true // enable cookie authentication functionality
    }
});

const usersDB = nano.use('_users');

// async function test(sql, params) {
//     let info = await db.info();

//     const documents = [{ denis: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }]
//     return db.bulk({ docs: documents })
// }

function buildUserId(username) {
    return "org.couchdb.user:" + username;
}



function addDBToUSer(username, dbname) {

    return new Promise(function(resolve, reject) {

        let user = usersDB.find({ // first check if username already exist
            selector: {
                name: {
                    $eq: username
                }
            },
            fields: ["name"]
        })

        .then(function(results) {

            if (results.bookmark !== 'nil') {
                reject({ error: 'USER_NOT_FOUND', message: 'User not found' });
            }

            const databases = user.docs[0].databases.push(dbname);
            db.insert({ databases, "_rev": user.docs[0].rev }, user.docs[0]._id)


        });
    });
}

function createUser(creds) {
    // https://docs.couchdb.org/en/latest/intro/security.html?highlight=org.couchdb.user#creating-a-new-user
    // https://github.com/EranGrin/couchDB-Node-Passport-Login/blob/005c657b2766eb62a35cbdbf45ded7dd3c11a812/routes/users.js

    const user = {
        _id: buildUserId(creds.username),
        name: creds.username,
        roles: [],
        type: "user",
        created_at: new Date().toISOString(), // https://medium.com/@glynn_bird/date-formats-for-apache-couchdb-and-cloudant-1c017b7b878b
        password: creds.password
    };

    return new Promise(function(resolve, reject) {

        usersDB.find({ // first check if username already exist
            selector: {
                name: {
                    $eq: creds.username
                }
            },
            fields: ["name"]
        })

        .then(function(results) {

            if (results.bookmark !== 'nil') {
                throw new Error('User already exist');
            }

            // curl - X PUT http: //admin:123456@localhost:5984/_users/org.couchdb.user:denis \
            //     -H "Accept: application/json"\ -
            //     H "Content-Type: application/json"\ -
            //     d '{"name": "denis", "password": "apple", "roles": [], "type": "user"}

            bcrypt.hash(user.password, 10, function(err, hash) {
                // Store hash in your password DB.
                if (err) reject(err.message);
                try {
                    user.password = hash;
                    usersDB.insert(user);
                    resolve(user);
                } catch (err) {
                    reject(err);
                }
            });


        })

        .catch(function(err) {
            reject(err);
        })
    });
}


function addDBPermissions(
    dbname,
    user,
    admins = {
        names: [],
        roles: []
    },
    members = {
        names: [],
        roles: []
    }
) {

    const secObj = {
        admins: admins,
        members: members
    }


    return new Promise(function(resolve, reject) {
        const db = nano.use(dbname)
            // Define username as a member for the new db
            // members: they can read all types of documents from the DB, and they can write (and edit) documents to the DB except for design documents

        db.get("_security")

        .then(function(permissions) {
            db.insert(merge(permissions, secObj), "_security")
            resolve({ user, dbname })
        })

        .catch(function(err) {
            reject(err);
        })
    });

}


function linkUserToDB(user, dbname) {

    return new Promise(function(resolve, reject) {
        console.log('then linkUserToDB');

        const usersDB = nano.use('_users');

        usersDB.find({
            selector: {
                name: {
                    $eq: user.name
                }
            },
            // fields: ["name", "_rev"]
        })

        .then(function(results) {
            if (results.bookmark === 'nil') {
                throw new Error('User not found');
            }

            user = results.docs[0];
            user['databases'] = Array.from(new Set([dbname].concat(user.databases || [])))
            usersDB.insert(user)
            resolve({ user, dbname })
        })

        .catch(function(err) {
            reject(err);
        })
    });
};

function createDB(user) {

    // https://docs.couchdb.org/en/latest/api/database/common.html#put--db
    // Creates a new database. The database name {db} must be composed by following next rules:

    // Name must begin with a lowercase letter (a-z)
    // Lowercase characters (a-z)
    // Digits (0-9)
    // Any of the characters _, $, (, ), +, -, and /.
    // If you’re familiar with Regular Expressions, the rules above could be written as ^[a-z][a-z0-9_$()+/-]*$.

    const randexp = new RandExp(/^[a-z][a-z0-9_$()+/-]*$/);
    const dbname = randexp.gen();

    return new Promise(function(resolve, reject) {

        nano.db.create(dbname)

        .then(function(res) {
            return resolve({ user, dbname });
        })

        .catch(function(err) {
            return reject(err);
        });
    });
}

module.exports = { nano, usersDB, buildUserId, createUser, createDB, addDBPermissions, linkUserToDB }