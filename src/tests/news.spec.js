import request from "supertest";
import app from "../app.js";

describe('GET /api/news', () => {
    it('Debería obtener las noticias con éxito', async () => {
      const response = await request(app).get('/api/news').send();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('news');
      expect(response.body).toHaveProperty('pages');
      expect(Array.isArray(response.body.news)).toBe(true);
      expect(typeof response.body.pages).toBe('number');
    });
});
  
describe('GET /api/news/:id', () => {
    it('Debería obtener la notici con éxito', async () => {
        const id = 2;
        const response = await request(app).get(`/api/news/${id}`).send();
        expect(response.status).toBe(200);
        expect(response.body.id == id).toBe(true);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('dateNew');
        expect(response.body).toHaveProperty('description');
        expect(response.body).toHaveProperty('category');
        expect(response.body).toHaveProperty('img');
    });
});

describe('POST /create-new', () => {
    it('Debería crear la noticia con éxito', async () => {
        const newNew = {
            title: "¡Gran éxito en la Feria Gastronómica!", 
            date_new: "2024-01-25", 
            description: "El Club Social Harmony se llenó de deliciosos aromas y sabores durante su reciente Feria Gastronómica, celebrada el pasado sábado 22 de enero. Los miembros y visitantes disfrutaron de una tarde llena de exquisiteces culinarias, donde se fusionaron los más exquisitos platillos de la cocina local e internacional.", 
            id_category: 3, 
            img: "https://acortar.link/3a2E2g"
          };
        const response = await request(app)
                                .post(`/api/create-new`)
                                .set('Authorization', `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0NSwidXNlcl9yb2wiOiJhZG1pbiIsImlhdCI6MTcwNTAxNTk3NX0.3PhUTrw2SMkwySXkWAM-ZcOUDTubweMbb44GomgLLAM`)
                                .send(newNew);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('new');
    });
});