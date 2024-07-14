/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fja2d6oovoyjp74")

  // remove
  collection.schema.removeField("tbr0ra4w")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fja2d6oovoyjp74")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tbr0ra4w",
    "name": "comments",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "o42sawliwxy2szc",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
