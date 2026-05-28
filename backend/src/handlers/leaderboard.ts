import '@/config/env'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { LeaderboardResponse } from '@line-draw-recall/shared';
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

interface LeaderboardRow {
  id: number,
  name: string,
  score: number,
  created_at: string,
}

const getLeaderboard = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const result = await pool.query(
    "SELECT * FROM leaderboard ORDER BY score DESC"
  );

  const data: LeaderboardResponse = {
    entries: [],
    lastUpdated: Date.now(),
  };
  result.rows.forEach((item: LeaderboardRow) => {
    data.entries.push({
      name: item.name,
      score: item.score,
    })
  })

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