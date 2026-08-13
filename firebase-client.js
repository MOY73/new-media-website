/**
 * Firebase client bootstrap for New Media.
 *
 * This module is intentionally lazy: Firebase is downloaded only on pages that
 * import and use it. The existing employee portal keeps using its current
 * server-side authentication and database until a controlled migration is made.
 */

const firebaseConfig = Object.freeze({
  apiKey: "AIzaSyCD863vxkq4SnpQ9pQ6t6l7IKC2MD071-s",
  authDomain: "new-media-website-6d275.firebaseapp.com",
  projectId: "new-media-website-6d275",
  storageBucket: "new-media-website-6d275.firebasestorage.app",
  messagingSenderId: "859263159634",
  appId: "1:859263159634:web:f3bce7a653ee9a9594fe8b",
});

let servicesPromise;

export function getFirebaseServices() {
  if (!servicesPromise) {
    servicesPromise = Promise.all([
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"),
    ]).then(([appSdk, authSdk, firestoreSdk]) => {
      const app = appSdk.getApps().length
        ? appSdk.getApp()
        : appSdk.initializeApp(firebaseConfig);

      return {
        app,
        auth: authSdk.getAuth(app),
        db: firestoreSdk.getFirestore(app),
        authSdk,
        firestoreSdk,
      };
    });
  }

  return servicesPromise;
}

export { firebaseConfig };
