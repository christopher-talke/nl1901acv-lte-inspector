const SSH2Shell = require('ssh2shell');
const mappings = require('../quectel-mappings.json');
const util = require('util');

const executeShellCommand = (command, config, callback) => {
  let SSH = new SSH2Shell({
    server: {
      host: config.host,
      port: 22,
      userName: config.username,
      password: config.password,
      algorithms: {
        hmac: ['hmac-sha1'],
        cipher: ['3des-cbc'],
        kex: ['diffie-hellman-group1-sha1'],
      },
    },
    dataIdleTimeOut: 500,
    commands: ['sh', mappings.commands[command]],
    onError: function (err) {
      console.error(err);
      return err;
    },
  });

  SSH.connect((data) => {
    const dirtyString = JSON.stringify(data);
    const cleanString = dirtyString.slice(dirtyString.indexOf('[') - 1, dirtyString.lastIndexOf(']') + 1).replace(/(\\n\+([A-Z]{2,})|(\\n))|(OK)|[\]\\]|(n\[)|["]/g, '');
    const cleanArray = cleanString
      .slice(cleanString.indexOf(':') + 1, cleanString.length)
      .trim()
      .split(',');

    if (cleanArray[0] === 'servingcell') {
      cleanArray.shift();
    }

    const mappedObject = {
      at_cmd_output: cleanString,
    };

    // eslint-disable-next-line array-callback-return
    cleanArray.map((value, index) => {
      mappedObject[mappings.keyValueMapping[command][index]] = value;
    });

    if (command === 'signalQualityReport') {
      mappedObject.rssi = { value: mappedObject.rssi, mapping: mappings.parameterMapping.signalQualityReport.rssi[mappedObject.rssi] };
      mappedObject.ber = { value: mappedObject.ber, mapping: mappings.parameterMapping.signalQualityReport.ber[mappedObject.ber] };
    }

    if (command === 'servingCellReadings') {
      mappedObject.ul_bandwidth = { value: mappedObject.ul_bandwidth, mapping: mappings.parameterMapping.servingCellReadings.bandwidth[mappedObject.ul_bandwidth] };
      mappedObject.dl_bandwidth = { value: mappedObject.dl_bandwidth, mapping: mappings.parameterMapping.servingCellReadings.bandwidth[mappedObject.dl_bandwidth] };
      mappedObject.mcc = {
        value: mappedObject.mcc,
        mapping: mappings.parameterMapping.networkInformation.oper[`${mappedObject.mcc}${mappedObject.mnc}`] || 'Not known or not detectable',
      };
      mappedObject.mnc = {
        value: mappedObject.mnc,
        mapping: mappings.parameterMapping.networkInformation.oper[`${mappedObject.mcc.value}${mappedObject.mnc}`] || 'Not known or not detectable',
      };
    }

    if (command === 'servingCellReadings' || command === 'modemReadings') {
      mappedObject.sinr = { value: mappedObject.sinr, mapping: mappings.parameterMapping.modemReadings.sinr[mappedObject.sinr] };
    }

    if (command === 'modemReadings') {
      mappedObject.rssi = `${mappedObject.rssi * -1}`;
    }

    if (command === 'networkInformation') {
      mappedObject.oper = { value: mappedObject.oper, mapping: mappings.parameterMapping.networkInformation.oper[mappedObject.oper] || 'Not known or not detectable' };
    }

    return callback(undefined, mappedObject);
  });
};

const asyncExecuteShellCommand = util.promisify(executeShellCommand);

module.exports = { asyncExecuteShellCommand, executeShellCommand };
