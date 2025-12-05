import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';


//ja nesse teste ele faz a criação de um usuario e testa todos os endpoints feitos da api
describe('Orders E2E', () => {
  let app: INestApplication;
  let token: string;
  let createdOrderId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
      });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: '123456',
      });

    token = loginRes.body.access_token;
  });


  it('Deve criar um pedido (POST /orders)', async () => {
    const res = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        number: 'P-2000',
        expectedDeliveryDate: '2025-12-10',
        clientName: 'Cliente Teste',
        clientDocument: '999.999.999-99',
        deliveryAddress: 'Rua Teste, 123',
        items: [
          { description: 'Produto Teste A', price: 10.5 },
          { description: 'Produto Teste B', price: 20.0 },
        ],
        status: 'pendente',
      });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    createdOrderId = res.body._id;
  });

  it('Deve listar pedidos (GET /orders)', async () => {
    const res = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('Deve editar o pedido (PATCH /orders/:id)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'enviado' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('enviado');
  });

  it('Deve excluir logicamente o pedido (DELETE /orders/:id)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.deleted).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
