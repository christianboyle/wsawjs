const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {
  constructor(args) {
    this.doc = new GoogleSpreadsheet('1tUA-W6AvZNV1BJwuk16y2WqA9o8PFCOZYAcGkmAeT20')
  }
  async load() {
    await this.doc.useServiceAccountAuth(require('./credentials.json'))
    await this.doc.loadInfo()
  }
  async addRows(rows) {
    const sheet = this.doc.sheetsByIndex[0]
    await sheet.addRows(rows)
  }
}