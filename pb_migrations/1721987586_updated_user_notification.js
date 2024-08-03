/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oqbz16ic64mwdth")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "t7bmtd6p",
    "name": "comment_reacted_post",
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
  const collection = dao.findCollectionByNameOrId("oqbz16ic64mwdth")

  // remove
  collection.schema.removeField("t7bmtd6p")

  return dao.saveCollection(collection)
})
