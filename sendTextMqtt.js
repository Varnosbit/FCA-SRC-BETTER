"use strict";

const utils = require("../utils");

module.exports = function (defaultFuncs, api, ctx) {
    const emojiSizes = {
        small: 1,
        medium: 2,
        large: 3
    };

    function handleEmoji(msg, form) {
        if (msg.emoji) {
            form.payload.tasks[0].payload.send_type = 1;
            form.payload.tasks[0].payload.text = msg.emoji;
            form.payload.tasks[0].payload.hot_emoji_size = emojiSizes[msg.emojiSize] || emojiSizes.small;
        }
    }

    function addReplyMetadata(replyToMessage, form) {
        if (replyToMessage) {
            form.payload.tasks[0].payload.reply_metadata = {
                reply_source_id: replyToMessage,
                reply_source_type: 1,
                reply_type: 0
            };
        }
    }

    function send(form, threadID, callback) {
        const mqttClient = ctx.mqttClient;
        form.payload.tasks.forEach(task => {
            task.payload = JSON.stringify(task.payload);
        });
        form.payload = JSON.stringify(form.payload);

        mqttClient.publish("/ls_req", JSON.stringify(form), (err, data) => {
            callback(err ? err: null, data);
        });
    }

    return function sendMessageMqtt(msg, threadID, replyToMessage, callback) {
        if (typeof callback !== "function") {
            callback = function () {}
        }

        const msgType = utils.getType(msg);

        if (msgType !== "String" && msgType !== "Object") {
            return callback({
                error: `Message should be string or object, not ${msgType}`
            });
        }

        if (msgType === "String") {
            msg = {
                body: msg
            };
        }

        const form = {
            app_id: "2220391788200892",
            payload: {
                tasks: [{
                    label: "46",
                    payload: {
                        thread_id: threadID.toString(),
                        otid: Date.now().toString(),
                        source: 0,
                        send_type: 1,
                        sync_group: 1,
                        text: msg.body || "",
                        initiating_source: 1,
                        skip_url_preview_gen: 0
                    },
                    queue_name: threadID.toString(),
                    task_id: 0,
                    failure_count: null
                }],
                epoch_id: null,
                version_id: "6120284488008082",
                data_trace_id: null
            },
            request_id: 1,
            type: 3
        };

        handleEmoji(msg, form);
        addReplyMetadata(replyToMessage, form);
        send(form, threadID, callback);
    };
};