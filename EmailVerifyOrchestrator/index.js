/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 * 
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your 
 *    function app in Kudu
 */

const df = require("durable-functions");
const moment = require('moment');

module.exports = df.orchestrator(function*(context) {
    yield context.df.callActivity("RequestApproval");

    context.log (context.instanceId);

    //const dueTime = moment.utc(context.df.currentUtcDateTime).add(72, 'h');
    const dueTime = moment.utc(context.df.currentUtcDateTime).add(10, 's');
    const durableTimeout = context.df.createTimer(dueTime.toDate());

    const approvalEvent = context.df.waitForExternalEvent("ApprovalEvent");
    const result = yield context.df.Task.any([approvalEvent, durableTimeout]);
    if (approvalEvent === result) {
        durableTimeout.cancel();
        yield context.df.callActivity("EmailVerifySuccess", approvalEvent.result);
    } else {
        yield context.df.callActivity("EmailVerifyFail");
    }
});

