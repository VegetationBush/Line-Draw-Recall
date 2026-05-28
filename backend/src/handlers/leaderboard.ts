import '@/config/env'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { LeaderboardResponse } from '@line-draw-recall/shared';
import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
}

const getLeaderboard = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const result = await getPool().query(
    "SELECT * FROM leaderboard ORDER BY score DESC"
  );
  console.log(result.rows)

  const data: LeaderboardResponse = {
    entries: [
      { name: "Alice", score: 1000 },
      { name: "Bob", score: 800 },
      { name: "Jack", score: 700 },
      { name: "Quinn", score: 600 },
      { name: "Geronimo", score: 500 },
    ],
    lastUpdated: Date.now(),
  };
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};

const addScore = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const data = JSON.parse(event.body || '{}');
  return {
    statusCode: 201,
    body: JSON.stringify({ message: 'Score added' })
  };
};

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  if (event.requestContext.http.method === 'GET') {
    return getLeaderboard(event);
  } else if (event.requestContext.http.method === 'POST') {
    return addScore(event);
  }
  console.log('=== FULL EVENT ===');
  console.log(JSON.stringify(event, null, 2));
  console.log('=== EVENT KEYS ===');
  console.log(Object.keys(event));
  console.log('=== REQUEST CONTEXT ===');
  console.log(JSON.stringify(event.requestContext, null, 2));
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};