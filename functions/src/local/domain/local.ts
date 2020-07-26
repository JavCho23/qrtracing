import { idPlace } from "../../shared/domain/value_object/idPlace";

export class Place {
  _id: idPlace;
  _name: string;
  _capacity: number;
  _size: number;
  _level: number;
  _company: string;

  constructor(
    id: idPlace,
    name: string,
    company: string,
    size: number,
    level: number,
    capacity: number
  ) {
    this._id = id;
    this._name = name;
    this._company = company;
    this._size = size;
    this._level = level;
    this._capacity = capacity;
  }
}
