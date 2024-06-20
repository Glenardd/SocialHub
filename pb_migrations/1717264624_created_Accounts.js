/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "42bwe5xhyy5isal",
    "created": "2024-06-01 17:57:04.659Z",
    "updated": "2024-06-01 17:57:04.659Z",
    "name": "Accounts",
    "type": "base",
    "system": false,
    "schema": [
      {
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
  const collection = dao.findCollectionByNameOrId("42bwe5xhyy5isal");

  return dao.deleteCollection(collection);
})
