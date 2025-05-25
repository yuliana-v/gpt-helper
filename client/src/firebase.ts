import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDFxWombkegFaIoT_td4I5SJbXAPmmv7PQ",
  authDomain: "llmapp-220cf.firebaseapp.com",
  projectId: "llmapp-220cf",
  storageBucket: "llmapp-220cf.firebasestorage.app",
  messagingSenderId: "335185533770",
  appId: "1:335185533770:web:36d327a6570de3efe13fb3",
  measurementId: "G-L2GMER0ZY0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
