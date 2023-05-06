const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'users',
    {
      address: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      premium_finish_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: 'users',
    }
  );
};
