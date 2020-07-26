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
    try {
      const message = {
        notification: {
          title: "dff",
          body: "sdfdsf",
        },
        tokens: [
          "fjFPrlO_gn8:APA91bGkryThrxbkhsGZMKco_vkCXueTx4fprPG_CYjaSCyTLD9cL6ZBSDMtD71DPKUg84g_Lfd3j0cVYpSwGB4C-rp8_sZGNNgYSYx-QxD38N3TOIhgU3WPzKRVhjzPu2Z0sbCitNVv",
        ],
      };

      const res = await messaging.sendMulticast(message);
      console.log(res);
      response.send("Todo ok");
    } catch (error) {
      console.log(error);
    }
  }
);

