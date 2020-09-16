import { Router } from 'express';

/** Controllers */
import AlunosController from '../app/controllers/AlunoController';
import CursoController from '../app/controllers/CursoController';

/**  * */

const routes = new Router();

// ** Rotas Aluno */
routes.get('/alunos', AlunosController.index);
routes.get('/aluno/:idAlunoFiltro' , AlunosController.read );

routes.post('/alunos', AlunosController.create)

routes.put('/alunos/:idAlunoFiltroUpdate', AlunosController.update);

routes.delete('/aluno/:idAlunoFiltroDelete' , AlunosController.delete );
/**  * */

/** Consulta de todos os curso */
routes.get('/cursos', CursoController.index )
/** */

//** Rota de consulta do cursos de aluno especifico */
routes.get('/cursos/:idAlunoFiltro' , AlunosController.consultarCursosAluno )
/**  * */


//** Rotas Atribuir Curso Aluno*/
routes.post('/atribuir-curso/:id_aluno/:id_curso', AlunosController.atribuirCursoAluno );

//* * */



export default routes;
