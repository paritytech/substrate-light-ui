// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Dexie from 'Dexie';
import IDBExportImport from 'indexeddb-export-import';
import FileSaver from 'file-saver';

var db = new Dexie("Kusama CC3", 1);

// db.version(1);

// db.version(1).stores({
// 	things : "id++, thing_name, thing_description",
// });

db.open().then(function() {
	var idb_db = db.backendDB(); // get native IDBDatabase object from Dexie wrapper

	// export to JSON, clear database, and import from JSON
	IDBExportImport.exportToJsonString(idb_db, function(err, jsonString) {
		if(err)
			console.error(err);
		else {
      console.log("Exported as JSON: " + jsonString.slice(0, 10));

      const blob = new Blob([JSON.stringify(jsonString)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, 'kusama-wasm-light-idb.json');
      
      // TODO: put this import script into light-apps
			// IDBExportImport.clearDatabase(idb_db, function(err) {
			// 	if(!err) // cleared data successfully
			// 		IDBExportImport.importFromJsonString(idb_db, jsonString, function(err) {
			// 			if (!err)
			// 				console.log("Imported data successfully");
			// 		});
			// });
		}
	});
}).catch(function(e) {
	console.error("Could not connect. " + e);
});