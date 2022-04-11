const mongoDB = require("../shared/mongo");
const auth = require("../shared/auth");

/**
 * Function gets a single list out of the DB by its ID
 * 
 * @Parm list the list mongoose object
 * @Parm listID an objectID/String of the list ID
 * @Parm userID the ID of the user reqresting the list
 * @Parm listDTO the returned list values (cleaning up)
 * @Parm userDTO the returned user values (cleaning up)
 * @Parm searchTerm unused
 */
function getListByListId(list, listID, userID, sort, listDTO, userDTO, searchTerm)
{
    return list.find({$or:[
        {
            owningUser:userID,
            _id:listID
        },
        {
            "shares._id":userID,
            _id:listID
        }
    ]},
    listDTO,
    {
        sort:sort
    })
    .populate('shares._id', userDTO)
    .populate('owningUser', userDTO)
    .lean()
    .exec();
}

/**
 * Function gets a all lists shared or owned by user
 * 
 * @Parm list the list mongoose object
 * @Parm userID the ID of the user reqresting the list
 * @Parm listDTO the returned list values (cleaning up)
 * @Parm userDTO the returned user values (cleaning up)
 * @Parm searchTerm unused
 */
function getLists (list, userID, sort, listDTO, userDTO, searchTerm)
{
    return list.find({$or: [
        {"owningUser":userID},
        {"shares._id":userID}
    ]}, 
    listDTO,
    {
        sort:sort
    })
    .populate('shares._id', userDTO)
    .populate('owningUser', userDTO)
    .lean()
    .exec();
}

module.exports = async function (context, req) {

    //Check auth
    let authToken;
    try {
        authToken = await auth (context);
    }
    catch (err)
    {
        context.log (err);
        context.res = {
            status: 401,
            body: {
                message:err.message
            }
        }
        return;
    }
    //Auth passed fill ID contiue code
    const userID = await authToken.userId;

    //Popilate options
    const listID = (req.query.listId || (req.body && req.body.listId));
    const searchTerm = (req.query.searchTerm || (req.body && req.body.searchTerm));
    const sortBy = (req.query.sortBy || (req.body && req.body.sortBy));
    //End popilating

    let sort = {dateCreated: -1};   //Set defualt value for sorting

    //Check options if reqrested outher sort
    if (sortBy=="titlefirst")
        sort = {listTitle: 1}
    else if (sortBy=="titlelast")
        sort = {listTitle: -1}
    else if (sortBy== "datefirst")
        sort = {dateCreated: 1}

    const listDTO = ['listTitle', 'dateCreated','owningUser','taskList', 'shares']; //DTO list of fields to return for a given list
    const userDTO = ['_id', "name", "lastName", "email"];                           //DTO list of fields to return for a given user

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        if (listID) //Check if a listID exsist if so search for only that list
            result = await getListByListId(DB.list, listID, userID, sort, listDTO, userDTO, searchTerm);
        else    //If no listID given return all lists
            result = await getLists (DB.list, userID, sort, listDTO, userDTO, searchTerm);
        
        context.res = { //Return result
            status:200,
            body: { lists:result }
        };
    }
    catch (err)
    {
        context.log (`failed to get list on reqrest ${context.id} as of reason ${err.message}`);
        context.res = {
            status:400,
            body: err.message
        };
    }
}