const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: {
        args: 1991,
        msg: 'Min value for year is 1991'
      },
      max: {
        args: new Date().getFullYear(),
        msg: `Max value for year is ${new Date().getFullYear()}`
      }
    }
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'blog'
})

module.exports = Blog