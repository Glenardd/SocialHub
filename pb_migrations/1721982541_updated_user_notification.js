/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oqbz16ic64mwdth")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tpv4v1o0",
    "name": "comment_reacted",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "o42sawliwxy2szc",
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
  collection.schema.removeField("tpv4v1o0")

  return dao.saveCollection(collection)
})
