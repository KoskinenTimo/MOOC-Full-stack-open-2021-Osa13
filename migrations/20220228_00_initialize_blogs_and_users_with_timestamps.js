const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('blogs', {
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
      }
    }, {
      timestamps: true,
    })
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }    
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      passwordhash: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: true,
    })
    await queryInterface.addColumn('blogs', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
    await queryInterface.addColumn('users', 'created_at', {
      type: DataTypes.TIME
    })
    await queryInterface.addColumn('blogs', 'created_at', {
      type: DataTypes.TIME
    })
    await queryInterface.addColumn('users', 'updated_at', {
      type: DataTypes.TIME,
    })
    await queryInterface.addColumn('blogs', 'updated_at', {
      type: DataTypes.TIME
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('blogs')
    await queryInterface.dropTable('users')
  },
}