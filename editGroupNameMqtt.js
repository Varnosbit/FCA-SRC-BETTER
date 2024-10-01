"use strict";

module.exports = function (defaultFuncs, api, ctx) {
    return async function changeThreadName(threadKey, newName, callback) {
        if (!ctx.mqttClient) {
            throw new Error("Not connected to MQTT");
        }
        ctx.wsReqNumber += 1;
        ctx.wsTaskNumber += 1;
        
        var form = JSON.stringify({
            "app_id": "772021112871879",
            "payload": JSON.stringify({
                epoch_id: null,
                tasks: [{
                    label: '32',
                    payload: JSON.stringify({
                        "thread_key": threadKey,
                        "thread_name": newName,
                        "sync_group": 1
                    }),
                    queue_name: threadKey,
                    task_id: ctx.wsTaskNumber,
                    failure_count: null
                }],
                version_id: '8595046457214655'
            }),
            "request_id": ctx.wsReqNumber,
            "type": 3
        });

        ctx.mqttClient.publish('/ls_req', form);

        if (typeof callback === 'function') {
            callback(null, { success: true, request_id: ctx.wsReqNumber });
        }
    };
};