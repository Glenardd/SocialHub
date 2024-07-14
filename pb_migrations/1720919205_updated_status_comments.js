/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o42sawliwxy2szc")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "puaahqox",
    "name": "post_assigned",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "fja2d6oovoyjp74",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o42sawliwxy2szc")

  // remove
  collection.schema.removeField("puaahqox")

  return dao.saveCollection(collection)
})
