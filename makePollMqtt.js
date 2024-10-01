'use strict';

module.exports = function (defaultFuncs, api, ctx) {
  return function createPollMqtt(title, options, threadID, callback) {
    if (!ctx.mqttClient) {
      throw new Error('Not connected to MQTT');
    }

    ctx.wsReqNumber += 1;
    ctx.wsTaskNumber += 1;

    const taskPayload = {
      question_text: title,
      thread_key: threadID,
      options: options,
      sync_group: 1,
    };

    const task = {
      failure_count: null,
      label: '163',
      payload: JSON.stringify(taskPayload),
      queue_name: 'poll_creation',
      task_id: ctx.wsTaskNumber,
    };

    const content = {
      app_id: '2220391788200892',
      payload: JSON.stringify({
        data_trace_id: null,
        epoch_id: null,
        tasks: [task],
        version_id: '7158486590867448',
      }),
      request_id: ctx.wsReqNumber,
      type: 3,
    };

    ctx.mqttClient.publish('/ls_req', JSON.stringify(content), { qos: 1, retain: false });
  };
};