"use_strict";

module.exports = function (defaultFuncs, api, ctx) {
    return async function sendContact(text, senderID, threadID, callback) {
        if (!ctx.mqttClient) {
            throw new Error("Not connected to MQTT");
        }
        ctx.wsReqNumber += 1;
        ctx.wsTaskNumber += 1;
        var form = JSON.stringify({
            "app_id": "2220391788200892",
            "payload": JSON.stringify({
                tasks: [{
                    label: '359',
                    payload: JSON.stringify({
                        "contact_id": senderID,
                        "sync_group": 1,
                        "text": text || "",
                        "thread_id": threadID
                    }),
                    queue_name: 'messenger_contact_sharing',
                    task_id: ctx.wsTaskNumber,
                    failure_count: null,
                }],
                epoch_id: null,
                version_id: '7214102258676893',
            }),
            "request_id": ctx.wsReqNumber,
            "type": 3
        });
        ctx.mqttClient.publish('/ls_req', form);
    };
};