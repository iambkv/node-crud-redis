const express = require("express");
const usersController = require("../controllers/userController");

const router = express.Router();

router.get("/fetch/all", usersController.getAll);

router.post("/create", usersController.createUser);

router.get("/fetch/:id", usersController.getAUser);

router.put("/update/:id", usersController.updateAUser);

router.delete("/delete/:id", usersController.deleteAUser);

module.exports = router;
