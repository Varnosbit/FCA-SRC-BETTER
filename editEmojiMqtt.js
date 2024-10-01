"use strict";

module.exports = function (defaultFuncs, api, ctx) {
    return async function changeQuickReaction(threadKey, emoji, callback) {
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
                    label: '100003',
                    payload: JSON.stringify({
                        "thread_key": threadKey,
                        "custom_emoji": emoji,
                        "avatar_sticker_instruction_key_id": null,
                        "sync_group": 1
                    }),
                    queue_name: 'thread_quick_reaction',
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