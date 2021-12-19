import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { XliffDocument } from 'src/app/model/xliff-document';
import { SharedModule, ToxicRoutes } from './../../shared/shared.module';
import { SyncComponent } from './sync.component';

@Component({
  selector: 'toxic-xliff-upload',
  template: '',
  styles: [],
})
export class MockedXliffUploadComponent {
  @Input() label?: string;
  @Input() eyecatch?: boolean;
}

const xliffLatest = `<?xml version="1.0" encoding="UTF-8"?><xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="en-GB">
    <body>
      <trans-unit id="some.silly.id" datatype="html">
        <source>The source of truth <x id="subThingyId" equiv-text="is complex" /></source>
      </trans-unit>
      <trans-unit id="some.sillier.id" datatype="html">
        <source>Just so we have more than one source - and a changed one</source>
      </trans-unit>
    </body>
  </file>
</xliff>`;

const xliffAlign = `<?xml version="1.0" encoding="UTF-8"?><xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-AT">
    <body>
      <trans-unit id="some.silly.id" datatype="html">
        <source>The source of truth <x id="subThingyId" equiv-text="is complex" /></source>
        <target state="translated">The translated source of truth <x id="subThingyId" equiv-text="is a complex translation" /></target>
      </trans-unit>
      <trans-unit id="some.sillier.id" datatype="html">
        <source>Just so we have more than one source</source>
        <target>And more than one translation</target>
      </trans-unit>
      <trans-unit id="the.silliest.id" datatype="html">
        <source>Things we no longer need</source>
        <target>Evaporate...</target>
      </trans-unit>
    </body>
  </file>
</xliff>`;

describe('SyncComponent', () => {
  let component: SyncComponent;
  let fixture: ComponentFixture<SyncComponent>;

  let router = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyncComponent, MockedXliffUploadComponent],
      imports: [RouterTestingModule, SharedModule],
      providers: [{ provide: Router, useValue: router }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should align documents', () => {
    const latest = new XliffDocument(xliffLatest);
    latest.filename = 'messages';
    const align = new XliffDocument(xliffAlign);
    align.filename = 'messages_de-AT';
    component.onUploadLatest(latest);
    component.onUploadAlign(align);
    component.alignDocuments();
    expect(latest.filename).toEqual('messages_de-AT');
    expect(latest.targetLanguage).toEqual('de-AT');
    expect(latest.translationUnits.length).toEqual(2);
    expect(
      latest.translationUnits.find(
        (translationUnit) => translationUnit.id === 'some.silly.id'
      )?.fragments.length
    ).toEqual(2);
    expect(
      latest.translationUnits.find(
        (translationUnit) => translationUnit.id === 'some.silly.id'
      )?.fragments[0].state
    ).toEqual('translated');
    expect(
      latest.translationUnits.find(
        (translationUnit) => translationUnit.id === 'some.sillier.id'
      )?.fragments[0].state
    ).toEqual('new');
    expect(
      latest.translationUnits.find(
        (translationUnit) => translationUnit.id === 'some.sillier.id'
      )?.fragments[0].target
    ).toEqual('And more than one translation');
  });

  it('should navigate to translate after successful uploads', () => {
    router.navigate.calls.reset();
    component.onUploadLatest(new XliffDocument(xliffLatest));
    expect(router.navigate).not.toHaveBeenCalled();
    component.onUploadAlign(new XliffDocument(xliffAlign));
    expect(router.navigate).toHaveBeenCalledWith([ToxicRoutes.translate]);
  });
});
