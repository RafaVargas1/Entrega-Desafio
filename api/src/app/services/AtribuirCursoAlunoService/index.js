import Aluno from '../../models/Aluno';
import Curso from '../../models/Curso';
import CursoAluno from '../../models/CursoAluno';

class AtribuirCursoAlunoService {
  async execute({ id_aluno, id_curso }) {

    const alunoVerificado = await Aluno.findByPk( id_aluno );
    const cursoVerificado = await Curso.findByPk( id_curso );

    if ( alunoVerificado && cursoVerificado ){

      try {
        const [ cursoAluno , created ] = await CursoAluno.findOrCreate(
          { 
            where :{
              'id_pessoa': id_aluno , 
              id_curso
            }
          },
        );

        if ( created ){
          return ({
            'valido': true,
            'objetoCursoAluno' : cursoAluno
          });
        } else {
          return ({
            'valido': false,
            'erro' : 'duplicado'
          });
        }
        
      } catch ( err ){
        return ({
          'valido': false,
          'erro' : err
        })
      }

    } else {
      return ({
        'valido': false,
        'erro': 'Aluno ou curso não existente'
      })
    }
  
  }
}

export default new AtribuirCursoAlunoService();
