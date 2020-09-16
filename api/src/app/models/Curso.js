import { Model, DataTypes } from 'sequelize';

class Curso extends Model {

  static init( sequelize ) {
    super.init(
      {
        nome: DataTypes.STRING
      },
      {
        sequelize,
        timestamps: false,
        tableName: 'curso'
      }
    );
    return this;
  }

  static associate( models ){
    this.belongsToMany( models.Aluno , { as: 'curso', foreignKey: 'id_curso' , through: 'curso_pessoa'} );
  }

}

export default Curso;
