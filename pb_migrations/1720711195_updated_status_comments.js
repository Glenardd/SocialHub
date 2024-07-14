/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o42sawliwxy2szc")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oszdj7tq",
    "name": "comment",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o42sawliwxy2szc")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oszdj7tq",
    "name": "comments",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
