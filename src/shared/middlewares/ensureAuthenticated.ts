import { Response, Request, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import jwtConfig from "../../config/auth";
import AppError from "../errors/AppError";

interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token is missing", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, jwtConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError("JWT token is missing", 401);
  }
}
