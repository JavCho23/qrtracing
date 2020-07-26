import { Mac } from "../../shared/domain/value_object/mac";
export abstract class UserRepository {
  public async abstract notifyContacts(mac: Mac): Promise<void>;
}
