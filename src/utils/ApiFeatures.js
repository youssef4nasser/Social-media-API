export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    // pagination
    paginate(){
        let pageNumber = this.queryString.pageNumber * 1 || 1
        if(this.queryString.pageNumber <= 0) pageNumber = 1

        const SKIP = (pageNumber - 1) * 5
        this.pageNumber = pageNumber
        this.mongooseQuery.skip(SKIP).limit(5);
        return this
    }
    
    // Filter
    
    filter(){
        let filterObj = {...this.queryString}
        let excludedQuery = ['page', 'sort', 'fields', 'keyword']
        excludedQuery.forEach((q)=>{
            delete filterObj[q]
        })
        
        filterObj = JSON.stringify(filterObj)
        filterObj = filterObj.replace(/\b(gt|gte|lt|lte)\b/g, match=>`$${match}`)
        filterObj = JSON.parse(filterObj)
        this.mongooseQuery.find(filterObj)
        return this
    }

    // sort
    sort() {
        if(this.queryString.sort){
            this.mongooseQuery.sort(this.queryString.sort.split(',').join(' '))
        }
        return this
    }

    // search
    search(){
        if(this.queryString.keyword){
            this.mongooseQuery.find({
                $or: [
                    {name: {$regex: this.queryString.keyword, $options:'i'}},
                    {description: {$regex: this.queryString.keyword, $options:'i'}}
                ]
            })
        }
        return this
    }

    // selected fields
    fields(){
        if(this.queryString.fields){
            this.mongooseQuery.select(this.queryString.fields.split(',').join(' '))
        }
        return this
    }
}