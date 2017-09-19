function onDeviceReady_db () {
    db = new PouchDB("condominus", {adapter: "websql"})

    db.upsert = function (id, data, callback, err) {
        db.get(id).then(function (doc) {
            return db.put(Object.assign({
                _id: id,
                _rev: doc._rev
            }, data))
        }).then(function (response) {
            console.log(response)
        }).catch(function (err) {
            if (err.status == 404) {
                return db.put(Object.assign({
                    _id: id
                }, data))
            }
        })
    }

    db.get4User = function (id, user, callback) {
        return db.get(id + user)
    }

    db.upsert4User = function (id, user, data, callback) { 
        return db.upsert(id + user, data, callback)
    }
}
