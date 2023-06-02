const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'token',
    {
      token: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      user: {
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'address',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      blacklisted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: 'token',
    }
  );
};
