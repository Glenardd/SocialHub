/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gg0b0totbwlzr64")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tmhnzpsx",
    "name": "isOnline",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gg0b0totbwlzr64")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tmhnzpsx",
    "name": "isLogged",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
