const { v4: uuidv4 } = require('uuid');


const nano = require('nano')('http://admin:123456@localhost:5984')
const usersDB = nano.use('_users');

// async function test(sql, params) {
//     let info = await db.info();

//     const documents = [{ denis: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }]
//     return db.bulk({ docs: documents })
// }

async function createUser(creds) {

    // https://docs.couchdb.org/en/latest/intro/security.html?highlight=org.couchdb.user#creating-a-new-user

    const user = {
        _id: "org.couchdb.user:" + creds.username,
        name: creds.username,
        roles: [],
        type: "user",
        password: creds.password
    };


    return usersDB.insert(user)
}

async function createDB(username) {

    // https://docs.couchdb.org/en/latest/api/database/common.html#put--db
    // Creates a new database. The database name {db} must be composed by following next rules:

    // Name must begin with a lowercase letter (a-z)
    // Lowercase characters (a-z)
    // Digits (0-9)
    // Any of the characters _, $, (, ), +, -, and /.
    // If you’re familiar with Regular Expressions, the rules above could be written as ^[a-z][a-z0-9_$()+/-]*$.

    const dbname = 'u_' + username.replace(/[^a-z0-9_$()+\/-]/g, '') + '_' + uuidv4();

    nano.db.create(dbname).then(function(res) {

        const secObj = {
            admins: {
                names: [],
                roles: []
            },
            members: {
                names: [username],
                roles: []
            }
        };

        const newDB = nano.use(dbname)

        // Define username as a member for the new db
        // members: they can read all types of documents from the DB, and they can write (and edit) documents to the DB except for design documents

        newDB.insert(secObj, "_security").catch(function(err) {
            log('[_security.insert] for ' + dbname + ' :', err.message);
        });

    }).catch(function(err) {
        console.log(err);
    });
}


module.exports = { nano, usersDB, createUser, createDB }