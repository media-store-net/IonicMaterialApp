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
function getAllLists(param) {
  //defer async result
  var deferred = Promise.defer();

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
      deferred.resolve(listResult); //listResult ist dann in then-Methode verfügbar
    } else {
      /*switch (param) {

          case 'single' :
              // Anzeige der Listendetails
              var listObject = '<li>' + result.value + '</li>';
              result.continue();
              break;


          case 'list' :
              // Anzeige aller Listen
              var listObject = '<li>' + result.value.title + '</li>';
              result.continue();
              break;

          default:
              // Standard
              var listObject = '<li>' + result.value + '</li>';
              result.continue();
              break;

          return listObject;
      }*/


      listResult.push(cursorResult.value)

      // Cursor zum nächsten Eintrag bewegen
      cursorResult.continue();
    }
  }

  cursorRequest.onerror = function (event) {
    console.log(event);
    deferred.reject('error occurs on cursorRequest');
  }

  return deferred.promise;
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
        var $allLists = $('#allLists');
        var $noListsExistsMsg = $('#noListsExistsMsg');

        $allLists.children().remove();
        $noListsExistsMsg.removeClass('notVisible');

        getAllLists('list').then(function (list) {
          list.forEach(function (item) {
            $allLists.append('<li>' + item.id + ': ' + item.title + '</li>');
          });


          if(list.length > 0) {
            $noListsExistsMsg.addClass('notVisible');
          }

        });
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

})
;
