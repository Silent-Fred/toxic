import { Component, EventEmitter, Input, Output } from '@angular/core';
import { XliffDocument } from '../../model/xliff-document';

@Component({
  selector: 'toxic-xliff-upload',
  templateUrl: './xliff-upload.component.html',
  styleUrls: ['./xliff-upload.component.scss'],
})
export class XliffUploadComponent {
  @Input() eyecatch: boolean = true;
  @Output() xliffDocumentUploaded = new EventEmitter<XliffDocument>();

  xliffDocument?: XliffDocument;

  private filename?: string;

  constructor() {}

  fileDropped(fileList?: FileList): void {
    this.filename = 'nemo';
    if (fileList && fileList.length > 0) {
      this.filename = fileList[0].name;
      fileList[0].text().then((text) => this.parseDocument(text));
    }
  }

  private parseDocument(text: string): void {
    const xliffDocument = new XliffDocument();
    try {
      xliffDocument.parseXliff(text);
      xliffDocument.filename = this.filename;
    } catch (e) {
      console.error(
        'Could not successfully interpret the file as an XLIFF file.',
        e
      );
    }
    this.xliffDocument = xliffDocument?.valid ? xliffDocument : undefined;
    this.xliffDocumentUploaded.emit(this.xliffDocument);
  }
}
