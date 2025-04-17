import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.models.js";
import jwt from 'jsonwebtoken'

// if someone is making a request get user details -> authorize middelware -> verify -> if valid -> next -> get access

const authorize = async (req, res, next) => {
    try {
      let token;

      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split (' ')[1];
      }

      if(!token) return res.status(401).json({ message: 'Unauthorized'});

      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.userId);

      if(!user) return res.status(401).json({ message: 'Unauthorized' });

      req.user = user;

      next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
}

export default authorize;