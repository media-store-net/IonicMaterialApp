var app = angular.module('webapp.services', []);

app.factory('listenDB', function ($q) {

    var myDB = {};

// Je nach Browser speichern der IndexedDB

    return {
        // Datenbank öffnen
        openDB: function () {
            var d = $q.defer();


            if (window.indexedDB) {
                indexedDB = window.indexedDB
            }
            else if (window.webkitIndexedDB) {
                indexedDB = window.webkitIndexedDB;
            }
            else if (window.mozIndexedDB) {
                indexedDB = window.mozIndexedDB;
            }

// Datenbank öffnen oder erstellen(falls noch nicht vorhanden)

            var openDB = indexedDB.open('listen', 1);
// Falls noch nicht vorhanden
            openDB.onupgradeneeded = function () {
                console.log('Datenbank angelegt');
                var myDB = this.result;
                if (!myDB.objectStoreNames.contains('listen')) {
                    store = myDB.createObjectStore('listen', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                }
            };

// Bei Erfolg Globale Variable myDB überschreiben
            openDB.onsuccess = function () {
                console.log('Datenbank geöffnet');
                myDB = this.result;
                d.resolve(myDB);
            }

            openDB.onerror = function () {
                return alert('Fehler beim erstellen der Datenbank');
            }

            return d.promise;
        },

        // Liste hinzufuegen
        addList: function (title) {
            var r = $q.defer();
            // Transaction auswählen
            var trans = myDB.transaction(['listen'], 'readwrite');
            trans.oncomplete = function (event) {
                console.log('Liste hinzugefügt');
                r.resolve(event);
            }
            trans.onerror = function (event) {
                console.log(event);
                r.reject(event);
            }

            // ObejectStore auswählen
            var objectStore = trans.objectStore('listen');
            // Antwort
            var request = objectStore.add({title: title});

            return r.promise;
        },

        // Alle Listen aus DB auslesen
        getLists: function () {
            var defer = $q.defer();

            //defer async result
        var listResult = [];

        // Transaction auswählen
        var trans = myDB.transaction(['listen'], 'readonly');
        // ObejectStore auswählen
        var objectStore = trans.objectStore('listen');
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

        // Eine Liste löschen
        deleteList: function (id) {
            // Transaction auswählen
            var trans = myDB.transaction(['listen'], 'readwrite');
            // ObejectStore auswählen
            var objectStore = trans.objectStore('listen');
            // Eintrag löschen
            var request = objectStore.delete(id);
            // Bei Erfolg
            request.onsuccess = function (evt) {
                console.log('Eintrag ' + id + ' gelöscht');
            }
        }
    }

});
