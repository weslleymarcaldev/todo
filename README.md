# 📋 Projeto ToDo API

API de Gerenciamento de Listas e Tarefas (ToDo List) desenvolvida em **Laravel 10** com autenticação via **JWT**.

---

## 🚀 Tecnologias Utilizadas

- PHP 8.2
- Laravel 10
- MySQL
- JWT-Auth (`php-open-source-saver/jwt-auth`)
- Composer

---

## ⚙️ Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Selecionar a Branch de Desenvolvimento

```bash
git checkout develop
```

> Existem também as branches `install/laravel` e `install/jwt` para conferência de versões específicas.

### 3. Instalar as Dependências

```bash
composer install
```

### 4. Configurar o Ambiente

Copiar o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Gerar a chave da aplicação:

```bash
php artisan key:generate
```

Editar o `.env` com suas credenciais do banco de dados:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nome_do_banco
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

### 5. Criar Banco de Dados

```sql
CREATE DATABASE nome_do_banco;
```

### 6. Configurar o JWT

```bash
php artisan jwt:secret
```

---

## 🛠️ Rodar as Migrations

```bash
php artisan migrate
```

---

## 🚀 Rodar o Servidor de Desenvolvimento

```bash
php artisan serve
```

A aplicação estará disponível em: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🔑 Rotas de Autenticação (JWT)

| Método | Rota         | Controller                  | Descrição                        |
|--------|--------------|------------------------------|----------------------------------|
| POST   | /api/login    | API\AuthController@login     | Realiza login e gera token JWT   |
| POST   | /api/logout   | API\AuthController@logout    | Realiza logout                   |
| POST   | /api/refresh  | API\AuthController@refresh   | Atualiza token                   |
| POST   | /api/register | API\AuthController@register  | Registra novo usuário            |

---

## 🗂️ Funcionalidades

- Cadastro de usuário
- Login com geração de token JWT
- Refresh e Logout de sessão
- CRUD de Listas
- CRUD de Tarefas
- Associação de Tarefas às Listas
- Proteção de rotas via Middleware JWT

---

## 👨‍💻 Estrutura de Branches

| Branch         | Descrição                         |
|----------------|-----------------------------------|
| install/laravel | Instalação pura do Laravel        |
| install/jwt    | Instalação do pacote JWT-Auth      |
| develop        | Desenvolvimento contínuo          |

---

## 🧪 Testes

Para testar a API, utilize ferramentas como:

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)

---

## 📜 Licença

Este projeto está licenciado sob a licença [MIT](LICENSE).

---

## ✨ Autor

Feito com 💻 por **Weslley Marçal**.  
Entre em contato!

---

## 🎯 Observação

> Este projeto ainda está em desenvolvimento contínuo.  
> Sinta-se à vontade para abrir issues, pull requests ou sugestões! 🚀