import * as functions from "firebase-functions";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const sendAlertFirebaseFunction = functions.firestore
  .document("users/{docId}")
  .onUpdate((change) => {
    console.log(change.after.data());
  });

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
