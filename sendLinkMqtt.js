"use strict";

const utils = require("../utils");

module.exports = function (defaultFuncs, api, ctx) {
    return async function shareLink(text, url, threadID, callback) {
        if (!ctx.mqttClient) {
            throw new Error("Not connected to MQTT");
        }
        ctx.wsReqNumber += 1;
        ctx.wsTaskNumber += 1;
        ctx.mqttClient.publish(
            "/ls_req",
            JSON.stringify({
                app_id: "2220391788200892",
                payload: JSON.stringify({
                    tasks: [{
                        label: 46,
                        payload: JSON.stringify({
                            otid: utils.generateOfflineThreadingID(),
                            source: 524289,
                            sync_group: 1,
                            send_type: 6,
                            mark_thread_read: 0,
                            url: url || "",
                            text: text || "",
                            thread_id: threadID,
                            initiating_source: 0,
                        }),
                        queue_name: threadID,
                        task_id: ctx.wsTaskNumber,
                        failure_count: null,
                    },
                    ],
                    epoch_id: utils.generateOfflineThreadingID(),
                    version_id: "7191105584331330",
                }),
                request_id: ctx.wsReqNumber,
                type: 3,
            }),
            {
                qos: 1,
                retain: false,
            }
        );
    };
};

//By allou Mohamed 🧙