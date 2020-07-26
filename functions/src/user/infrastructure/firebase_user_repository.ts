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
        .where("date", ">=", new Date(Date.now() - 1209600000))
        .get();
      Promise.all(
        records.docs.map((record) => {
          record.data().users.map(async (user: string) => {
            await this.sendNotification(
              new Mac(user),
              new Test(
                positiveCase.test.date,
                positiveCase.test.method,
                positiveCase.test.positive
              )
            );
          });
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
  public async sendNotification(token: Mac, test: Test) {
    var message = {
      data: {
        method: test._mode,
        date: test._date,
      },
      token: token.value,
    };
    await this._messaging.send(message);
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
