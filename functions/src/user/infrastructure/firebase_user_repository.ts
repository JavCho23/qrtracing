import { UserRepository } from "../domain/user_repository";

import { Mac } from "../../shared/domain/value_object/mac";
import { admin } from "firebase-admin/lib/messaging";
import { Test } from "../domain/value_object/test";

export class FirebaseUserRepository extends UserRepository {
  _db: FirebaseFirestore.Firestore;
  _messaging: admin.messaging.Messaging;
  public async notifyContacts(mac: Mac): Promise<void> {
    try {
      const userDoc = await this._db.collection("users").doc(mac.value).get();
      if (userDoc.data() == undefined) return;
      const positiveCase: any = userDoc.data();
      const records = await this._db
        .collection("users")
        .doc(mac.value)
        .collection("record")
        .where("checkIn", ">=", new Date(Date.now() - 1209600000))
        .get();
      await Promise.all(
        records.docs.map(async (record) => {
          await this.sendNotification(
            record.data().users,
            new Test(
              positiveCase.test.method,
              new Date(positiveCase.test.date).getTime(),
              positiveCase.test.positive
            )
          );
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
  public async sendNotification(tokens: Array<string>, test: Test) {
    const message = {
      notification: {
        title: "Alerta de reciente contacto",
        body: `Una de las personas con las que tuvo contacto ultimamente ha dado positivo a Covid-19`,
      },
      tokens: tokens,
    };
    console.log(message);
    await this._messaging.sendMulticast(message);
  }
  constructor(
    db: FirebaseFirestore.Firestore,
    messaging: admin.messaging.Messaging
  ) {
    super();
    this._db = db;
    this._messaging = messaging;
  }
}
