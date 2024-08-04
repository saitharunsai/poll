import { ACCESS_TOKEN_KEY } from "@/redux/slices/authSlice";
import {
  Poll,
  setCurrentPoll,
  updatePoll,
  removePoll,
  clearCurrentPoll,
} from "@/redux/slices/pollSlice";
import { AppDispatch } from "@/redux/store";
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  initialize(dispatch: AppDispatch) {
    if (this.socket) {
      console.warn(
        "Socket is already initialized. Closing existing connection."
      );
      this.socket.close();
    }

    this.socket = io(
      import.meta.env.VITE_APP_API_URL || "http://localhost:8000",
      {
        auth: { token: localStorage.getItem(ACCESS_TOKEN_KEY) },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        transports: ["websocket"],
      }
    );

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    this.socket.on("disconnect", (reason) => {
      console.log(`Disconnected: ${reason}`);
      if (reason === "io server disconnect") {
        // Reconnect manually if the server disconnected
        this.socket?.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
    });

    this.socket.on("pollStarted", (updatedPoll: Poll) => {
      dispatch(setCurrentPoll(updatedPoll));
      dispatch(updatePoll(updatedPoll));
    });

    this.socket.on("pollUpdated", (updatedPoll: Poll) => {
      dispatch(updatePoll(updatedPoll));
    });

    this.socket.on("pollEnded", (pollId: string) => {
      dispatch(removePoll(pollId));
      dispatch(clearCurrentPoll());
    });

    this.socket.on(
      "userKicked",
      ({ pollId, userId }: { pollId: string; userId: string }) => {
        console.log(`User ${userId} was kicked from poll ${pollId}`);
      }
    );
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      console.log("Socket connection closed");
    }
  }

  joinPoll(pollId: string) {
    this.socket?.emit("joinPoll", pollId);
  }

  leavePoll(pollId: string) {
    this.socket?.emit("leavePoll", pollId);
  }

  answerPoll(pollId: string, answer: string) {
    this.socket?.emit("answerPoll", { pollId, answer });
  }

  startPoll(poll: Poll) {
    this.socket?.emit("startPoll", poll);
  }

  endPoll(pollId: string) {
    this.socket?.emit("endPoll", pollId);
  }

  kickUser(pollId: string, userId: string) {
    this.socket?.emit("kickUser", { pollId, userId });
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
