const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'alert_delivery_channels',
    {
      id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: 'alert_delivery_channels',
    }
  );
};
