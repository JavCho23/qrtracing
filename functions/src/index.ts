import * as functions from "firebase-functions";
import { FirebaseUserRepository } from "./user/infrastructure/firebase_user_repository";
import { Mac } from "./shared/domain/value_object/mac";

import * as admin from "firebase-admin";
import { SendNotifications } from "./user/aplication/send_notification";
import { ChechInUser } from "./place/aplication/checkIn_user";
import { FirebasePlaceRepository } from "./place/infrastructure/firebase_place_repository";
import { idPlace } from "./shared/domain/value_object/idPlace";
import { VerifyStep } from "./place/aplication/verify_step";
import { CheckOutUser } from "./place/aplication/check_out_user";
admin.initializeApp();
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


export const checkInFirebaseFunction = functions.firestore
  .document("records/{recordId}")
  .onCreate(async (change, conext) => {

    const record = change.data();

    const verifyStep = new VerifyStep(new FirebasePlaceRepository(firestore));
    const step: string = await verifyStep.call(record.user, record.place);
    console.log(step);
    switch (step) {
      case "checkIn":
        let checkInUser = new ChechInUser(
          new FirebasePlaceRepository(firestore)
        );
        await checkInUser.call(
          new idPlace(record.placeId),
          new Mac(record.user),
          record.token,
          record.date,
          record.place,
          record.company,
          record.companyId
        );
        break;
      case "checkOut":
        let checkOutUser = new CheckOutUser(
          new FirebasePlaceRepository(firestore)
        );
        await checkOutUser.call(
          new idPlace(record.placeId),
          record.companyId,
          new Mac(record.user),
          record.date
        );
        break;
      case "checkOutAndCheckIn":
        let checkInUserBoth = new ChechInUser(
          new FirebasePlaceRepository(firestore)
        );
        await checkInUserBoth.call(
          new idPlace(record.place),
          new Mac(record.user),
          record.token,
          record.date,
          record.place,
          record.company,
          record.companyId
        );
        let checkOutUserBoth = new CheckOutUser(
          new FirebasePlaceRepository(firestore)
        );
        await checkOutUserBoth.call(
          new idPlace(record.placeId),
          record.companyId,
          new Mac(record.user),
          record.date
        );
        break;
    }
  });