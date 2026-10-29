import { io } from "socket.io-client";
import { auth } from "../firebase/firebase.js";
import { getAPIBaseURL } from "../utils/ipDetection.js";

export const createMarketplaceSocket = () =>
  io(getAPIBaseURL(), {
    autoConnect: false,
    auth: (callback) => {
      const user = auth.currentUser;
      if (!user) {
        callback({ token: "" });
        return;
      }

      user
        .getIdToken()
        .then((token) => callback({ token }))
        .catch((error) => {
          console.error("Unable to authenticate marketplace socket:", error);
          callback({ token: "" });
        });
    },
  });
