const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const SignUp = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  number: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isPremium: Sequelize.BOOLEAN,
  totalExpenses: Sequelize.BIGINT,
});

module.exports = SignUp;
