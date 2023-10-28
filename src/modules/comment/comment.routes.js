import express from 'express'
import { addComment, deleteComment, editComment, likeComment, unlikeComment } from './comment.controller.js'
import { protectedRoutes } from '../../middleware/protectedRoutes.js'
import { validate } from '../../middleware/validate.js'
import { addCommentValidation, editCommentValidation, likeValidation, paramsValidation } from './comment.validation.js'

const commentRouter = express.Router()
// create post and get all posts
commentRouter.route('/')
    .post(protectedRoutes, validate(addCommentValidation), addComment)
    .patch(protectedRoutes, validate(editCommentValidation), editComment)

commentRouter.route('/:id')
    .delete(protectedRoutes, validate(paramsValidation), deleteComment)

commentRouter.route('/likeComment')
    .post(protectedRoutes, validate(likeValidation), likeComment)
    .patch(protectedRoutes, validate(likeValidation), unlikeComment)

export default commentRouter