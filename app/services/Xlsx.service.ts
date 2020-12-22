import { log } from '../../config/Logger';
const excelWriter = require('excel4node');

export class XlsxService {
  private excelWriteFile: any;

  constructor() { }

  /**
   * Add a new worksheet to the excel file
   * @param sheetName name of the worksheet
   * @param columns array of columns to be created on the worksheet
   *        columns.name name to be put on the first row
   *        columns.value function that will extract the value for any given item of data
   * @param data array of rows to be processed by columns.value function
   */
  addWorksheet(sheetName: string, columns: {name: string, value: (arg: any) => any}[], data: any[]) {
    // if the excelWriteFile is still not set, create a workbook
    if (this.excelWriteFile === null || this.excelWriteFile === undefined) {
      this.excelWriteFile = new excelWriter.Workbook();
    }

    // create the worksheet
    const ws = this.excelWriteFile.addWorksheet(sheetName);

    // add each column name
    columns.forEach((column, i) => {
      // add column.name on row 1
      ws.cell(1, i + 1)
         .string(column.name);
    });

    // for each row received
    data.forEach((row: any, iRow: number) => {
      // add one cell for each column received
      columns.forEach((column: any, iColumn: number) => {
        // get the value according to column.field
        const value = column.value(row);
        // if the value exists
        if (!!value) {
          // add beginning on row 2
          ws.cell(iRow + 1 + 1, iColumn + 1)
            .string(String(value));
        }
      });
    });

  }

  /**
   * Writes the file to a stream or to a local file
   * @param fileName path to the file in which the excel file will be saved
   * @param stream writable stream to which the excel file will be written
   */
  write(fileName: string, stream?: any) {
    return this.excelWriteFile.write(fileName, stream);
  }

}
