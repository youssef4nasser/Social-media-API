import express from 'express'
import { protectedRoutes } from '../../middleware/protectedRoutes.js'
import { addPost, changePrivacyPost, deletePost, getAllPosts, getPostById, getPostsCreatedToday, getPostsCreatedYesterday, likePost, unlikePost, updatePost} from './post.controller.js'
import { fileUpload, fileValidation } from '../../utils/multer.cloud.js'
import { validate } from '../../middleware/validate.js'
import { addPostValidation, changePrivacyValidation, getPostByIdValidation, paramsValidation, updatePostValidation } from './post.validation.js'

const postRouter = express.Router()
// create post and get all posts
postRouter.route('/')
    .post(protectedRoutes, fileUpload(fileValidation.flies).fields([{name: "img", maxCount:1},{name: "vid", maxCount:1}]), validate(addPostValidation), addPost)
    .get(protectedRoutes, getAllPosts)
// get all posts created yesterday
postRouter.route('/postsYesterday')
    .get(protectedRoutes, getPostsCreatedYesterday)
// get all posts created today
postRouter.route('/postsToday')
    .get(protectedRoutes, getPostsCreatedToday)

postRouter.route('/:id')    
    .get(protectedRoutes, validate(getPostByIdValidation), getPostById)
    .patch(protectedRoutes, validate(updatePostValidation), updatePost)
    .put(protectedRoutes, validate(changePrivacyValidation), changePrivacyPost)
    .delete(protectedRoutes, validate(paramsValidation), deletePost)
// like post and unlike post
postRouter.route('/like/:id')
    .post(protectedRoutes, validate(paramsValidation), likePost)
    .patch(protectedRoutes, validate(paramsValidation), unlikePost)
    
export default postRouter
