/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gg0b0totbwlzr64")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dcdotppe",
    "name": "field",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "fja2d6oovoyjp74",
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
  collection.schema.removeField("dcdotppe")

  return dao.saveCollection(collection)
})
