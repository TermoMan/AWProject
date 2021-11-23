const express = require("express");
const router = express.Router();
const path = require("path");
const nconf = require("nconf");
const fs = require("fs-extra");
const crypto = require("crypto");

const collectionController = require("../controllers/collectionController");
const usersController = require("../controllers/userController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination = path.resolve(nconf.get("web:collection:image:path"));
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination);
    }
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    cb(null, "collection_" + Date.now() + ".jpg");
  },
});

function fileFilter(req, file, cb) {
  var ext = path.extname(file.originalname);
  if (
    file.mimetype !== "image/jpeg" ||
    (ext.toLowerCase() != ".jpg" && ext.toLowerCase() != ".jpeg")
  ) {
    return cb(
      null,
      false,
      new Error("ERROR: La extensión de la imagen es distinta de JPG")
    );
  }
  cb(null, true);
}

const multerFactory = multer({
  storage,
  fileFilter,
  limits: { fileSize: nconf.get("web:collection:image:size") },
});
const env = (process.env.NODE_ENV || "dev").trim();
if (env != "test") {
  router.use(usersController.logged);
}
router.get("/create", collectionController.createCollection);

router.post(
  "/create",
  multerFactory.single("filename"),
  collectionController.insertCollection
);

const storageItem = multer.diskStorage({
  destination: path.resolve(nconf.get("web:collection_item:image:path")),
  filename: (req, file, cb) => {
    const random = crypto.randomBytes(8).toString("hex");
    const name = `collection_item_${Date.now()}_${random}.jpg`;
    cb(null, name);
  },
});

const multerFactoryItem = multer({ storage: storageItem });

router.get("/:idCollection/create", collectionController.createCollectionItem);

router.post(
  "/:idCollection/create",
  multerFactoryItem.array("filename", 5),
  collectionController.insertCollectionItem
);

router.get("/", collectionController.listUserCollections);
router.get("/getImage/:image", collectionController.getImage);
router.post("/deleteCollection/:id", collectionController.deleteCollection);
router.get("/:collectionId", collectionController.listCollectionItems);
router.get("/getItemImage/:image", collectionController.getItemImage);
router.get("/viewItem/:itemId", collectionController.viewItemDetails);
router.get("/deleteItem/:id", collectionController.deleteItem);
router.get("/:collectionId/public", collectionController.filterByPublicItems);
router.post("/filterByName", collectionController.getItemName);
router.get("/:collectionId/name/:itemName", collectionController.filterItemsByName);


module.exports = router;
