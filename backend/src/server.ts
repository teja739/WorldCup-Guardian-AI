import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  // Connect to database
  await connectDB();

  // Listen
  app.listen(PORT, () => {
    console.log(`WorldCup Guardian Server is running on port ${PORT}`);
  });
};

startServer();
