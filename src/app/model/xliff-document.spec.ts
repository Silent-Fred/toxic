import { XliffDocument } from './xliff-document';

const xliff12 = `<?xml version="1.0" encoding="UTF-8"?><xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
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

const xliff20 = `<?xml version="1.0" encoding="UTF-8"?>
  <xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-US" trgLang="de-AT">
  <file id="ngi18n" original="ng.template">
    <unit id="some.silly.id">
      <notes>
        <note category="location">src/app/there/we/go.component.html:42</note>
        <note category="description">A description</note>
        <note category="meaning">Is your life meaningful?</note>
      </notes>
      <segment state="initial">
        <source>The source of truth</source>
        <target>Targeted ads</target>
      </segment>
    </unit>
  </file>
</xliff>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Menu</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 160h352M80 256h352M80 352h352"/></svg>`;

describe('XliffDocument', () => {
  it('should create an instance', () => {
    expect(new XliffDocument()).toBeTruthy();
  });

  it('should be able to select the correct version handling', () => {
    const document12 = new XliffDocument();
    document12.parseXliff(xliff12);
    const document20 = new XliffDocument();
    document20.parseXliff(xliff20);
    expect(document12.valid).toBeTrue();
    expect(document20.valid).toBeTrue();
    expect(document12.translationUnits.length).toEqual(
      document20.translationUnits.length
    );
    expect(document12.translationUnits[0].source).toEqual(
      document12.translationUnits[0].source
    );
    expect(document12.translationUnits[0].target).toEqual(
      document12.translationUnits[0].target
    );
  });

  it('should NOT parse e.g. an SVG', () => {
    const document = new XliffDocument();
    document.parseXliff(svg);
    expect(document.translationUnits.length).toEqual(0);
    expect(document.valid).toBeFalse();
  });

  it('should correctly track unsaved changes', () => {
    const document = new XliffDocument();
    document.parseXliff(xliff12);
    expect(document.unsavedChanges).toBeFalse();
    document.setTargetLanguage('fr');
    expect(document.unsavedChanges).toBeTrue();
    document.acceptUnsavedChanges();
    expect(document.unsavedChanges).toBeFalse();
    document.setTranslation(
      'some.silly.id',
      0,
      'and now for something completely different'
    );
    expect(document.unsavedChanges).toBeTrue();
    document.acceptUnsavedChanges();
    expect(document.unsavedChanges).toBeFalse();
    document.setState('some.silly.id', 'final');
    expect(document.unsavedChanges).toBeTrue();
  });

  it('should not spectacularly fail if others are stupid', () => {
    const document = new XliffDocument();
    document.parseXliff(svg);
    expect(document.valid).toBeFalse();
    document.setTargetLanguage('fr');
    document.setTranslation(
      'some.silly.id',
      0,
      'and now for something completely different'
    );
    // currently marked as containing unsaved changes even though
    // it doesn't contain anything - just make sure a setSomething
    // won't crash
    expect(document.unsavedChanges).toBeTrue();
  });
});
