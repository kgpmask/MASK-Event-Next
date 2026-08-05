import { io } from "socket.io-client";

const server = "http://localhost:3000";
const user = io(server, { transports: ["websocket"] });
const admin = io(server, { transports: ["websocket"] });

const question = {
  questionNo: 2,
  title: "Sample Round 2",
  question: "What is 2+2?",
  type: "mcq",
  options: "1,2,3,4",
  answer: "3",
  difficulty: "easy",
};

const events = {};

user.on("question", (q) => {
  events.question = Date.now();
  console.log("[user] received question:", q.questionNo);
});

user.on("timeout", () => {
  events.timeout = Date.now();
  console.log("[user] received timeout");
});

admin.on("connect", async () => {
  console.log("[admin] connected, calling start-question API");
  const res = await fetch(server + "/api/live/start-question", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: "sessionId=test-admin-session-1" },
    body: JSON.stringify({ questionNo: 2, type: "mcq", difficulty: "easy" }),
  });
  console.log("[admin] API status:", res.status, await res.text());
  admin.emit("question", question);
});

user.on("connect", () => {
  console.log("[user] connected");
});

setTimeout(() => {
  console.log("timeline:", JSON.stringify(events));
  const diff = events.timeout - events.question;
  console.log("time until timeout (ms):", diff);
  process.exit(0);
}, 32000);
