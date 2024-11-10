import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class spreadsheetsService {
  constructor(private http: HttpClient) {}

  getSheetData(): Observable<any> {
    return this.http.get(`https://sheets.googleapis.com/v4/spreadsheets/1X1p6laul5yRw330M1ROaP8F4T70asWE7IieVsT1Qb7c/values/admin!A1:C5?key=AIzaSyAEOb_1iv4NXFeV7OQph2FW5UpqCUiGMcc`);
  }
}
