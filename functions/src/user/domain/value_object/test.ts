export class Test {
  _mode: string;
  _date: string;
  _result: boolean;
  constructor(mode: string, date: number, result: boolean) {
    this._mode = mode;
    this._date = date + "";
    this._result = result;
  }
}
