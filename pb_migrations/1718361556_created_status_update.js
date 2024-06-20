/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "fja2d6oovoyjp74",
    "created": "2024-06-14 10:39:16.553Z",
    "updated": "2024-06-14 10:39:16.553Z",
    "name": "status_update",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "urjckj8n",
        "name": "text_message",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "rhicp1vi",
        "name": "date",
        "type": "date",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("fja2d6oovoyjp74");

  return dao.deleteCollection(collection);
})
