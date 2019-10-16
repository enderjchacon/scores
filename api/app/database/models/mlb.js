'use strict';
module.exports = (sequelize, DataTypes) => {
    var Mlb = sequelize.define('Mlb', {
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
      orden: DataTypes.INTEGER,
      Inning: DataTypes.INTEGER,
    },{
        freezeTableName: true,
        timestamps: false,
        tableName: 'data_mlb'
    });
  
    return Mlb;
};