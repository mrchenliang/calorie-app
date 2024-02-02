import jwt from "jsonwebtoken";
import crypto from 'crypto';

const JWT_SECRET = "JWT_SECRET";

export const decodeRequestToken = (req, res, next) => {
  const decodedToken = jwt.verify(req.headers.authorization, JWT_SECRET);
  req.headers = { ...req.headers, decodedToken: { ...decodedToken } };
  next();
};

export const checkForAdmin = (req, res, next) => {
  // admin token
  if (req.headers.decodedToken.role !== "admin") {
    return res
      .status(404)
      .json({
        status: 404,
        message: "You are not authorized to perform this action",
      });
  }
  next();
};

export const checkForUser = (req, res, next) => {
  // user token
  if (req.headers.decodedToken.role !== "user") {
    return res
      .status(404)
      .json({
        status: 404,
        message: "You are not authorized to perform this action",
      });
  }
  next();
};

export const generatePassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  const n = charset.length;

  for (let i = 0; i < length; ++i) {
    password += charset.charAt(crypto.randomInt(n));
  }
  return password;
};

export const generateToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET);
  return token;
};
