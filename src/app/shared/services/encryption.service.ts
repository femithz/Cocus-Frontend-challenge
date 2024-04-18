import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  encrypt(data: string): any {
    return CryptoJS.AES.encrypt(data, `${environment.secretKey}`).toString();
  }

  decrypt(data: string): any {
    const bytes = CryptoJS.AES.decrypt(data, `${environment.secretKey}`);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}