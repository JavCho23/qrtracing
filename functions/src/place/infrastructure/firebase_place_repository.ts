import { PlaceRepository } from "../domain/place_repository";
import { idPlace } from "../../shared/domain/value_object/idPlace";
import { Mac } from "../../shared/domain/value_object/mac";

export class FirebasePlaceRepository extends PlaceRepository {
  public async checkInUser(
    idP: idPlace,
    newUserMac: Mac,
    newUserToken: string,
    date: FirebaseFirestore.Timestamp,
    recordPlace: string,
    company: string,
    companyId: string
  ): Promise<void> {
    const place = this._db
      .collection("companies")
      .doc(companyId)
      .collection("places")
      .doc(idP.value);
    await place.collection("history").add({
      user: newUserMac.value,
      token: newUserToken,
    });
    const current = await place.collection("current").get();
    await this._db
      .collection("users")
      .doc(newUserMac.value)
      .collection("history")
      .add({
        checkIn: date,
        company: company,
        companyId: companyId,
        place: recordPlace,
        placeId: idP.value,
        users: [],
      });
    await Promise.all(
      current.docs.map(async (user) => {
        await this.addContact(user.data().user, newUserToken);
      })
    );
    await Promise.all(
      current.docs.map(async (user) => {
        await this.addContact(newUserMac.value, user.data().token);
      })
    );
    await place.collection("current").add({
      user: newUserMac.value,
      token: newUserToken,
    });
  }
  public async addContact(userId: string, token: string) {
    const userRecords = await this._db
      .collection("users")
      .doc(userId)
      .collection("history")
      .orderBy("checkIn", "desc")
      .get();
    const idRecordToUpdate = userRecords.docs[0].id;
    await this._db
      .collection("users")
      .doc(userId)
      .collection("history")
      .doc(idRecordToUpdate)
      .set({ users: [token] }, { merge: true });
  }

  public async checkOutUser(
    idP: idPlace,
    idCompany: string,
    newUserMac: Mac,
    date: FirebaseFirestore.Timestamp
  ): Promise<void> {
    const place = this._db
      .collection("companies")
      .doc(idCompany)
      .collection("places")
      .doc(idP.value);

    const current = await place
      .collection("current")
      .where("user", "==", newUserMac.value)
      .get();
    console.log(current);
    await Promise.all(
      current.docs.map(async (user) => {
        await this._db
          .collection("companies")
          .doc(idCompany)
          .collection("places")
          .doc(idP.value)
          .collection("current")
          .doc(user.id)
          .delete();
      })
    );
    const userRecords = await this._db
      .collection("users")
      .doc(newUserMac.value)
      .collection("history")
      .orderBy("checkIn", "desc")
      .get();
    const lastRecord: any = userRecords.docs[0].id;
    await this._db
      .collection("users")
      .doc(newUserMac.value)
      .collection("history")
      .doc(lastRecord)
      .update({ checkOut: date });
  }

  public async verifyCheckInOrCheckOut(userId: string, place: string) {
    const userRecords = await this._db
      .collection("users")
      .doc(userId)
      .collection("history")
      .orderBy("checkIn", "desc")
      .get();
    if (userRecords.docs.length == 0) {
      return "checkIn";
    }
    const lastRecord: any = userRecords.docs[0].data();
    if (lastRecord.place == place && lastRecord.checkOut == undefined) {
      return "checkOut";
    } else if (lastRecord.place != place && lastRecord.checkOut == undefined) {
      return "checkOutAndCheckIn";
    } else return "checkIn";
  }
  _db: FirebaseFirestore.Firestore;

  constructor(db: FirebaseFirestore.Firestore) {
    super();
    this._db = db;
  }
}
