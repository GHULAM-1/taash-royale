import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import { connectDB } from './utils/db';
import gameRoutes from './routes/gameRoutes';
import tokenRoutes from './routes/tokenRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(userRoutes);
app.use(gameRoutes);
app.use(tokenRoutes);

app.get('/', (_req, res) => {
  res.send('Hello, Express with TypeScript!');
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
//