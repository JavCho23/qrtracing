import { PlaceRepository } from "../domain/place_repository";

export class VerifyStep {
  _repository: PlaceRepository;
  constructor(repository: PlaceRepository) {
    this._repository = repository;
  }
  async call(user: string, place: string): Promise<string> {
   return await this._repository.verifyCheckInOrCheckOut(user, place);
  }
}
