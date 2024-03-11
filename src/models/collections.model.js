const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'collections',
    {
      address: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      block_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      block_timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      block_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      symbol: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: sequelize.literal("'{}'::jsonb"),
      },
      version: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      weight: {
        type: DataTypes.INT,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: 'collections',
    }
  );
};
