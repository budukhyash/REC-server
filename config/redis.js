import redis from "redis";

export const client = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
});

client.on("error", (err) => {
	console.log("Error " + err);
});
