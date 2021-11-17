const express = require("express");

const postController = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router
    .route("/")
    .get(protect, postController.getAllPosts)
    .post(protect, postController.createPost); /*With Protect, this will run once router.post is called and run through check, if 
                                                user is found, 'next() is called and proceed with post creation, if not, opperation 
                                                is cancelled*/

router
    .route("/:id")
    .get(protect, postController.getOnePost)
    .patch(protect, postController.updatePost)
    .delete(protect, postController.deletePost);

module.exports = router;
