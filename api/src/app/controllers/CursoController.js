import Curso from '../models/Curso'
import CursoAluno from '../models/CursoAluno';

class CursoController {

  async index(req, res) {
    const cursos = await Curso.findAll()
    res.json(cursos);
  }

}

export default new CursoController();
