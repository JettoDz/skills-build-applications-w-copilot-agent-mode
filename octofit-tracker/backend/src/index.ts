import express from 'express';
import db from './config/database';

const app = express();
const port = Number(process.env.PORT || 8000);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

db.once('open', () => {
  app.listen(port, () => {
    console.log(`OctoFit backend listening on ${baseUrl}`);
  });
});
