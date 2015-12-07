var app = angular.module('webapp.services', []);

app.factory('IndexedDB', function ($q) {

    var dbCache = {};
    // Je nach Browser speichern der IndexedDB

    // Datenbank öffnen
    function openInstance(dbName) {
        var d = $q.defer();

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
            dbCache[dbName] = myDB;
        };

        // Bei Erfolg Globale Variable myDB überschreiben
        openDB.onsuccess = function () {
            console.log('Datenbank geöffnet');
            dbCache[dbName] = this.result;
            d.resolve(createInstance(dbName));
        }

        openDB.onerror = function () {
            return alert('Fehler beim erstellen der Datenbank');
        }

        return d.promise;
    }


    //creates an instace for specific dbName
    function createInstance(dbName) {

        var myDB = dbCache[dbName];
        return {

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
                        listResult.push(cursorResult.value);

                        // Cursor zum nächsten Eintrag bewegen
                        cursorResult.continue();
                    }
                };


                cursorRequest.onerror = function (event) {
                    console.log(event);
                    defer.reject('error occurs on cursorRequest');
                };

                return defer.promise;
            },

            // Eine Liste mit ID abrufen
            getSingleList: function (id) {

                var s = $q.defer();

                // Transaction auswählen
                var trans = myDB.transaction([dbName], 'readonly');

                // ObejectStore auswählen
                var objectStore = trans.objectStore('listen');

                // Cursor für alle Einträge von 0 bis zum Ende
                var range = IDBKeyRange.only(id);
                var cursorRequest = objectStore.openCursor(range);

                cursorRequest.onsuccess = function (event) {
                    var cursorResult = event.target.result;

                    if (cursorResult) {
                        s.resolve(cursorResult); //listResult ist dann in then-Methode verfügbar
                    }
                };

                cursorRequest.onerror = function (event) {
                    console.log(event);
                    s.reject('error occurs on cursorRequest');
                };

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
            }
        }
    }

    //Public methods for factory
    return {
        openInstance: openInstance
    }

});
