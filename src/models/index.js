/* eslint-disable no-restricted-syntax */
const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');
const config = require('../config/config');
const usersModel = require('./users.model');
const tokenModel = require('./token.model');
const labelsModel = require('./labels.model');
const alertsModel = require('./alerts.model');
const alertTypesModel = require('./alert_types.model');
const alertDeliveryChannelsModel = require('./alert_delivery_channels.model');

const sequelize = new Sequelize(config.db, {
  logging: true,
});

const modelDefiners = [usersModel, tokenModel, alertTypesModel, alertDeliveryChannelsModel, labelsModel, alertsModel];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

module.exports = sequelize;
