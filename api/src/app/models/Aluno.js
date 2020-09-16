import { Model, DataTypes } from 'sequelize';

class Aluno extends Model {

  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,
        email: DataTypes.STRING,
        cep: DataTypes.STRING,
        cidade: DataTypes.STRING,
        estado: DataTypes.STRING
      },
      {
        sequelize,
        timestamps: false,
        tableName: 'aluno'
      }
    );    
    return this;
  }
  
  static associate( models ) {
    this.belongsToMany( models.Curso , { as: 'estudante', foreignKey: 'pessoa_id', through: 'curso_pessoa'} );
  }
  
}

export default Aluno;
