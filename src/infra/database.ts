import { Client } from "pg";

async function query(queryObject: string) {
  const client = databaseConect();
  await client.connect();
  const result = await client.query(queryObject);
  await client.end();
  return result;
}

function databaseConect() {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "postgres",
    password: "N@tacatuchia1",
  });

  return client;
}

export default {
  query: query,
  databaseConect: databaseConect,
};
