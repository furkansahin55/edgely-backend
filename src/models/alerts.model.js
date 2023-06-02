const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'alerts',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      network: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      arguments: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: sequelize.literal("'{}'::jsonb"),
      },
      delivery_channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      delivery_arguments: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: sequelize.literal("'{}'::jsonb"),
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      user: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: 'alerts',
    }
  );
};
