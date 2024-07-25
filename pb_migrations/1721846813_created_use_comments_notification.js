/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "id19yse2owchw4r",
    "created": "2024-07-24 18:46:53.586Z",
    "updated": "2024-07-24 18:46:53.586Z",
    "name": "use_comments_notification",
    "type": "base",
    "system": false,
    "schema": [
      {
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
  const collection = dao.findCollectionByNameOrId("id19yse2owchw4r");

  return dao.deleteCollection(collection);
})
