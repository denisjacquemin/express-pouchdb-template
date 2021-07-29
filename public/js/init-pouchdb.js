var remoteDB = new PouchDB('http://admin:123456@localhost:5984/new-invoice');
var localDB = new PouchDB('new-invoice');


localDB.sync(remoteDB, {
    live: true,
    retry: true
});