import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { EventConfig } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyAHulxsjNH6Ut8_duzkMePxzDtEvUfpOwg",
  authDomain: "folkation4.firebaseapp.com",
  databaseURL: "https://folkation4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "folkation4",
  storageBucket: "folkation4.firebasestorage.app",
  messagingSenderId: "883274409616",
  appId: "1:883274409616:web:81dbaea956b5f9ccbe9a15"
};

// Initialize Firebase
let db: any;
let auth: any;
let isFirebaseReady = false;

try {
  const app = initializeApp(firebaseConfig);
  // Initialize Realtime Database
  db = getDatabase(app);
  auth = getAuth(app);
  isFirebaseReady = true;
  
  // Sign in anonymously
  signInAnonymously(auth).catch((error) => console.error("Auth error:", error));
} catch (e) {
  console.error("Firebase init failed:", e);
}

// Path for Realtime Database
const DB_PATH = 'eventConfig';

export const saveEventConfig = async (config: EventConfig): Promise<void> => {
  if (isFirebaseReady && db) {
    try {
      const configRef = ref(db, DB_PATH);
      await set(configRef, config);
      return;
    } catch (e) {
      console.error("Gagal simpan ke Realtime Database:", e);
      throw e;
    }
  }
  
  // Fallback
  localStorage.setItem('folkation_event_config', JSON.stringify(config));
  return Promise.resolve();
};

export const getEventConfig = async (): Promise<EventConfig | null> => {
  if (isFirebaseReady && db) {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, DB_PATH));
      if (snapshot.exists()) {
        return snapshot.val() as EventConfig;
      }
    } catch (e) {
      console.error("Gagal ambil dari Realtime Database:", e);
    }
  }

  // Fallback
  const local = localStorage.getItem('folkation_event_config');
  return local ? JSON.parse(local) : null;
};