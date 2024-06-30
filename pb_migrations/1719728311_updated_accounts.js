/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gg0b0totbwlzr64")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rjil6m2l",
    "name": "friend_requests",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "gg0b0totbwlzr64",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gg0b0totbwlzr64")

  // remove
  collection.schema.removeField("rjil6m2l")

  return dao.saveCollection(collection)
})
