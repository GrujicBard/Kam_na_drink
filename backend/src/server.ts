import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import express from 'express';
import 'express-async-errors';
import apiRouter from './routes/api';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

// Constants
const app = express();
app.use(cors())

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/***********************************************************************************
 *                                  Swagger
 **********************************************************************************/
// Add api router
app.use('/api', apiRouter);

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express app swagger',
      version: '1.0.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      components: {
        securitySchemes: {
          jwt: {
            type: "http",
            scheme: "bearer",
            in: "header",
            bearerFormat: "JWT"
          },
        }
      }
    },
    security: [{
      jwt: []
    }],
    servers: [
      {
        url: `http://localhost:${process.env.SERVER_PORT}/`,
      },
    ],
  },
  swagger: "2.0",
  apis: ['./src/routes/*']
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;