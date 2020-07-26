import * as functions from "firebase-functions";
import { FirebaseUserRepository } from "./user/infrastructure/firebase_user_repository";
import { Mac } from "./shared/domain/value_object/mac";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
import * as admin from "firebase-admin";
import { SendNotifications } from "./user/aplication/send_notification";
admin.initializeApp();
//onst funcion = new FirebaseUserRepository();
const firestore = admin.firestore();
const messaging = admin.messaging();
export const sendAlertFirebaseFunction = functions.firestore
  .document("users/{docId}")
  .onUpdate(async (change, conext) => {
    if (change.after.data().test.positive != true) return;
    const sendNotifications = new SendNotifications(
      new FirebaseUserRepository(firestore, messaging)
    );
    await sendNotifications.call(new Mac(change.after.id));
  });

export const helloWorld = functions.https.onRequest(
  async (request, response) => {
    response.send("Todo ok");
  }
);
