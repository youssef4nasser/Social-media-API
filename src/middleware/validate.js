
export const validate = (schema)=>{
    return (req, res, next)=>{
        const {error} = schema.validate({...req.body, ...req.params, ...req.query}, {abortEarly: false})
        let errors=[];
        if(error){
            error.details.forEach((detail)=>{
                errors.push({message: detail.message, field: detail.path[0]})
            })
            return res.json({message: 'Invalid request data', errors})
        }else{
            next()
        }
    }
}
