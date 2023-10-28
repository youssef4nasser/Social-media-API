
export const globalError = (err, req, res, next)=>{
    const statusCode = err.statusCode || 500
    process.env.MODE == "dev" ? 
        res.status(statusCode).json({message: err.message, stack: err.stack}) :
        res.status(statusCode).json({message: err.message})
}