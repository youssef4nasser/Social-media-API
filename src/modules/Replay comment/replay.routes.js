import express from 'express'
import { protectedRoutes } from '../../middleware/protectedRoutes.js'
import { addReplay, deleteReplay, editReplay, likeReplay, unlikeReplay } from './replay.controller.js'
import { validate } from '../../middleware/validate.js'
import { addReplayValidation, editReplayValidation, likeReplayValidation, paramsValidation } from './replay.validation.js'

const replayRouter = express.Router()
// create post and get all posts
replayRouter.route('/')
    .post(protectedRoutes, validate(addReplayValidation), addReplay)
    .patch(protectedRoutes, validate(editReplayValidation), editReplay)

replayRouter.route('/:id')
    .delete(protectedRoutes, validate(paramsValidation), deleteReplay)

replayRouter.route('/likeReplay')
    .post(protectedRoutes, validate(likeReplayValidation), likeReplay)
    .patch(protectedRoutes, validate(likeReplayValidation), unlikeReplay)

export default replayRouter