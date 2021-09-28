const pool = require("../conexao");
const { query } = pool;

const listar = async (req, res) => {
  try {
    let { rows: usuarios } = await query("SELECT * FROM usuarios");

    for (const usuario of usuarios) {
      const { rows: emprestimos } = await query(
        "SELECT * FROM emprestimos WHERE usuario_id = $1",
        [usuario.id]
      );
      usuario.emprestimos = emprestimos;
      for (const emprestimo of emprestimos) {
        const { rows: livro } = await query(
          "SELECT nome FROM livros WHERE id = $1",
          [emprestimo.livro_id]
        );
        emprestimo.livro = livro[0].nome;
      }
    }
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(400).json(error);
  }
};


const listarId = async (req, res) => {
  try {
    const usuario = await query("select * from usuarios where id = $1", [
      req.params.id,
    ]);
    if (usuario.rowCount === 0) {
      res
        .status(404)
        .json({ erro: `Não existe usuario com ID = ${req.params.id}` });
    }

    const { rows: emprestimos } = await query(
      "SELECT * FROM emprestimos WHERE usuario_id = $1",
      [req.params.id]
    );
    usuario.rows[0].emprestimos = emprestimos;
    for (const emprestimo of emprestimos) {
      const { rows: livro } = await query(
        "SELECT nome FROM livros WHERE id = $1",
        [emprestimo.livro_id]
      );
      emprestimo.livro = livro[0].nome;
    }

    res.json(usuario.rows[0]);
  } catch (error) {
    res.status(400).json(error.message);
  }
};


const postar = async (req, res) => {
  try {
    if (!req.body.nome) {
      return res.status(404).json({ erro: "Campo nome é obrigatório" });
    }
    if (req.body.nome.length > 60) {
      return res.status(404).json({ erro: "Nome muito grande" });
    }
    if (!req.body.cpf) {
      return res.status(404).json({ erro: "Campo cpf é obrigatório" });
    }
    if (req.body.cpf.length !== 11) {
      return res.status(404).json({ erro: "CPF incorreto" });
    }
    if (!req.body.email) {
      return res.status(404).json({ erro: "Campo email é obrigatorio" });
    }

    //Procurar email igual
    let listaEmail = await query("select * from usuarios where email = $1", [
      req.body.email,
    ]);
    if (listaEmail.rowCount !== 0) {
      return res.status(404).json({ erro: "Email já cadastrado" });
    }

    let listaCPF = await query("select * from usuarios where cpf = $1", [
      req.body.cpf,
    ]);
    if (listaCPF.rowCount !== 0) {
      return res.status(404).json({ erro: "CPF já cadastrado" });
    }

    const usuario = await query(
      "insert into usuarios (nome, idade, email, telefone, cpf) values( $1, $2, $3, $4, $5)",
      [
        req.body.nome,
        req.body.idade,
        req.body.email,
        req.body.telefone,
        req.body.cpf,
      ]
    );
    if (usuario.rowCount === 0) {
      return res
        .status(400)
        .json({ Mensagem: "Não foi possivel cadastrar o usuario" });
    }

    res.status(200).json({ Mensagem: "Usuario cadastrado com sucesso" });
  } catch {
    (error) => {
      res.json(error);
    };
  }
};


const atualizar = async (req, res) => {
  try {
    const usuario = await query("select * from usuarios where id = $1", [
      req.params.id,
    ]);
    if (usuario.rowCount === 0) {
      return res
        .status(404)
        .json({ erro: `Não existe usuario com ID = ${req.params.id}` });
    }

    if (req.body.nome.length > 60) {
      return res.status(404).json({ erro: "Nome muito grande" });
    }
    if (req.body.cpf) {
      return res.status(404).json({ erro: "CPF só existe 1 heheh" });
    }
    if (req.body.email) {
      let listaEmail = await query(
        "select email from usuarios where email = $1",
        [req.body.email]
      );
      if (listaEmail.rowCount !== 0) {
        return res.status(404).json({ erro: "Email já cadastrado" });
      }
    }

    const nome = req.body.nome ? req.body.nome : usuario.rows[0].nome;
    const email = req.body.email ? req.body.email : usuario.rows[0].email;
    const cpf = usuario.rows[0].cpf;
    const idade = req.body.idade ? req.body.idade : usuario.rows[0].idade;
    const telefone = req.body.telefone
      ? req.body.telefone
      : usuario.rows[0].telefone;
    const variavel = await query(
      "update usuarios set nome = $1, idade = $2, email = $3, telefone = $4, cpf = $5 where id = $6",
      [nome, idade, email, telefone, cpf, req.params.id]
    );

    res.json({ mensagem: "Usuario atualizado" });
  } catch (error) {
    res.status(400).json(error);
  }
};


async function excluir(req, res) {
  try {
    const usuario = await query("select * from usuarios where id = $1", [
      req.params.id,
    ]);
    if (usuario.rowCount === 0) {
      return res
        .status(404)
        .json({ erro: `Não existe usuario com ID = ${req.params.id}` });
    }

    const emprestimos = await query(
      "SELECT * FROM emprestimos WHERE usuario_id = $1",
      [req.params.id]
    );

    if (emprestimos.rowCount !== 0)
      return res
        .status(400)
        .json("Não é possível excluir usuario com emprestimo cadastrado");

    const excluido = await query("delete from usuarios where id = $1", [
      req.params.id,
    ]);

    if (excluido.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possivel excluir o usuario" });
    }

    res.status(200).json({ mensagem: "Usuario exluido com sucesso" });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  listar,
  listarId,
  postar,
  atualizar,
  excluir,
};
