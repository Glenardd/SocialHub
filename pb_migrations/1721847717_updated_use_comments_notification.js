/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("id19yse2owchw4r")

  collection.name = "user_comments_notification"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("id19yse2owchw4r")

  collection.name = "use_comments_notification"

  return dao.saveCollection(collection)
})
