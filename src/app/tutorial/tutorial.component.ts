import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XliffDocument } from './../model/xliff-document';
import { XliffService } from './../services/xliff.service';
import { ToxicRoutes } from './../shared/shared.module';

const tutorial = `<?xml version="1.0" encoding="UTF-8"?><xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
<file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="en-UK">
  <body>
    <trans-unit id="the.unique.identifiers.1" datatype="html">
      <source>Hey there. Let's see how this thing works.</source>
      <target state="translated">Hello. Let us take a look at how this application can be used to your benefit.</target>
    </trans-unit>
    <trans-unit id="the.unique.identifiers.2" datatype="html">
      <source>The original text in the source language is displayed in this row.</source>
      <target state="translated">Type your translation in this field.</target>
      <note priority="1" from="description">If a descriptive text for this translation unit has been given it will show up here.</note>
      <note priority="1" from="meaning">If the meaning of this translation unit has been given it will show up here.</note>
    </trans-unit>
    <trans-unit id="the.unique.identifiers.3" datatype="html">
      <source>See the button to the right and the flag at the right side of the translation?</source>
      <target state="new">Change this translation and look how the button and the flag change.</target>
      <note priority="1" from="description">It's a simple workflow. Translations are either "flagged" to signal that someone should check them or they are supposed to be good (enough).</note>
    </trans-unit>
    <trans-unit id="the.unique.identifiers.4" datatype="html">
      <source>A (flagged) translation seems already okay?</source>
      <target state="new">Simply click the button "Looks good to me" on the right side.</target>
    </trans-unit>
    <trans-unit id="the.unique.identifiers.5" datatype="html">
      <source>You would like to flag a translation for (another) review?</source>
      <target state="translated">Simply click the button "Should be reviewed" on the right side.</target>
    </trans-unit>
    <trans-unit id="the.unique.identifiers.6" datatype="html">
      <source>The number of translation units can quickly become overwhelming so that filtering would be helpful.</source>
      <target state="translated">In the top area, the "Filter" input field allows you to filter translations.</target>
      <note priority="1" from="description">Type in the word "overwhelming" (or anything else) in the filter to see how it works. Clear the filter field to display all translations again. You may notice that with filtering, the pagination will be set to 1 and that when you clear the filter, the page will not go back to where you may have been before. Sorry, that's a little quirk at the moment.</note>
    </trans-unit>
    <trans-unit id="the.unique.identifiers.7" datatype="html">
      <source>Did you notice a dot behind the filename right below the title bar?</source>
      <target state="translated">The dot appears when you have made changes to the translation file.</target>
      <note priority="1" from="description">Changes can be translations or requesting a review or marking a translation as okay.</note>
    </trans-unit>
    <trans-unit id="the.unique.identifiers.8" datatype="html">
      <source>I think I got the basics now. How do I save my translations?</source>
      <target state="translated">In the upper right corner there are several icons. The left one, the "share" icon will download an XLIFF file with all your translations.</target>
      <note priority="1" from="description">Some browsers will ask for a location, some depending on configuration, some will take quite a while before they actually start the download... just try how your preferred browser works.</note>
    </trans-unit>
    <trans-unit id="the.unique.identifiers.9" datatype="html">
      <source>And what does the "close" icon, the little x in the top right corner do?</source>
      <target state="translated">It makes the app "forget" the XLIFF file content and brings you back to the start page where you can open a new file.</target>
      <note priority="1" from="description">Oops.. you had unsaved changes? The application will ask you if you really wanted to quit before throwing away anything of your work.</note>
    </trans-unit>
    <trans-unit id="the.unique.identifiers.10" datatype="html">
      <source>Can I just click on "Open" in the sidebar menu to open another XLIFF file?</source>
      <target state="translated">Yes you can. You don't necessarily have to close the old one.</target>
      <note priority="1" from="description">Now what's the difference compared to the close button? Navigating with the menu will not ask about unconfirmed changes because it won't clear anything. You can simply navigate back to the translations again and everything will still be in place.</note>
      <note priority="1" from="meaning">Just different possibilities, choose whichever you prefer.</note>
    </trans-unit>
    <trans-unit id="the.unique.identifiers.11" datatype="html">
      <source>Is it so difficult to count to three? What's the big mystery of that "grid" icon between the share and close icons?</source>
      <target state="translated">This icon will switch between a layout with original text and translation either next to each other or line by line.</target>
      <note priority="1" from="meaning">There are three kinds of people. Those that are good at maths and those that are not.</note>
    </trans-unit>
    <trans-unit id="the.unique.identifiers.12" datatype="html">
      <source>You forgot to explain the "Target Language" input field.</source>
      <target state="translated">Ah okay. If you need a completely new language file, you can change the target language in this field, then translate all texts and finally download the result.</target>
    </trans-unit>
    <trans-unit id="the.unique.identifiers.14" datatype="html">
      <source>That's all folks.</source>
      <target state="translated">Cheers, Silent Fred</target>
    </trans-unit>
  </body>
</file>
</xliff>`;

@Component({
  selector: 'toxic-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent {
  constructor(private xliffService: XliffService, private router: Router) {}

  showMeHow(): void {
    const tutorialDocument = new XliffDocument(tutorial);
    tutorialDocument.filename = 'tutorial.xliff';
    this.xliffService.use(tutorialDocument);
    this.router.navigate([ToxicRoutes.translate]);
  }
}
