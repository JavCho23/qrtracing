import { PlaceRepository } from "../domain/place_repository";
import { idPlace } from "./../../shared/domain/value_object/idPlace";
import { Mac } from "../../shared/domain/value_object/mac";

export class ChechInUser {
  _repository: PlaceRepository;
  constructor(repository: PlaceRepository) {
    this._repository = repository;
  }
  async call(
    idP: idPlace,
    newUserMac: Mac,
    newUserToken: string,
    date: FirebaseFirestore.Timestamp,
    recordPlace: string,
    company: string,
    companyId: string
  ): Promise<void> {
    await this._repository.checkInUser(
      idP,
      newUserMac,
      newUserToken,
      date,
      recordPlace,
      company,
      companyId
    );
  }
}
