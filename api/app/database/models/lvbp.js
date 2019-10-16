'use strict';
module.exports = (sequelize, DataTypes) => {
    var LVBP = sequelize.define('LVBP', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      Id_juego: DataTypes.STRING,
      Fecha: DataTypes.STRING,
      Hora: DataTypes.CHAR,
      Estado: DataTypes.STRING,
      Arriba_abajo: DataTypes.STRING,
      Equipo_visitante: DataTypes.STRING,
      Equipo_local: DataTypes.STRING,
      Score_visitante: DataTypes.STRING,
      Score_local: DataTypes.STRING,
      Lugar: DataTypes.STRING,
      Outs: DataTypes.INTEGER,
      HMB: DataTypes.INTEGER,
      Inning: DataTypes.INTEGER,
    },{
        freezeTableName: true,
        timestamps: false,
        tableName: 'data_lvpb'
    });
  
    return LVBP;
};