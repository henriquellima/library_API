# library_API

This API countains three Tables: Users, autors, books and lendings.

# Autors:
- Register -
POST  /autores  -
JSON Body: {
	"nome": "autor_name",
	"idade": autor_i
  }
 
 - Update - 
 PUT  /autores/:id_autor  -
JSON Body: {
	"nome": "autor_name",
	"idade": autor_age
  }
  
 - List All -
  GET  /autores
  
 - List One - 
 GET  /autores/:id_autor

 - Delete -
  DELETE  /autores/:id_autor
  
  
  # Users:
  - Register -
POST  /usuarios  -
 JSON Body: {
  "nome": "user_name",
  "idade": user_age,
  "email": "user_email",
  "telefone": "user_phone",
  "cpf": "user_cpf"
}
 
 - Update - 
 PUT  /usuarios/:id_user  -
 JSON Body: {
  "nome": "user_name",
  "idade": user_age,
  "email": "user_email",
  "telefone": "user_phone",
  "cpf": "user_cpf"
}
  
 - List All -
  GET  /usuarios
  
 - List One - 
 GET  /usuarios/:id_user

 - Delete -
  DELETE - /usuarios/:id_user
  Only possible when the user have no pendents lendings.
 
 
 # Books 
 - Register -
POST  /livros  -
 JSON Body: {
  "nome": "book_name",
  "data_publicacao": publication date,
  "editora": "publishing company",
  "telefone": "book_phone",
  "genero": "book_genre"
  }
 
 - Update - 
 PUT  /livros/:id_book  -
 JSON Body: {
  "nome": "book_name",
  "data_publicacao": publication date,
  "editora": "publishing company",
  "telefone": "book_phone",
  "genero": "book_genre"
  }
  
 - List All -
  GET  /localhost:8000/livros
  
 - List One - 
  GET  /livros/:id_book

 - Delete -
  DELETE  /livros/:id_book
  Only possible when the book have no pendents lendings.
  
 # Lendings
  - Register -
 POST  /emprestimos  -
 JSON BODY: {
  "usuario_id": 2,
  "livro_id": 6,
 "status": "pendente" (only accepts "pendente"(pending) or "Devolvido"(returned) )
  }

   - Status Update - 
 PUT  /emprestimos/:id_lending  -
 JSON Body: {
  "status": "pendente" (only accepts "pendente"(pending) or "Devolvido"(returned) )
  }
  
 - List All -
  GET  /livros
  
 - List One - 
 GET  /livros/:id_lending

 - Delete -
  DELETE  /livros/:id_lending
  Only possible when the book have no pendents lendings.
 
 
