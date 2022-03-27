const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");
const mongoose = require("mongoose");

module.exports = async function (context, req) {

    const listID = (req.query.id || (req.body && req.body.id));
    const searchTerm = (req.query.searchTerm || (req.body && req.body.searchTerm));
    const sortBy = (req.query.sortBy || (req.body && req.body.sortBy));

    const connection = await mongoDB.connect();
    const list = await connection.model('lists',Schemas.list);

    let sort = {dateCreated: -1};

    if (sortBy=="titlefirst")
        sort = {listTitle: 1}
    else if (sortBy=="titlelast")
        sort = {listTitle: -1}
    else if (sortBy== "datefirst")
        sort = {dateCreated: 1}
    /*else if (sortBy== "date-")
        sort = {dateCreated: -1}*/
    userID = new mongoose.Types.ObjectId('623c79e8626d52f11c600b5c');

    const listDTO = ['listTitle', 'dateCreated','owningUser','taskList', 'shares'];

    try {
        if (listID)
            result = await list.find({
                owningUser:userID,
                _id:listID
            }, 
            listDTO,
            {
                sort:sort
            });
        else
            result = await list.find({
                owningUser:userID
            }, 
            listDTO,
            {
                sort:sort
            });
        context.res = {
            status:200,
            body: { lists:result }
        };
    }
    catch (err)
    {
        context.res = {
            status:400,
            body: err
        };
    }
}