import { Test } from "./value_object/test";
import { Mac } from "../../shared/domain/value_object/mac";

export class User {
  _mac: Mac;
  _test: Test;
  constructor(mac: Mac, test: Test) {
    this._mac = mac;
    this._test = test;
  }
}
