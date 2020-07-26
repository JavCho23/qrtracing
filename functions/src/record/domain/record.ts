import { idPlace } from "../../shared/domain/value_object/idPlace";
import { Mac } from "../../shared/domain/value_object/mac";

export class Record {
  _place: idPlace;
  _mac: Mac;
  _checkIn: string;
  _checkOut: string;
  constructor(place: idPlace, mac: Mac, checkIn: string, checkOut: string) {
    this._mac = mac;
    this._place = place;
    this._checkIn = checkIn;
    this._checkOut = checkOut;
  }
}
