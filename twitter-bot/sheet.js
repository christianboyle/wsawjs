const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {
  constructor(args) {
    this.doc = new GoogleSpreadsheet('1ySpqoiVP-JxKKglp6u4aQ-zJyJkr2s6DBre-BsZ_nn4')
  }
  async load() {
    await this.doc.useServiceAccountAuth(require('./credentials.json'));
    await this.doc.loadInfo();
  }
  async addRows(rows) {
    const sheet = this.doc.sheetsByIndex[0];
    await sheet.addRows(rows);
  }
  async getRows() {
    const sheet = this.doc.sheetsByIndex[0];
    return await sheet.getRows();
  }
}