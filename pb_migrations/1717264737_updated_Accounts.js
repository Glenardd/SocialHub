/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("42bwe5xhyy5isal")

  collection.name = "accounts"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ld6vn4ma",
    "name": "password",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wwx6i3yg",
    "name": "username",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("42bwe5xhyy5isal")

  collection.name = "Accounts"

  // remove
  collection.schema.removeField("ld6vn4ma")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wwx6i3yg",
    "name": "Username",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
