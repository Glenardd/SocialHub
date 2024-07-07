/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fja2d6oovoyjp74")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "usepbuwg",
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
  const collection = dao.findCollectionByNameOrId("fja2d6oovoyjp74")

  // remove
  collection.schema.removeField("usepbuwg")

  return dao.saveCollection(collection)
})
