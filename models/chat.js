const Sequelize = require('sequelize')

module.exports = class Chat extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            user:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            chat: {
                type: Sequelize.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db){
        db.Chat.belongsTo(db.Room, {
            foreignKey: 'room', 
            targetKey: 'id'
        })
    }
}