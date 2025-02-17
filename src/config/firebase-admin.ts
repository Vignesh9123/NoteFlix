"use server"

import * as admin from "firebase-admin";
import config from "@/config/config";

async function getAdminApp() {
  let adminApp:admin.app.App;
  if (!admin.apps.length) {
    adminApp = admin.initializeApp({
      projectId: config.firebaseProjectId,
    });
  } else {
    adminApp = admin.app(); // Use the already initialized app
  }
  return adminApp;
}

export { getAdminApp };