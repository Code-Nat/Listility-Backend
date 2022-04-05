const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");
const mongoose = require('mongoose')

module.exports = async function (context, req) {
    const listId = (req.query.listid || (req.body && req.body.listid));


    /*if (!listId)
        listId = {listID};
    */
    if (!listId)
    {
        context.res = {
            status:400,
            body: "Missing list ID"
        };
        return;
    }
    
    

    const connection = await mongoDB.connect();
    const list = await connection.model('lists',Schemas.list);

   /* let result = */await list.findByIdAndDelete(mongoose.Types.ObjectId(listId), err => {
        if(err)
        {
            context.res = {
                // status: 200, /* Defaults to 200 */
                status:400,
                body: err
            };
        }
        else
        {
            context.res = {
                // status: 200, /* Defaults to 200 */
                status:204,
                body: ""
            };
            //context.log("Successful deletion");
        }
      }).catch (err => { context.log (err); });
}