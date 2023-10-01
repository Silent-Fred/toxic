import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, RepeatConfig, catchError, of, repeat } from 'rxjs';

interface SupportedLanguage {
  code?: string;
  name?: string;
  targets?: string[];
}

interface TranslatedText {
  translatedText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LibreTranslateService {
  private readonly supportedLanguagesEndpoint =
    'http://localhost:5000/languages';
  private readonly translationEndpoint = 'http://localhost:5000/translate';

  private _supportedLanguages = [] as SupportedLanguage[];

  constructor(private httpClient: HttpClient) {
    this.supportedLanguages()
      .pipe(
        catchError(() => of([])),
        repeat({ delay: 10000 } as RepeatConfig)
      )
      .subscribe((languages) => (this._supportedLanguages = [...languages]));
  }

  get available(): boolean {
    return (this._supportedLanguages ?? []).length > 0;
  }

  languagesSupported(
    sourceLanguage: string | undefined,
    targetLanguage: string | undefined
  ): boolean {
    if (!targetLanguage) {
      return false;
    }
    const lowerCaseSource = sourceLanguage?.toLowerCase() ?? 'auto';
    const lowerCaseTarget = targetLanguage?.toLowerCase();
    const supportedSource = this._supportedLanguages.find(
      (language) =>
        language.code?.toLowerCase() == lowerCaseSource ||
        lowerCaseSource.endsWith(language.code?.toLowerCase() ?? 'N/A') ||
        lowerCaseSource.startsWith(language.code?.toLowerCase() ?? 'N/A')
    );
    if (supportedSource?.targets) {
      return supportedSource.targets.some(
        (language) =>
          language.toLowerCase() == lowerCaseTarget ||
          lowerCaseTarget.endsWith(language.toLowerCase()) ||
          lowerCaseTarget.startsWith(language.toLowerCase())
      );
    } else {
      return this._supportedLanguages
        .map((language) => language.targets ?? [])
        .some((languages) =>
          languages.some(
            (language) =>
              language.toLowerCase() == lowerCaseTarget ||
              lowerCaseTarget.endsWith(language.toLowerCase()) ||
              lowerCaseTarget.startsWith(language.toLowerCase())
          )
        );
    }
  }

  translate(
    text: string,
    sourceLanguage: string | undefined,
    targetLanguage: string | undefined
  ): Observable<TranslatedText | undefined> {
    if (!text || !targetLanguage) {
      return of(undefined);
    }
    const lowerCaseSource = sourceLanguage?.toLowerCase() ?? 'auto';
    const lowerCaseTarget = targetLanguage.toLowerCase();
    const supportedSource = this._supportedLanguages.find(
      (language) =>
        language.code?.toLowerCase() == lowerCaseSource ||
        lowerCaseSource.endsWith(language.code?.toLowerCase() ?? 'N/A') ||
        lowerCaseSource.startsWith(language.code?.toLowerCase() ?? 'N/A')
    );
    let supportedTarget: string | undefined;
    if (supportedSource) {
      supportedTarget = supportedSource.targets?.find(
        (language) =>
          language.toLowerCase() == lowerCaseTarget ||
          lowerCaseTarget.endsWith(language.toLowerCase()) ||
          lowerCaseTarget.startsWith(language.toLowerCase())
      );
    } else {
      supportedTarget = this._supportedLanguages
        .map((language) => language.targets ?? [])
        .find((languages) =>
          languages.find(
            (language) =>
              language.toLowerCase() == lowerCaseTarget ||
              lowerCaseTarget.endsWith(language.toLowerCase()) ||
              lowerCaseTarget.startsWith(language.toLowerCase())
          )
        )
        ?.find(
          (language) =>
            language.toLowerCase() == lowerCaseTarget ||
            lowerCaseTarget.endsWith(language.toLowerCase()) ||
            lowerCaseTarget.startsWith(language.toLowerCase())
        );
    }
    return this.httpClient.post<TranslatedText>(
      this.translationEndpoint,
      JSON.stringify({
        q: text,
        source: supportedSource?.code ?? 'auto',
        target: supportedTarget,
        format: 'text',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  private supportedLanguages(): Observable<SupportedLanguage[]> {
    return this.httpClient.get<SupportedLanguage[]>(
      this.supportedLanguagesEndpoint,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
