/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o42sawliwxy2szc")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kbx1jnr4",
    "name": "user_likes",
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
  const collection = dao.findCollectionByNameOrId("o42sawliwxy2szc")

  // remove
  collection.schema.removeField("kbx1jnr4")

  return dao.saveCollection(collection)
})
