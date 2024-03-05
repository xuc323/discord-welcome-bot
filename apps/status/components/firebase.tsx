// Import the functions you need from the SDKs you need
import { getApps, initializeApp, registerVersion } from "firebase/app";
import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  version,
} from "react";
import type { ReactNode } from "react";
import { getPerformance } from "firebase/performance";
import type { FirebasePerformance } from "firebase/performance";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

type FirebaseContextType = {
  app?: FirebaseApp;
  analytics?: Analytics;
  performance?: FirebasePerformance;
};

const FirebaseContext = createContext<FirebaseContextType>({
  app: undefined,
  analytics: undefined,
  performance: undefined,
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  // Initialize Firebase
  const app = useMemo(() => {
    const existingApp = getApps().find((app) => app.name === "[DEFAULT]");
    if (existingApp) {
      return existingApp;
    }

    const reactVersion = version || "unknown";
    registerVersion("react", reactVersion);
    return initializeApp(firebaseConfig);
  }, []);

  // Initialize Analytics
  const [analytics, setAnalytics] = useState<Analytics | undefined>(undefined);

  // Initialize Performance
  const [performance, setPerformance] = useState<
    FirebasePerformance | undefined
  >(undefined);

  useEffect(() => {
    const checkIsSupported = async () => {
      if (await isSupported()) {
        setAnalytics(getAnalytics(app));
        setPerformance(getPerformance(app));
      } else {
        setAnalytics(undefined);
        setPerformance(undefined);
      }
    };

    checkIsSupported();
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, analytics, performance }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const { app } = useContext(FirebaseContext);
  if (!app) {
    throw new Error(
      "Cannot call useFirebaseApp unless your component is within a FirebaseAppProvider."
    );
  }
  return app;
}

export function useAnalytics() {
  const { analytics } = useContext(FirebaseContext);

  return analytics;
}

export function usePerformance() {
  const { performance } = useContext(FirebaseContext);

  return performance;
}
