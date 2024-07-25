/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("id19yse2owchw4r")

  // remove
  collection.schema.removeField("ox5kjnyu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5kkgoexf",
    "name": "text_comment",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jcbvotju",
    "name": "user_commented",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "gg0b0totbwlzr64",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "twrupdjs",
    "name": "post_commented",
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
  const collection = dao.findCollectionByNameOrId("id19yse2owchw4r")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ox5kjnyu",
    "name": "comment_status",
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

  // remove
  collection.schema.removeField("5kkgoexf")

  // remove
  collection.schema.removeField("jcbvotju")

  // remove
  collection.schema.removeField("twrupdjs")

  return dao.saveCollection(collection)
})
