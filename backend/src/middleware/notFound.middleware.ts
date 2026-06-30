import { Request, Response, NextFunction } from 'express';

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: `API Route Not Found - [${req.method}] ${req.originalUrl}` });
};
export default notFoundMiddleware;
