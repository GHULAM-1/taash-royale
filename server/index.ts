import express from 'express';
import chatRoutes from './routes/chatRoutes';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/chat', chatRoutes);

app.get('/', (_req, res) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
//