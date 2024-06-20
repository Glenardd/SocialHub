/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("42bwe5xhyy5isal")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "z5pm6skn",
    "name": "isLogged",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("42bwe5xhyy5isal")

  // remove
  collection.schema.removeField("z5pm6skn")

  return dao.saveCollection(collection)
})
