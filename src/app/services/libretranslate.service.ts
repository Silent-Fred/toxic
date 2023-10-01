import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface TranslatedText {
  translatedText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LibretranslateService {
  private readonly translationEndpoint = 'http://localhost:5000/translate';

  constructor(private httpClient: HttpClient) {}

  translate(
    text: string,
    sourceLanguage: string | undefined,
    targetLanguage: string | undefined
  ): Observable<TranslatedText | undefined> {
    if (!text || !targetLanguage) {
      return of(undefined);
    }
    return this.httpClient.post<any>(
      this.translationEndpoint,
      JSON.stringify({
        q: text,
        source: sourceLanguage?.substring(0, 2) ?? 'auto',
        target: targetLanguage,
        format: 'text',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
