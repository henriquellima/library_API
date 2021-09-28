const pool = require("../conexao");
const { query } = pool;

const listar = async (req, res) => {
  try {
    const emprestimos = await query(`
    SELECT emprestimos.id, usuarios.nome AS usuario, usuarios.telefone, usuarios.email, livros.nome AS livro, status
    FROM emprestimos 
    JOIN usuarios ON usuarios.id = emprestimos.usuario_id 
    JOIN livros ON livros.id = emprestimos.livro_id`);

    res.status(400).json(emprestimos.rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const listarID = async (req, res) => {
  try {
    const emprestimos = await query(`
    SELECT emprestimos.id, usuarios.nome AS usuario, usuarios.telefone, usuarios.email, livros.nome AS livro, status
    FROM emprestimos 
    JOIN usuarios ON usuarios.id = emprestimos.usuario_id 
    JOIN livros ON livros.id = emprestimos.livro_id
    WHERE emprestimos.id = $1`, [req.params.id]);

    if (emprestimos.rowCount === 0) {
      return res.status(404).json({ erro: "Emprestimo não encontrado" });
    }

    res.status(200).json(emprestimos.rows[0]);
  } catch (error) {
    res.status(200).json(error.message);
  }
};


const excluir = async (req, res) => {
  try {
    const emprestimo = await query("select * from emprestimos where id = $1", [
      req.params.id,
    ]);

    if (emprestimo.rowCount === 0) {
      return res.status(400).json({ erro: "Emprestimo não encontrado" });
    }
    const excluido = await query("delete from emprestimos where id = $1", [
      req.params.id,
    ]);
    if (excluido.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "Não foi possivel excluir o emprestimo" });
    }
    return res
      .status(200)
      .json({ mensagem: "Emprestimo exlcuido com sucesso" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};


const atualizar = async (req, res) => {
  try {
    const emprestimoValido = await query(
      "select * from emprestimos where id = $1",
      [req.params.id]
    );
    if (emprestimoValido.rowCount === 0) {
      return res.status(404).json({ erro: "Emprestimo não existe" });
    }

    if (!req.body.status) {
      return res.status(404).json({
        erro: "Para sua segurança, envie um status com valor 'devolvido' ou 'pendente' para atualizar",
      });
    }
    if (req.body.status !== "pendente" && req.body.status !== "devolvido") {
      return res
        .status(404)
        .json({ erro: "status só pode ter valores 'devolvido' e 'pendente'" });
    }
    const statusNovo = await query(
      "update emprestimos set status = $1 where id = $2",
      [req.body.status, req.params.id]
    );
    if (statusNovo.rowCount === 0) {
      res
        .status(200)
        .json({ mensagem: "Não foi possivel atualizar o emprestimo" });
    }
    res.status(200).json({ mensagem: "Emprestimo atualizado com sucesso" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};


const postar = async (req, res) => {
  try {
    if (req.body.livro_id) {
      const livroCadastrado = await query(
        "select * from livros where id = $1",
        [req.body.livro_id]
      );
      if (livroCadastrado.rowCount === 0) {
        return res.status(404).json({ erro: "Livro não existe" });
      }
    }
    if (req.body.usuario_id) {
      const usuarioCadastrado = await query(
        "select * from usuarios where id = $1",
        [req.body.usuario_id]
      );
      if (usuarioCadastrado.rowCount === 0) {
        return res.status(404).json({ erro: "Usuario não existe" });
      }
    }
    if (req.body.status !== "pendente" && req.body.status !== "devolvido") {
      return res
        .status(404)
        .json({ erro: "status só pode ter valores 'devolvido' e 'pendente'" });
    }

    if (!req.body.usuario_id) {
      res.status(400).json({ erro: 'Campo "usuario_id" é obrigatório!' });
    }
    if (!req.body.livro_id) {
      res.status(400).json({ erro: 'Campo "livro_id" é obrigatório!' });
    }
    if (!req.body.status) {
      res.status(400).json({ erro: 'Campo "status" é obrigatório!' });
    }

    const emprestimo = await query(
      "insert into emprestimos (usuario_id, livro_id, status) values($1, $2, $3)",
      [req.body.usuario_id, req.body.livro_id, req.body.status]
    );

    if (emprestimo.rowCount === 0) {
      res.status(400).json({ mensagem: "Não foi possivel fazer o emprestimo" });
    }
    res.status(200).json({ mensagem: "Emprestimo criado com sucesso" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  listar,
  listarID,
  atualizar,
  postar,
  excluir,
};
