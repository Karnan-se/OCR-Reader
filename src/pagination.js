const pagination = (page,  limit) =>{
    
    //page= 1
     let skip = (page-1) *limit

     "db.food.aggregate([{$match:{name: karnn}}, {$skip:1} , {$limit: 1}])"
    
    
}