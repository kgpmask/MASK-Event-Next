import { io } from "socket.io-client";

const isBrowser = typeof window !== "undefined";

const socket = isBrowser ? io() : {};

export default socket;