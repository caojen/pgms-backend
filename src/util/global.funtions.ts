import * as global from "../../config.json";
import * as mysql from 'mysql2/promise';
import { Request } from 'express';
import * as strftime from 'strftime';

const executePool = mysql.createPool({
  host: process.env["MYSQL_HOST"],
  port: parseInt(process.env["MYSQL_PORT"]),
  user: process.env["MYSQL_USER"],
  database: process.env["MYSQL_DATABASE"],
  password: process.env["MYSQL_PASSWORD"],
  connectionLimit: 20,
  waitForConnections: true,
  queueLimit: 0
});

async function queryDb(sql: string, params: any[]) {
  return (await executePool.query(sql, params))[0] as any[];
}

export function getUserType(user: any) {
  if(!user) {
    return null;
  } else {
    const enums = ['student', 'teacher', 'admin', 'bistuent'];
    for(const item in enums) {
      if(!!user[enums[item]]) {
        return enums[item];
      }
    }
  }
}

// 得到数据库中settings表的某些键值:
export async function getConfigs(keys: string[]) {
  const sql = `
    SELECT \`key\`, value, lastUpdate, lastUpdateAdmin
    FROM settings;
  `;
  const settings = await queryDb(sql, []);
  const result = {};
  for(const index in settings) {
    const setting = settings[index];
    if(keys.indexOf(setting.key) !== -1) {
      result[setting.key] = {
        ...setting,
        value: JSON.parse(setting.value).value
      };
    }
  }
  return result as any;
}

export function getIp(req: Request): string {
  try {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0];
    return ip || req.socket.remoteAddress || req.ip
  } catch {
    return 'unknown';
  }
}

export function timestamp2Datetime(timestamp: number): string {
  return strftime('%F %T', new Date(timestamp));
}
