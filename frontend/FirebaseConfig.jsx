import { initializeApp } from "firebase/app";
import { getToken, getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCAK0dlg3eHSEIlqCUJ1BWt6PTrGlGxSU0",
    authDomain: "creativasapp-fd6c9.firebaseapp.com",
    projectId: "creativasapp-fd6c9",
    storageBucket: "creativasapp-fd6c9.appspot.com",
    messagingSenderId: "115048799962",
    appId: "1:115048799962:web:d0e4d2c4ea8e8353d08fe3",
    measurementId: "G-E6Y6L46LSR"
};

export const firebaseApp = initializeApp(firebaseConfig);

export const messaging = getMessaging(firebaseApp);

// getOrRegisterServiceWorker function is used to try and get the service worker if it exists, otherwise it will register a new one.
export const getOrRegisterServiceWorker = () => {
    if (
        "serviceWorker" in navigator &&
        typeof window.navigator.serviceWorker !== "undefined"
    ) {
        return window.navigator.serviceWorker
            .getRegistration('/')
            .then((serviceWorker) => {
                if (serviceWorker) return serviceWorker;
                return window.navigator.serviceWorker.register(
                    "/firebase-messaging-sw.js",
                    {
                        scope: '/',
                    }
                );
            });

    }
    throw new Error("The browser doesn`t support service worker.");
};


// getFirebaseToken function generates the FCM token 
export const getFirebaseToken = async () => {
    try {
        const messagingResolve = await messaging;
        if (messagingResolve) {
            return getOrRegisterServiceWorker().then((serviceWorkerRegistration) => {
                return Promise.resolve(
                    getToken(messagingResolve, {
                        vapidKey: "BIV-oeOTYGFhTFwSwG3TpWGqAyoDNS-6_ZUDTsFSs-J_WtLhvR-ossAZYsrq5fOcYTlF_LwvEMpA-PLn_Fc-qlA",
                        serviceWorkerRegistration,
                    })
                );
            });
        }
    } catch (error) {
        console.log("An error occurred while retrieving token. ", error);
    }
};

const UrlFirebaseConfig = new URLSearchParams(
    {
      apiKey: "AIzaSyCAK0dlg3eHSEIlqCUJ1BWt6PTrGlGxSU0",
      authDomain: "creativasapp-fd6c9.firebaseapp.com",
      projectId: "creativasapp-fd6c9",
      storageBucket: "creativasapp-fd6c9.appspot.com",
      messagingSenderId: "115048799962",
      appId: "1:115048799962:web:d0e4d2c4ea8e8353d08fe3",
      measurementId: "G-E6Y6L46LSR"
    }.toString()
  );
  
  const swUrl = `http://127.0.0.1:7070/firebase-messaging-sw.js?${UrlFirebaseConfig}`;
