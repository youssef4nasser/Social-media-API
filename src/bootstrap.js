import replayRouter from "./modules/Replay comment/replay.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import commentRouter from "./modules/comment/comment.routes.js";
import postRouter from "./modules/post/post.routes.js";
import userRouter from "./modules/user/user.routes.js";
import { AppError } from "./utils/AppError.js";

export const bootstrap = (app)=>{
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/posts', postRouter)
    app.use('/api/v1/comments', commentRouter)
    app.use('/api/v1/replaies', replayRouter)
    
    app.all('*', (req, res, next)=>{
        next(new AppError('Not found endpoint', 404))
    })
}