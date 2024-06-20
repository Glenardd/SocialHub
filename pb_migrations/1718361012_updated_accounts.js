/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gg0b0totbwlzr64")

  // remove
  collection.schema.removeField("lsbcya0g")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gg0b0totbwlzr64")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lsbcya0g",
    "name": "status",
    "type": "relation",
    "required": true,
    "presentable": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": 1,
      "maxSelect": 3,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
