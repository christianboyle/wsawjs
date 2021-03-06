const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {
  constructor(args) {
    this.doc = new GoogleSpreadsheet(
      '1PEZta8NWgWHP7OzNomwS7O0bfcdsxPeyt6JVsjqhRZU'
    );
  }
  async load() {
    await this.doc.useServiceAccountAuth(require('./credentials.json'));
    await this.doc.loadInfo();
  }
  async addRows(rows) {
    const sheet = this.doc.sheetsByIndex[0];
    await sheet.addRows(rows);
  }
};
