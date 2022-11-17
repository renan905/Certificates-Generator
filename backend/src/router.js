const express = require("express");
const router = express.Router();

const login = require("./middleware/login");
const UserController = require("./controllers/UserController");

router.use("/certificates", require("./controllers/CertificateController"))
router.use("/templates", require("./controllers/TemplatesController"))

router.get("/users", UserController.index);
router.post("/users", UserController.create);
router.post("/users/login", UserController.login);
router.put("/users/:id", UserController.update);
router.delete("/users/:id", UserController.delete);


router.get('/wrong_place', (req, res) => {
	res.status(404).send({ success: false, message: 'You should not be here!' });
});

// router.get('*', (req, res) => {
// 	res.redirect('/wrong_place');
// });

module.exports = router;
