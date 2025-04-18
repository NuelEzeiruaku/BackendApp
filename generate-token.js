// generate-token.js
import jwt from 'jsonwebtoken';

// Replace with your actual user ID
const userId = '68006c1bf20d849683f833b9';

// Using the JWT_SECRET from your .env file
const jwtSecret = 'secret';

// Set expiration to 1 day from now, matching your JWT_EXPIRES_IN setting
const token = jwt.sign(
  { userId: userId },
  jwtSecret,
  { expiresIn: '1d' }
);

console.log('Your new JWT token:');
console.log(token);