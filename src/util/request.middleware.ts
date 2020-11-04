//! 通过logger打出请求

import { Request } from "express";
import { Logger } from "@nestjs/common";

const logger = new Logger("Request");

export function requestListening(req: Request, res: Response, next: any) {
  logger.log(objectToLog({
    method: req.method,
    url: req.url,
    ip: req.socket.remoteAddress,
  }));
  next();
}

function objectToLog(object: any) {
  return `${object.ip} ${object.method} ${object.url}`;
}