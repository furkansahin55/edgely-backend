const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'waitlist',
    {
      mail_address: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: 'waitlist',
    }
  );
};
