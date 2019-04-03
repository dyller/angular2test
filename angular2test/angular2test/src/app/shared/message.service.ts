import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  reverseMorseAlphabet = this.getReverseMorseAlphabet();
  Morsecode = this.getMorseCode();
  constructor(private db: AngularFirestore) { }

  getMessages(): Observable<any> {
    return this.db.collection('messages', ref => ref.orderBy('time')).valueChanges();
  }

  getMessagesLastByLimit(limit: number): Observable<any> {
    return this.db.collection('messages', ref =>
      ref.orderBy('time', 'desc').limit(limit)).valueChanges().pipe();

  }

  getMessagesPaged(limit: number, startAt?: any): Observable<any> {
    return this.db.collection('messages', ref => ref.orderBy('time',  'desc').limit(limit).startAfter(startAt.time)).valueChanges();
  }
  getMessagesPagedBack(limit: number, startAt?: any): Observable<any> {
    return this.db.collection('messages', ref => ref.orderBy('time', 'desc').limit(limit).endAt(startAt.time)).valueChanges();
  }

  addMessage(time: Date, message: any): Promise<any> {

    if (time && this.messageOk(message)) {
      const messageCollection = this.db.collection<any>('messages');
      return messageCollection.add({time: time, message: message});
    } else {
      return new Promise((resolve, reject) => {
        reject('Value is not a valid morse code');
      });
    }
  }
  getMorseCode()
  {
    return {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..', ' ': '/',

      '0': '-----', '.1': '.----', '2': '..---', '3': '...--', '4': '....-',
      '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
    };
  }

  getReverseMorseAlphabet() {
    return {
      '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
      '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
      '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
      '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
      '-.--': 'Y', '--..': 'Z', '/': ' ',

      '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
      '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9'
    };
  }
  convertToMorse(text: string): string {
    let morse = '';
    const words = text.toString().split(' ');
    for (const word of words) {

      for (const char of word) {
        const letter = this.getMorseCode[char];
        if (letter !== undefined) {
          morse += letter;
        } else {
          morse += char;
        }
      }
      morse += '/';
    }
    return text;
  }

  convertToText(morse: string): string {
    let text = '';
    const words = morse.toString().split('/');
    for (const word of words) {
      const chars = word.split(' ');
      for (const char of chars) {
        const letter = this.reverseMorseAlphabet[char.toUpperCase()];
        if (letter !== undefined) {
          text += letter;
        } else {
          text += char;
        }
      }
      text += ' ';
    }
    return text;
  }

  messageOk(morse: string): boolean {
    const words = morse.toString().split('/');
    for (const word of words) {
      if (word.trim().length === 0) {
        continue;
      }
      const chars = word.split(' ');
      for (const char of chars) {
        if (char.trim().length === 0) {
          continue;
        }
        const letter = this.reverseMorseAlphabet[char.toUpperCase()];
        if (letter === undefined) {
          console.log(char);
          return false;
        }
      }
    }
    return true;
  }
  addMessageButConvertBefore(time: Date, message: any): Promise<any> {
    const morseMessage = this.convertToMorse(message);
    if (time && this.messageOk(morseMessage)) {
      const messageCollection = this.db.collection<any>('messages');
      return messageCollection.add({time: time, message: morseMessage});
    } else {
      return new Promise((resolve, reject) => {
        reject('Value is not a valid morse code');
      });
    }
  }
}
