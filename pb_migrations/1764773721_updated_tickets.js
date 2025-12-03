/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3306545694")

  // remove field
  collection.fields.removeById("editor18589324")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "select2638274075",
    "maxSelect": 1,
    "name": "topic",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "SIM-Karte",
      "Hardware Austausch",
      "Sonstiges"
    ]
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text18589324",
    "max": 0,
    "min": 0,
    "name": "notes",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3306545694")

  // add field
  collection.fields.addAt(8, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor18589324",
    "maxSize": 0,
    "name": "notes",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  // remove field
  collection.fields.removeById("select2638274075")

  // remove field
  collection.fields.removeById("text18589324")

  return app.save(collection)
})
