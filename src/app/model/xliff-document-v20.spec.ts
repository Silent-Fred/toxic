import { XliffDocument } from './xliff-document';

const xliff = `<?xml version="1.0" encoding="UTF-8"?>
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

const xliffComplex = `<?xml version="1.0" encoding="UTF-8"?>
  <xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-US" trgLang="de-AT">
  <file id="ngi18n" original="ng.template">
    <unit id="some.silly.id">
      <notes>
        <note category="location">src/app/there/we/go.component.html:42</note>
        <note category="description">A description</note>
        <note category="meaning">Is your life meaningful?</note>
      </notes>
      <segment state="initial">
        <source>The source of truth </source>
        <target>Targeted ads </target>
      </segment>
      <segment state="initial">
        <source>is complex</source>
        <target>are annoying</target>
      </segment>
    </unit>
  </file>
</xliff>`;

const xliffWithoutTarget = `<?xml version="1.0" encoding="UTF-8"?>
  <xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-US" trgLang="de-AT">
  <file id="ngi18n" original="ng.template">
    <unit id="some.silly.id">
      <notes>
        <note category="location">src/app/there/we/go.component.html:42</note>
        <note category="description">A description</note>
        <note category="meaning">Is your life meaningful?</note>
      </notes>
      <segment state="initial">
        <source>The source of truth </source>
      </segment>
      <segment state="initial">
        <source>is complex</source>
      </segment>
    </unit>
  </file>
</xliff>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Menu</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 160h352M80 256h352M80 352h352"/></svg>`;

describe('XliffVersion20', () => {
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
    expect(translationUnit.fragments[0].state).toEqual('initial');
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

  it('should handle multiple segments elements', () => {
    const document = new XliffDocument();
    document.parseXliff(xliffComplex);
    const translationUnit = document.translationUnits[0];
    expect(translationUnit.id).toEqual('some.silly.id');
    expect(translationUnit.source).toEqual('The source of truth is complex');
    expect(translationUnit.target).toEqual('Targeted ads are annoying');
    expect(translationUnit.fragments.length).toEqual(2);
    expect(translationUnit.unsupported).toBeFalse();
  });

  // TODO define test cases for unsupported content in XLIFF V2.0
  it('should gracefully handle unsupported elements', () => {
    expect('TODO').not.toEqual('FIXME');
  });

  it('should "automagically" add missing targets', () => {
    const document = new XliffDocument();
    document.parseXliff(xliffWithoutTarget);
    const translationUnit = document.translationUnits[0];
    expect(translationUnit.target).toEqual(translationUnit.source);
  });
});
