# 🏠 Na Porta API

-> Aplicação backend com NestJS e microserviço Go para cálculo de pedidos, utilizando MongoDB.

## ⚙️ Tecnologias

- NestJS
- TypeORM (MongoDB)
- JWT para autenticação
- Microserviço Go
- Axios para requisições HTTP
- Jest para testes E2E
- MongoDB

## 🚀 Instalação e Execução Local
### 1️⃣ MongoDB

Certifique-se de ter MongoDB rodando localmente ou via Atlas.

No .env configure (deixei o meu .env ja de exemplo pra facilitar):

```bash
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=naporta
JWT_SECRET=senhasecreta123
JWT_EXPIRES_IN=3600s
PORT=3000
```

### 2️⃣ Backend NestJS

Entre na pasta do backend:

```bash
cd backend/na-porta-api
```

Instale dependências:

```bash
npm install
```

Rode a aplicação:

```bash
npm run start:dev
```

A API estará disponível em http://localhost:3000.

### 3️⃣ Microserviço Go

Entre na pasta:
```bash
cd backend/naporta-go
```

Rode o serviço:
```bash
go mod tidy
go run main.go
```


##  🔐 Autenticação

Registrar usuário
```bash
POST /auth/register
Body:
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

Login
```bash
POST /auth/login
Body:
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

Retorna token JWT:
```bash
{
  "access_token": "<token>"
}
```



Use no header de pedidos:
```bash
Authorization: Bearer <token>
```

## 📌 Endpoints de Pedidos

| Método | Endpoint                      | Descrição                   |
| ------ | ----------------------------- | --------------------------- |
| POST   | `/orders`                     | Criar pedido                |
| GET    | `/orders`                     | Listar pedidos              |
| GET    | `/orders/:id`                 | Pedido por ID               |
| PATCH  | `/orders/:id`                 | Atualizar um peidido        |
| DELETE | `/orders/:id`                 | Exclusão lógica             |
| POST   | `/orders/calculate-order/:id` | Calcula total via GoService |


Criar um pedido
POST /orders
```bash
{
  "number": "P-1008",
  "expectedDeliveryDate": "2026-01-02",
  "clientName": "João Silva",
  "clientDocument": "123.456.789-00",
  "deliveryAddress": "Rua Central, 123",
  "items": [
    { "description": "Produto A", "price": 50.9 },
    { "description": "Produto B", "price": 20.5 }
  ],
  "status": "novopedido"
}
```

Atualizar um pedido
PATCH /orders/:id

```bash
atualzinado o nome e o status do pedido
{
  "clientName": "João Pedro Silva",
  "status": "em_transporte"
}
```

O payload de produtos para cálculo deve incluir description, price e quantity.

## 🧪 Testes E2E

Para rodar testes:
```bash
npm run test:e2e
```


Necessário que o microserviço Go esteja rodando e o MongoDB acessível.

## ⚠️ Observações

- MongoDB é obrigatório. Configure no .env.
- Este projeto foi um desafio interessante, pois permitiu aplicar meu conhecimento em NestJS, desta vez integrando com um microserviço em Go, uma tecnologia que me interessa muito aprender.
- Não foi possível incluir Docker neste projeto devido a limitações de virtualização da minha máquina, mas certamente faria parte do setup para facilitar o deploy e a execução em qualquer ambiente.


JWT: configure JWT_SECRET no .env.

GoService: precisa estar rodando

Testes e endpoints dependem do token JWT válido.
