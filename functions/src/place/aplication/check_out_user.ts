import { PlaceRepository } from "../domain/place_repository";
import { idPlace } from "./../../shared/domain/value_object/idPlace";
import { Mac } from "../../shared/domain/value_object/mac";

export class CheckOutUser {
  _repository: PlaceRepository;
  constructor(repository: PlaceRepository) {
    this._repository = repository;
  }
  async call(
    idP: idPlace,
    idCompany: string,
    newUserMac: Mac,
    date: FirebaseFirestore.Timestamp
  ): Promise<void> {
    await this._repository.checkOutUser(idP, idCompany, newUserMac, date);
  }
}
