import express, {Request, Response, NextFunction, Application} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { specs } from './config/swagger';
import v1Router from './routes/v1/index';


const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req: Request, res: Response) => {
  return res.status(200).send(
    `<div style="text-align:center";> <br />
<h2>Welcome to Lifebook App</h2>
<h3><a href='/api-docs'> Goto API documentation</a></h3>
</div>`
  );
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Documentation',
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
    },
}));


// V1 routes
app.use('/api/v1', v1Router);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
