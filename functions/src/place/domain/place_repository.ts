import { idPlace } from "../../shared/domain/value_object/idPlace";
import { Mac } from "../../shared/domain/value_object/mac";

export abstract class PlaceRepository {
  public abstract async checkInUser(
    idPlace: idPlace,
    newUserMac: Mac,
    newUserToken: string,
    date: FirebaseFirestore.Timestamp,
    recordPlace: string,
    company: string,
    companyId: string
  ): Promise<void>;
  public abstract async verifyCheckInOrCheckOut(
    userId: string,
    place: string
  ): Promise<string>;
  public abstract async checkOutUser(
    idP: idPlace,
    idCompany: string,
    newUserMac: Mac,
    date: FirebaseFirestore.Timestamp
  ): Promise<void>;
}
