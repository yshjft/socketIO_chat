const Sequelize =  require('sequelize')

module.exports = class Room extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            title: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            max: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false, 
                defaultValue: 10,
                validate: {min: 2}
            },
            password: {
                type: Sequelize.STRING(10),
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db){
        db.Room.hasMany(db.Chat, {foreignKey: 'room', sourceKey: 'id'})
    }
}