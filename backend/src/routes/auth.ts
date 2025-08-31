import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { generateToken } from '../utils/auth';

const router = Router();

interface RegisterRequest {
  name: string;
  phone: string;
}

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, phone }: RegisterRequest = req.body;

    if (!name || !phone) {
      return res.status(400).json({ 
        message: 'Name and phone number are required' 
      });
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return res.status(400).json({ 
        message: 'Please provide a valid phone number' 
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      const token = generateToken(existingUser.id);
      return res.json({
        message: 'Welcome back!',
        user: {
          id: existingUser.id,
          name: existingUser.name,
          phone: existingUser.phone
        },
        token
      });
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        phone: phone.trim()
      }
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Registration successful!',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  const token = req.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = JSON.parse(global.Buffer.from(token.split('.')[1], 'base64').toString());
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, phone: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;