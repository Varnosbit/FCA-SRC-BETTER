"use strict";

module.exports = function (defaultFuncs, api, ctx) {
    return async function sendSticker(threadID, stickerID, message_id, callback) {
        if (!ctx.mqttClient) {
            throw new Error("Not connected to MQTT");
        }
        ctx.wsReqNumber += 1;
        ctx.wsTaskNumber += 1;
        const allou = new Date();
        const unix = allou.getTime();
        let x = {
            "thread_id": threadID,
            "otid": Date.now().toString(),
            "source": 65537,
            "send_type": 2,
            "sync_group": 1,
            "mark_thread_read": 1,
            "sticker_id": stickerID,
            "initiating_source": 1,
            "skip_url_preview_gen": 0,
            "text_has_links": 0,
            "multitab_env": 0
        };
        if (message_id) {
            x.reply_metadata = {
                reply_source_id: message_id,
                reply_source_type: 1,
                reply_type: 0
            };
        }
        var form = JSON.stringify({
            "app_id": "772021112871879",
            "payload": JSON.stringify({
                epoch_id: null,
                tasks: [{
                    label: '46',
                    payload: JSON.stringify(x),
                    queue_name: threadID,
                    task_id: ctx.wsTaskNumber,
                    failure_count: null
                },
                    {
                        label: '21',
                        payload: JSON.stringify({
                            "thread_id": threadID,
                            "last_read_watermark_ts": unix,
                            "sync_group": 1
                        }),
                        queue_name: threadID,
                        task_id: ctx.wsTaskNumber + 1,
                        failure_count: null
                    }],
                version_id: '8595046457214655',
                data_trace_id: null//"#z4sBmtBwRUm0Nqc9Bs8h5g"
            }),
            "request_id": ctx.wsReqNumber,
            "type": 3
        });

        ctx.mqttClient.publish('/ls_req', form);

        if (typeof callback === 'function') {
            callback(null, {
                success: true, request_id: ctx.wsReqNumber
            });
        }
    };
};