var app = angular.module('webapp.services', []);

app.factory('IndexedDB', function ($q) {

    // Je nach Browser speichern der IndexedDB

    var mydbCache = {};
    var dbInstances = {};

    // Datenbank öffnen
    function openInstance(dbName) {
        if (dbInstances[dbName]) {
            return $q.when(dbInstances[dbName]);
        }

        var d = $q.defer();
        var indexedDB;

        // Je nach Browser speichern der IndexedDB
        if (window.indexedDB) {
            indexedDB = window.indexedDB
        } else if (window.webkitIndexedDB) {
            indexedDB = window.webkitIndexedDB;
        } else if (window.mozIndexedDB) {
            indexedDB = window.mozIndexedDB;
        }

        // Datenbank öffnen oder erstellen(falls noch nicht vorhanden)

        var openDB = indexedDB.open(dbName, 1);
        // Falls noch nicht vorhanden
        openDB.onupgradeneeded = function () {
            console.log('Datenbank angelegt');
            var myDB = this.result;
            if (!myDB.objectStoreNames.contains(dbName)) {
                store = myDB.createObjectStore(dbName, {
                    keyPath: 'id',
                    autoIncrement: true
                });
            }

            mydbCache[dbName] = myDB;
        };

        // Bei Erfolg Globale Variable myDB überschreiben
        openDB.onsuccess = function () {
            console.log('Datenbank geöffnet');
            mydbCache[dbName] = this.result;
            d.resolve(createInstance(dbName));
        }

        openDB.onerror = function () {
            return alert('Fehler beim erstellen der Datenbank');
        }

        return d.promise;
    }

    //creates an instace for specific dbName
    function createInstance(dbName) {
        var myDB = mydbCache[dbName];
        dbInstances[dbName] = {
        // Listen Datenbank
            // Liste hinzufuegen
            addList: function (title) {
                var r = $q.defer();
                // Transaction auswählen
                var trans = myDB.transaction([dbName], 'readwrite');
                trans.oncomplete = function (event) {
                    console.log('Liste hinzugefügt');
                    r.resolve(event);
                }
                trans.onerror = function (event) {
                    console.log(event);
                    r.reject(event);
                }

                // ObejectStore auswählen
                var objectStore = trans.objectStore(dbName);
                // Antwort
                var request = objectStore.add({
                    title: title,
                    mat: []
                });

                return r.promise;
            },

            // Alle Listen aus DB auslesen
            getLists: function () {
                var defer = $q.defer();

                //defer async result
                var listResult = [];

                // Transaction auswählen
                var trans = myDB.transaction([dbName], 'readonly');
                // ObejectStore auswählen
                var objectStore = trans.objectStore(dbName);
                // Cursor für alle Einträge von 0 bis zum Ende
                var range = IDBKeyRange.lowerBound(0);
                var cursorRequest = objectStore.openCursor(range);

                cursorRequest.onsuccess = function (event) {
                    var cursorResult = event.target.result;

                    if (!cursorResult) { //auflöse promise, wenn cursor am Ende, oder wenn es nicht existiert
                        defer.resolve(listResult); //listResult ist dann in then-Methode verfügbar
                    } else {

                        listResult.push(cursorResult.value)

                        // Cursor zum nächsten Eintrag bewegen
                        cursorResult.continue();
                    }
                }

                cursorRequest.onerror = function (event) {
                    console.log(event);
                    defer.reject('error occurs on cursorRequest');
                }

                return defer.promise;
            },

            // Eine Liste mit ID abrufen
            getSingleList: function (id) {
                var s = $q.defer();
                //TODO
                // Transaction auswählen
                var trans = myDB.transaction([dbName], 'readonly');
                // ObejectStore auswählen
                var objectStore = trans.objectStore(dbName);
                // Cursor für alle Einträge von 0 bis zum Ende
                var range = IDBKeyRange.only(id);
                var cursorRequest = objectStore.openCursor(range);

                cursorRequest.onsuccess = function (event) {
                    var cursorResult = event.target.result;

                    if (cursorResult) {
                        s.resolve(cursorResult.value); //listResult ist dann in then-Methode verfügbar
                    }
                }

                cursorRequest.onerror = function (event) {
                    console.log(event);
                    s.reject('error occurs on cursorRequest');
                }

                return s.promise;
            },

            // Eine Liste löschen
            deleteList: function (id) {
                // Transaction auswählen
                var trans = myDB.transaction([dbName], 'readwrite');
                // ObejectStore auswählen
                var objectStore = trans.objectStore(dbName);
                // Eintrag löschen
                var request = objectStore.delete(id);
                // Bei Erfolg
                request.onsuccess = function (evt) {
                    console.log('Eintrag ' + id + ' gelöscht');
                }
            },

            // Eine Liste updaten
            updateList: function (value) {
                var s = $q.defer();

                // Transaction auswählen
                var trans = myDB.transaction([dbName], 'readwrite');
                // ObejectStore auswählen
                var objectStore = trans.objectStore(dbName);
                // Eintrag löschen
                var request = objectStore.put(value);
                // Bei Erfolg
                request.onsuccess = function (evt) {
                    s.resolve(
                        console.log('Eintrag gesichert')
                    )
                }

                return s.promise;
            },

        // Settings Datenbank

            // Settings auslesen
            getSettings: function () {
                var defer = $q.defer();

                //defer async result
                var result = [];

                // Transaction auswählen
                var trans = myDB.transaction([dbName], 'readonly');
                // ObejectStore auswählen
                var objectStore = trans.objectStore(dbName);
                // Cursor für alle Einträge von 0 bis zum Ende
                var range = IDBKeyRange.lowerBound(0);
                var cursorRequest = objectStore.openCursor(range);

                cursorRequest.onsuccess = function (event) {
                    var cursorResult = event.target.result;

                    if (!cursorResult) { //auflöse promise, wenn cursor am Ende, oder wenn es nicht existiert
                        defer.resolve(result); //listResult ist dann in then-Methode verfügbar
                    } else {

                        result.push(cursorResult.value)

                        // Cursor zum nächsten Eintrag bewegen
                        cursorResult.continue();
                    }
                }

                cursorRequest.onerror = function (event) {
                    console.log(event);
                    defer.reject('error occurs on cursorRequest');
                }

                return defer.promise;
            },

            // Settings speichern
            saveSettings: function (id, name, vorname, kfz, empfaenger) {
                var r = $q.defer();
                // Transaction auswählen
                var trans = myDB.transaction([dbName], 'readwrite');
                trans.oncomplete = function (event) {
                    console.log('Settings gespeichert');
                    r.resolve(event);
                }
                trans.onerror = function (event) {
                    console.log(event);
                    r.reject(event);
                }

                // ObejectStore auswählen
                var objectStore = trans.objectStore(dbName);
                // Antwort
                var request = objectStore.put({
                    id: id,
                    name: name,
                    vorname: vorname,
                    kfz: kfz,
                    empfaenger: empfaenger
                });

                return r.promise;
            },
        };

        return dbInstances[dbName];
    }

    //Public methods for factory
    return {
        openInstance: openInstance
    }

});

app.factory('AuthService', function ($http, $q) {
    var user = {};
    user.uid = false;

    return {
        user: user
    }
});