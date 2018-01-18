

function onDeviceReady_db () {
    db = new PouchDB("nidux", {adapter: "websql"})
    db._pouchDBBusy  = false
    
    db.upsert = function (id, data, callback, err) {
        db.get(id).then(function (doc) {
            return db.put(Object.assign({
                _id: id,
                _rev: doc._rev
            }, data))
        }).then(function (response) {
            if (typeof  callback == "function") callback()
        }).catch(function (err) {
            if (err.status == 404) {
                return db.put(Object.assign({
                    _id: id
                }, data)).then(function (response) {
                   if (typeof  callback == "function") callback()
                })
            }
        })
    }

    db.upsertPll = function (id, data, callback, err) {
        var cycles = 0
        concurentWait(
            function(){
                cycles++
                return !db._pouchDBBusy || cycles > 500
            },
            function(){
                db._pouchDBBusy = true
                db.upsert(id, data, function(){
                    setTimeout(function(){ db._pouchDBBusy = false;  if (typeof  callback == "function") callback() },100)
                }, err)
            }
        )
    }

    db.get4User = function (id, user, callback) {
        return db.get(id + user)
    }

    db.upsert4User = function (id, user, data, callback) { 
        return db.upsert(id + user, data, callback)
    }
}
