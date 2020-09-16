import Aluno from '../models/Aluno';
import Curso from '../models/Curso'
import CursoAluno from '../models/CursoAluno';

import AtribuirCursoAlunoService from '../services/AtribuirCursoAlunoService';

class AlunoController {

  async index(req, res) {
    const alunos = await Aluno.findAll()
    res.json(alunos);
  }

  async read(req, res) {    
    const { idAlunoFiltro } = req.params;

    const aluno = await Aluno.findByPk( idAlunoFiltro );

    if ( !aluno ){
      res.status(400).json({ error: "Aluno não encontrado"});
      return;
    }
    res.status(200).json( aluno )   
  }

  async create(req, res) {    
    const alunoDadosCadastro = req.body;
    
    try {
      const aluno = await Aluno.create( alunoDadosCadastro );
      res.status(200).json( aluno );
      return;
    } catch ( err ){
      res.status(400).json({error: `Erro no cadastro - ${err}`});
      return;
    }   
  
  }

  async update(req, res) {
    const alunoDadosUpdate = req.body;
    const { idAlunoFiltroUpdate } = req.params;

    try{
      const rowsUpdated = await Aluno.update(
        alunoDadosUpdate,
        {where: {id: idAlunoFiltroUpdate} }
      )
      return res.status(200).json({rowsUpdated});      
    } catch ( err ){
      res.status(400).json({error: `Erro na atualização do dado - ${err}`});
      return;
    }    

  }

  async delete(req, res) {
    const { idAlunoFiltroDelete } = req.params;

    try {

      const destroy = await Aluno.destroy({
        where: {id: idAlunoFiltroDelete}
      });
      return res.status(200).json({destroy});

    } catch ( err ){
      res.status(400).json({error: `Erro na exclusão do dado - ${err}`});
      return;
    }
  }


  async atribuirCursoAluno(req, res ){

    const retorno = await AtribuirCursoAlunoService.execute( req.params );
    
    if ( retorno.valido ){
      return res.status(200).json({menssagem: 'Curso Atribuido'})
    } else if ( retorno.erro == 'duplicado'){
      return res.status(200).json({menssagem: 'Atribuição já realizada'})
    }


    return res.status(400).json({error: `Erro na atribução do curso - ${retorno.erro}`})

  }

  async consultarCursosAluno(req , res){
    const {idAlunoFiltro}= req.params;

    let idsCursosAluno = await CursoAluno.findAll({
      attributes: ['id_curso'],
      where: {
        'id_pessoa': idAlunoFiltro
      },
      order: [['id_curso' , 'ASC']]
    });


    var listaCursosAlunos = await Promise.all(
      idsCursosAluno.map( async (objectoIdCurso) => {
      
        let id = objectoIdCurso.id_curso;
        let dadosCurso = await Curso.findAll({
          where: {id}
        });

        return({
          'id' : dadosCurso[0].id,
          'nome' : dadosCurso[0].nome
        });

      })
    );

    res.json(listaCursosAlunos)
  }


}

export default new AlunoController();
