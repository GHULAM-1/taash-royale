import express from 'express';
import { MongoClient, Db, ObjectId } from 'mongodb';
import dotenv from "dotenv";
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

interface User {
  _id?: ObjectId;
  email: string;
  fullName: string;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserRequest {
  email: string;
  fullName: string;
  imageUrl?: string;
}


// Middleware
app.use(express.json());

// MongoDB connection
const MONGODB_URI: string = process.env.MONGODB_URI as string;

let db: Db;

// Connect to MongoDB
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db();
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });



// User authentication endpoint
app.post('/api/user', async (req: any, res: any) => {
  try {
    const { email, fullName, imageUrl }: UserRequest = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    const usersCollection = db.collection<User>('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      return res.status(200).json({
        message: 'User already exists',
        user: existingUser,
        isNewUser: false
      });
    }

    // Create new user
    const newUser: User = {
      email,
      fullName,
      imageUrl: imageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);
    
    res.status(201).json({
      message: 'User created successfully',
      user: { ...newUser, _id: result.insertedId },
      isNewUser: true
    });

  } catch (error) {
    console.error('Error handling user:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});