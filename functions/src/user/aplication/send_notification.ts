import { UserRepository } from "../domain/user_repository";
import { Mac } from "../../shared/domain/value_object/mac";

export class SendNotifications {
  _repository: UserRepository;
  constructor(repository: UserRepository) {
    this._repository = repository;
  }
  async call(mac: Mac): Promise<void> {
    await this._repository.notifyContacts(mac);
  }
}
