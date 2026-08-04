require("dotenv").config();
const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const mongoose = require("mongoose");
const dbInit = require("./database/dbInit.js");
const flushCachedRecords = require("./utils/flushCachedRecords.js");
// import { getUserFromSession } from "./database/models/User.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async () => {
  const httpServer = createServer(handler);
  await dbInit();
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Connection count:", io.engine.clientsCount);
    socket.join(process.env.QUIZ_ID);

		socket.on('question', question => {
			io.to(process.env.QUIZ_ID).emit('question', question);
			const hardBonus = question.difficulty === 'hard' ? 10_000 : question.difficulty === 'insane' ? 20_000 : 0;
			setTimeout(() => io.to(process.env.QUIZ_ID).emit('timeout', ''), (question.type === 'mcq' ? 25_000 : question.type === 'mtf' ? 45_000 : 35_000) + hardBonus);
		});

		socket.on('end-quiz', () => {
			io.to(process.env.QUIZ_ID).emit('end-quiz', '');
		});
	});

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`Ready on http://${hostname}:${port}`);
    });

  let shuttingDown = false;

  const flushAndShutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`Received ${signal}, flushing cached records...`);

    const forceExit = setTimeout(() => {
      console.error("Shutdown timed out while flushing, exiting anyway.");
      process.exit(1);
    }, 5_000);

    const flush = async () => {
      const count = await flushCachedRecords();
      if (count) console.log(`${count} cached records flushed to the database.`);
      clearTimeout(forceExit);
      await mongoose.connection.close();
      process.exit(0);
    };

    flush().catch((err) => {
      clearTimeout(forceExit);
      console.error("Error flushing cached records:", err);
      process.exit(1);
    });
  };

  process.on("SIGINT", () => flushAndShutdown("SIGINT"));
  process.on("SIGTERM", () => flushAndShutdown("SIGTERM"));
  process.on("SIGUSR2", () => flushAndShutdown("SIGUSR2"));
});
