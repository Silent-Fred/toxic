import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { XliffDocument } from './../model/xliff-document';
import { TitleService } from './../services/title.service';
import { ToxicRoutes } from './../shared/shared.module';
import { HomeComponent } from './home.component';

@Component({
  selector: 'toxic-xliff-upload',
  template: '',
  styles: [],
})
export class MockedXliffUploadComponent {}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let titleService = new TitleService();

  let router = {
    navigate: jasmine.createSpy('navigate'),
  };

  const xliff = `<?xml version="1.0" encoding="UTF-8"?><xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-AT">
    <body>
      <trans-unit id="some.silly.id" datatype="html">
        <source>The source of truth</source>
        <target state="new">Targeted ads</target>
        <note priority="1" from="description">A description</note>
        <note priority="1" from="meaning">Is your life meaningful?</note>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/there/we/go.component.html</context>
          <context context-type="linenumber">42</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Menu</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 160h352M80 256h352M80 352h352"/></svg>`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent, MockedXliffUploadComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useValue: router },
        { provide: TitleService, useValue: titleService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set filename in title if present', () => {
    const xliffDocument = new XliffDocument(xliff);
    xliffDocument.filename = 'test-file.xliff';
    titleService.reset();
    component.onUpload(xliffDocument);
    expect(titleService.title).toEqual('test-file.xliff');
  });

  it('should reset title on incompatible file upload', () => {
    const xliffDocument = new XliffDocument(xliff);
    titleService.reset();
    const title = titleService.title;
    component.onUpload(xliffDocument);
    expect(titleService.title).toEqual(title);
  });

  it('should navigate to translate after successful upload', () => {
    component.onUpload(new XliffDocument(xliff));
    expect(router.navigate).toHaveBeenCalledWith([ToxicRoutes.translate]);
  });

  it('should navigate to translate even after unsuccessful upload', () => {
    component.onUpload(new XliffDocument(svg));
    expect(router.navigate).toHaveBeenCalledWith([ToxicRoutes.translate]);
  });
});
