import React, { useEffect, useState } from 'react';

// components
import { Table, Button, Popup, Modal, Header, Icon, Form, Select, Divider, Message } from 'semantic-ui-react'

//services
import api from '../../services/api';
import axios from 'axios';

// styles
import { Container, InitialText } from './styles';

const Dashboard = () => {
  
  /** Declaração de Variáveis  */
  const [alunos, setAlunos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [currentInfo, setCurrentInfo] = useState([]);

  const [modalInfos, setModalInfos] = useState(false);
  const [modalAdicionarInfos, setModalAdicionarInfos] = useState(false);
  const [modalGerenciarCursosAlunos, setModalGerenciarCursosAlunos] = useState(false);

  const [nomeCadastro, setNomeCadastro] = useState([]);
  const [emailCadastro, setEmailCadastro] = useState([]);
  const [cepCadastro, setCepCadastro] = useState([]);
  const [estadoCadastro, setEstadoCadastro] = useState([]);
  const [cidadeCadastro, setCidadeCadastro] = useState([]);

  const [nomeAtualizado, setNomeAtualizado] = useState([]);
  const [emailAtualizado, setEmailAtualizado] = useState([]);
  const [cepAtualizado, setCepAtualizado] = useState([]);
  const [estadoAtualizado, setEstadoAtualizado] = useState([]);
  const [cidadeAtualizado, setCidadeAtualizado] = useState([]);

  const [cursoSelecionado, setCursoSelecionado] = useState([]);
  const [cursosAluno, setCursosAluno] = useState([]);
  /** */
    
  /** Execução no render da página */
  useEffect(()=>{
    async function fetchData() {
      try{
        const response = await api.get('/alunos');
        setAlunos(response.data);
      } catch {
        alert('Confira a api');
      }
    }
    fetchData();

    async function fetchCursosData() {
      try{
        const response = await api.get('/cursos')
        setCursos(response.data)
      } catch(err){
        alert( `Erro na consulta ${err}`);
      } 
    }
    fetchCursosData();

  }, [])
  /** */

  /** MODAL Render Functions  */
  const render_modal_info_alunos = () => (
    <Modal open={modalInfos} onClose={()=>setModalInfos(false)} closeIcon>
    <Header content={`Editando informações de ${currentInfo.nome}`} />
    <Modal.Content>
      <Form>
        <Form.Group widths='equal'>
          <Form.Input 
            fluid 
            label='Nome' 
            placeholder='Nome'
            value={nomeAtualizado}
            onChange={(e)=>setNomeAtualizado(e.target.value)}
          />
          <Form.Input 
            fluid 
            label='Email' 
            placeholder='Email' 
            value={emailAtualizado}
            onChange={(e)=>setEmailAtualizado(e.target.value)}
          />
          <Form.Input 
            fluid             
            label='CEP' 
            placeholder='CEP' 
            value={cepAtualizado}
            onChange={(e)=>setCepAtualizado(e.target.value)}
            onBlur={(e)=>completaEndereco(e.target.value , 'atualizar')}
          />
          <Form.Input 
            fluid
            readOnly 
            label='Estado' 
            placeholder='Estado'
            minLength="2"
            maxLength="2"
            value={estadoAtualizado}
            onChange={(e)=>setEstadoCadastro(e.target.value)}
          />
          <Form.Input 
            fluid 
            readOnly
            label='Cidade'
            value={cidadeAtualizado} 
            placeholder='Cidade'
            onChange={(e)=>setCidadeCadastro(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={()=>setModalInfos(false)} color='red'>
        <Icon name='remove' /> Cancelar
      </Button>
      <Button onClick={()=>atualiza_dados_aluno()} color='green'>
        <Icon name='checkmark' /> Salvar
      </Button>
    </Modal.Actions>
    </Modal>
  );

  const render_modal_adicionar_aluno = () => (
    <Modal open={modalAdicionarInfos} onClose={()=>setModalAdicionarInfos(false)} closeIcon>
    <Header content={`Cadastrando dados de aluno`} />
    <Modal.Content>
      <Form>
        <Form.Group widths='equal'>
          <Form.Input             
            fluid label='Nome' 
            placeholder='Nome' 
            value={nomeCadastro}
            onChange={(e)=>setNomeCadastro(e.target.value)}
          />
          <Form.Input 
            fluid 
            label='Email' 
            placeholder='Email'
            value={emailCadastro}
            onChange={(e)=>setEmailCadastro(e.target.value)}
          />
          <Form.Input 
            fluid 
            label='CEP' 
            placeholder='CEP'
            value={cepCadastro}
            onBlur={ (e)=>completaEndereco(e.target.value , 'cadastro')} 
            onChange={(e)=>setCepCadastro(e.target.value)}
          />
          <Form.Input 
            fluid
            readOnly 
            label='Estado' 
            placeholder='Estado'
            minLength="2"
            maxLength="2"
            value={estadoCadastro}
            onChange={(e)=>setEstadoCadastro(e.target.value)}
          />
          <Form.Input 
            fluid 
            readOnly
            label='Cidade'
            value={cidadeCadastro} 
            placeholder='Cidade'
            onChange={(e)=>setCidadeCadastro(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={()=>setModalAdicionarInfos(false)} color='red'>
        <Icon name='remove' /> Cancelar
      </Button>
      <Button 
        onClick={()=>adiciona_dados_aluno()} color='green'>
        <Icon name='checkmark' /> Salvar
      </Button>
    </Modal.Actions>
  </Modal>
  );

  const render_modal_gerenciar_cursos_aluno = () => (
    <Modal open={modalGerenciarCursosAlunos} onClose={() =>setModalGerenciarCursosAlunos(false)} closeIcon>
    <Header content={`Gerenciamento de cursos do aluno ${currentInfo.nome}`} />
    <Modal.Content>
      <Form>
        <Form.Group>
          {render_select_cursos()}        
        </Form.Group>
        <Form.Group>
          <Button onClick={()=>adicionar_curso_aluno()} color='green'> 
              <Icon name='plus' color='white' /> Adicionar
          </Button>     
        </Form.Group>        
      </Form>

      <Divider horizontal> Cursos em que o usuário está cadastrado </Divider>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID Curso</Table.HeaderCell>
            <Table.HeaderCell>Nome</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {cursosAluno.length > 0 ? render_cursos_aluno() : <td colSpan='2'> <Message content='Nenhum curso cadastrado'/> </td> }
        </Table.Body>
      </Table>
        
    </Modal.Content>
  </Modal>
  );
  /** */

  /** Controllers para a render dos modais */       
  function open_info_alunos(data_aluno){
    setCurrentInfo(data_aluno)
    setNomeAtualizado(data_aluno.nome)
    setEmailAtualizado(data_aluno.email)
    setCepAtualizado(data_aluno.cep)
    setEstadoAtualizado(data_aluno.estado)
    setCidadeAtualizado(data_aluno.cidade)

    setModalInfos(true)
  }

  function open_modal_create_aluno(){
    setModalAdicionarInfos(true);
  }

  function open_gerencia_curso_aluno(data_aluno){
    setCurrentInfo( data_aluno );
    consulta_cursos_aluno( data_aluno.id )
    render_cursos_aluno();
    setCursosAluno('')

    setModalGerenciarCursosAlunos(true);
  }
  /**  */

  /** COnsultas API */
  async function exclui_dados_aluno(data_aluno){ 
    const id_aluno = data_aluno.id;
    const nome_aluno = data_aluno.nome;
    
    let confirmaExclusao = window.confirm(`Deseja excluir o aluno ${nome_aluno} - ID ${id_aluno} ?`)

    if ( confirmaExclusao ){
      const retornoExcluir = await api.delete(`/aluno/${id_aluno}`);
      
      if ( retornoExcluir.status === 200 ){
        const response = await api.get('/alunos');
        setAlunos(response.data);
      }      
    }
  }

  async function adiciona_dados_aluno(){    
    if ( nomeCadastro === '' || emailCadastro === '' || cepCadastro === '' || cidadeCadastro === '' || estadoCadastro === '' ){
      alert('Todos os dados devem ser preenchidos');
      return;
    }

    const dados_aluno = {
      'nome': nomeCadastro,
      'email': emailCadastro,
      'cep': cepCadastro,
      'cidade': cidadeCadastro, 
      'estado': estadoCadastro
    }

    const retornoAdicionar = await api.post(`/alunos`, dados_aluno);
    
    if ( retornoAdicionar.status === 200 ){
      setModalAdicionarInfos(false)
      const response = await api.get('/alunos');
      setAlunos(response.data);
    } 

    setNomeCadastro('')
    setEmailCadastro('')
    setCepCadastro('')
    setCidadeCadastro('')
    setEstadoCadastro('')
  }

  async function atualiza_dados_aluno(){
    if ( nomeAtualizado === '' || emailAtualizado === '' || cepAtualizado === '' || cidadeAtualizado === '' || estadoAtualizado === '' ){
      alert('Todos os dados devem ser preenchidos');
      return;
    }

    const dados_aluno_atualizado = {
      'nome': nomeAtualizado,
      'email': emailAtualizado,
      'cep': cepAtualizado,
      'cidade': cidadeAtualizado,
      'estado': estadoAtualizado
    }

    const id_aluno = currentInfo.id;

    const retornoAtualizar = await api.put(`/alunos/${id_aluno}`, dados_aluno_atualizado);


    if ( retornoAtualizar.status === 200 ){
      setModalInfos(false)
      const response = await api.get('/alunos');
      setAlunos(response.data);
    } else {
      alert('Dados inválidos')
    }
    setNomeAtualizado('')
    setEmailAtualizado('')
    setCepAtualizado('')
    setCidadeAtualizado('')
    setEstadoAtualizado('')
  }

  async function adicionar_curso_aluno(){
    const id_aluno = currentInfo.id;
    const id_curso = cursoSelecionado.value;

    const retornoAdicionarCurso = await api.post(`/atribuir-curso/${id_aluno}/${id_curso}`);


    if ( retornoAdicionarCurso.status === 200 ){
      alert(`${retornoAdicionarCurso.data.menssagem}`);
      consulta_cursos_aluno( currentInfo.id )
    }
  }

  async function consulta_cursos_aluno( id_aluno ){

    try{
      let retornoCursosoAluno = await api.get(`/cursos/${id_aluno}`)
      setCursosAluno(retornoCursosoAluno.data);
    } catch ( err ){
      alert('Erro na consulta ' + err)
    }
  }
  /** */


  /** Util Functions */
  async function completaEndereco( numeroCep , finalidade ){

    var validacep = /^[0-9]{8}$/;

    if ( validacep.test(numeroCep) ){
      let resultadoBuscaCep = await axios.get(`https://viacep.com.br/ws/${numeroCep}/json/unicode/`);
      let dados_endereco = resultadoBuscaCep.data;

      if ( finalidade === 'cadastro' ){
        setEstadoCadastro(dados_endereco.uf);
        setCidadeCadastro(dados_endereco.localidade);
      } else if ( finalidade === 'atualizar' ){
        setEstadoAtualizado(dados_endereco.uf);
        setCidadeAtualizado(dados_endereco.localidade);
      }
      
    } else {
      alert('O CEP digitado é inválido!')
    }

  }    
  // **   */


  /** Components Render Functions */
  function render_actions(data_aluno){
    return <center>
      <Popup
        trigger={<Button icon='edit' onClick={()=>open_info_alunos(data_aluno)} />}
        content="Editar informações"
        basic
      />
      <Popup
        trigger={<Button icon='plus' onClick={()=>open_gerencia_curso_aluno(data_aluno)} positive />}
        content="Adicionar curso para aluno"
        basic
      />
      <Popup
        trigger={<Button icon='close' onClick={()=>exclui_dados_aluno(data_aluno) } negative />}
        content="Excluir aluno"
        basic
      />
    </center>
  }

  function render_alunos(){
    return alunos.map((v)=><Table.Row>
      <Table.Cell>{v.id}</Table.Cell>
      <Table.Cell>{v.nome}</Table.Cell>
      <Table.Cell>{v.email}</Table.Cell>
      <Table.Cell>{v.cep}</Table.Cell>
      <Table.Cell>{render_actions(v)}</Table.Cell>
    </Table.Row>)
  }


  function render_select_cursos(){
    var listaOpcoes = [];

    cursos.forEach( curso => {

      let opcao = {
        text: curso.nome,
        value: curso.id,
        key: curso.id
      }
      listaOpcoes.push( opcao );
    }) 
      
    return ( 
      <Select 
        fluid 
        placeholder='Cursos' 
        options={listaOpcoes} 
        onChange={(e , selectData) => setCursoSelecionado(selectData)}
      /> 
    )
  }

  function render_cursos_aluno(){

    return cursosAluno.map((v)=><Table.Row>
      <Table.Cell>{v.id}</Table.Cell>
      <Table.Cell>{v.nome}</Table.Cell>
    </Table.Row>)
    
  }
  /**   */

  /** == Index == */
  return (
    <Container fluid>
      <InitialText>Administrador de alunos</InitialText>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID Aluno</Table.HeaderCell>
            <Table.HeaderCell>Nome</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>CEP</Table.HeaderCell>
            <Table.HeaderCell>Ações</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { alunos.length > 0 ? render_alunos() : <h2>Nenhum dado registrado </h2> }
        </Table.Body>
      </Table>
      {render_modal_info_alunos()}
      {render_modal_adicionar_aluno()}
      {render_modal_gerenciar_cursos_aluno()}
      <Button primary onClick={()=>open_modal_create_aluno()}>Adicionar aluno</Button>
      <Button href="/" secondary>Ver instruções</Button>
    </Container>
  );
};

export default Dashboard;
