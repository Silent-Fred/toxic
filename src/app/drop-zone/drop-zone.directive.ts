import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[toxicDropZone]',
})
export class DropZoneDirective {
  @Output() fileDropped = new EventEmitter<FileList>();
  @HostBinding('class.toxicDropZoneActive') toxicDropZoneActive = false;

  constructor() {}

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    this.commonEventHandlingStuff(event);
    this.toxicDropZoneActive = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    this.commonEventHandlingStuff(event);
    this.toxicDropZoneActive = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    this.commonEventHandlingStuff(event);
    this.toxicDropZoneActive = false;
    this.fileDropped.emit(event.dataTransfer?.files);
  }

  private commonEventHandlingStuff(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
