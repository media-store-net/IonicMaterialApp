/**
 * Created by Artur on 02.11.2015.
 */

jQuery(document).ready(function ($) {

// @todo Register Database
// Globale Variable myDB
    var myDB;

// Je nach Browser speichern der IndexedDB

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

    var request = indexedDB.open('listen', 1);
// Falls noch nicht vorhanden
    request.onupgradeneeded = function () {
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
    request.onsuccess = function () {
        console.log('Datenbank geöffnet');
        myDB = this.result;

    }

    request.onerror = function () {
        alert('Fehler beim erstellen der Datenbank');
    }

// Liste hinzufuegen
    function addList(title) {
        // Transaction auswählen
        var trans = myDB.transaction(['listen'], 'readwrite');
        trans.oncomplete = function (event) {
            console.log('Liste hinzugefügt');
        }
        trans.onerror = function (event) {
            console.log(event);
        }

        // ObejectStore auswählen
        var objectStore = trans.objectStore('listen');
        // Antwort
        var request = objectStore.add({title: title});

    }

// Alle Listen anzeigen
    function allListsView(param) {
        var listObject = [];
        // Transaction auswählen
        var trans = myDB.transaction(['listen'], 'readonly');
        // ObejectStore auswählen
        var objectStore = trans.objectStore('listen');
        // Cursor für alle Einträge von 0 bis zum Ende
        var range = IDBKeyRange.lowerBound(0);
        var cursorRequest = objectStore.openCursor(range);

        cursorRequest.onsuccess = function (event) {
            var result = event.target.result;

            if (result) {
                listObject.push(result.value);
                result.continue();


                /*switch (param) {

                 case 'single' :
                 // Anzeige der Listendetails
                 anzeige = '<li>' + listObject.title + '</li>';
                 listObject.continue();
                 break;


                 case 'list' :
                 // Anzeige aller Listen
                 anzeige = '<li>' + result.value.title + '</li>';
                 result.continue();
                 break;

                 default:
                 // Standard
                 var anzeige = '<li>' + listObject.title + '</li>';
                 listObject.continue();
                 break;
                 }*/
            }

            return listObject;

        }

        cursorRequest.onerror = function (event) {
            console.log(event);
        }

        setTimeout(function () {
            var anzeige='';

            $.each(listObject , function(index, data){

                anzeige += '<li>' + data.title + '</li>';

                return anzeige;
            });

            $('#listBody p').remove();
            $('#allLists').append(anzeige);

        }, 40);

    }


//@todo Index.html

    // Neue Liste - Button -> Link zu listen.html
    $('#addListButton').bind('tap', function () {
        $(':mobile-pagecontainer').pagecontainer("change", "listen.html", {role: "page"});
        $(":mobile-pagecontainer").on("pagecontainershow", function () {
            $('#addListForm').popup('open');
        });
    });

//@todo login.html

//@todo listen.html

    // Alle Listen anzeigen
    $(":mobile-pagecontainer").on("pagecontainershow", function () {
        if ($('#allLists').length) {
            allListsView('list');
        }
    });


    // Button Neue Liste
    $(":mobile-pagecontainer").on("pagecontainershow", function () {
        $('#addListButton2').bind('tap', function () {
            $('#addListForm').popup('open');
        });
    });


    $(":mobile-pagecontainer").on("pagecontainershow", function () {
        $('form#addList').submit(function () {
            var title = $('#newList').val();
            var added = addList(title);
        });
    });

//@todo liste.html

//@todo Database

//@todo Helper

});