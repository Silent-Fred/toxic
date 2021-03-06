import { XliffDocument } from './xliff-document';

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

const xliffComplex = `<?xml version="1.0" encoding="UTF-8"?><xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-AT">
    <body>
      <trans-unit id="some.silly.id" datatype="html">
        <source>The source of truth <x id="subThingyId" equiv-text="is complex" /></source>
        <target state="new">Targeted ads <x id="subThingyId" equiv-text="are annoying" /></target>
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

const xliffUnsupported = `<?xml version="1.0" encoding="UTF-8"?><xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-AT">
    <body>
      <trans-unit id="some.silly.id" datatype="html">
        <source>The source of truth <xg id="unsupportedThingy" equiv-text="is complex" /></source>
        <target state="new">Targeted ads <x id="subThingyId" equiv-text="are annoying" /></target>
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

const xliffWithoutTarget = `<?xml version="1.0" encoding="UTF-8"?><xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-AT">
    <body>
      <trans-unit id="some.silly.id" datatype="html">
        <source>The source of truth <x id="subThingyId" equiv-text="is complex" /></source>
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

describe('XliffVersion12', () => {
  it('should create an instance', () => {
    expect(new XliffDocument()).toBeTruthy();
  });

  it('should parse a document', () => {
    const document = new XliffDocument();
    document.parseXliff(xliff);
    expect(document.translationUnits.length).toEqual(1);
  });

  it('should NOT parse e.g. an SVG', () => {
    const document = new XliffDocument();
    document.parseXliff(svg);
    expect(document.translationUnits.length).toEqual(0);
  });

  it('should parse the translation unit correctly', () => {
    const document = new XliffDocument();
    document.parseXliff(xliff);
    const translationUnit = document.translationUnits[0];
    expect(translationUnit.id).toEqual('some.silly.id');
    expect(translationUnit.source).toEqual('The source of truth');
    expect(translationUnit.target).toEqual('Targeted ads');
    expect(translationUnit.fragments.length).toEqual(1);
    expect(translationUnit.fragments[0].source).toEqual('The source of truth');
    expect(translationUnit.fragments[0].target).toEqual('Targeted ads');
    expect(translationUnit.fragments[0].state).toEqual('new');
    expect(translationUnit.meaning).toEqual('Is your life meaningful?');
    expect(translationUnit.description).toEqual('A description');
  });

  it('should parse the target language correctly', () => {
    const document = new XliffDocument();
    document.parseXliff(xliff);
    expect(document.targetLanguage).toEqual('de-AT');
  });

  it('should set targets and the target language', async () => {
    const document = new XliffDocument();
    document.parseXliff(xliff);
    document.setTargetLanguage('fr');
    document.setTranslation('some.silly.id', 0, 'this is new');
    const text = await document.asBlob().text();
    const nextDocument = new XliffDocument(text);
    expect(nextDocument.targetLanguage).toEqual('fr');
    const translationUnit = nextDocument.translationUnits[0];
    expect(translationUnit.target).toEqual('this is new');
  });

  it('should handle x elements', () => {
    const document = new XliffDocument();
    document.parseXliff(xliffComplex);
    const translationUnit = document.translationUnits[0];
    expect(translationUnit.id).toEqual('some.silly.id');
    expect(translationUnit.source).toEqual('The source of truth is complex');
    expect(translationUnit.target).toEqual('Targeted ads are annoying');
    expect(translationUnit.fragments.length).toEqual(2);
    expect(translationUnit.unsupported).toBeFalse();
  });

  it('should gracefully handle unsupported elements', () => {
    const document = new XliffDocument();
    document.parseXliff(xliffUnsupported);
    const translationUnit = document.translationUnits[0];
    expect(translationUnit.id).toEqual('some.silly.id');
    expect(translationUnit.source).toEqual('The source of truth ');
    expect(translationUnit.fragments.length).toEqual(1);
    expect(translationUnit.unsupported).toBeTrue();
  });

  it('should "automagically" add missing targets', () => {
    const document = new XliffDocument();
    document.parseXliff(xliffWithoutTarget);
    const translationUnit = document.translationUnits[0];
    expect(translationUnit.target).toEqual(translationUnit.source);
  });
});
