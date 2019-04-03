import { Injectable } from '@angular/core';
import {AngularFireStorage} from "@angular/fire/storage";
import {AngularFirestore} from "@angular/fire/firestore";
import {defer, from, Observable} from "rxjs";
import {FileMetadata} from "./entities/filemetadata";
import {map, switchMap} from "rxjs/operators";
import {Image} from "./entities/image";
import {promise} from "selenium-webdriver";

@Injectable({
  providedIn: 'root'
})
export class FileService {


  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore) { }

  upload(file: File): Observable<FileMetadata> {
    /*  this.storage.ref('product-pictures/' + file.name)
        .put(file)
        .then(() => {

        });
      return Observable.create();*/
   /* return this.createFileMetaData(
      {
        type: file.type,
        name: file.name,
        lastChanged: file.lastModified,
        size: file.size

      }
    ).pipe(
      switchMap(metaDataWithId => {
        return this.storage
          .ref('product-pictures/' + metaDataWithId.id)
          .put(file).
          snapshotChanges()
          .pipe(
            map(() => {

              return metaDataWithId;
            })
          );
      }));*/
   const uid = this.db.createId();
   return defer(()=>
   this.storage.ref('product-pictures/'+uid)
     .put(file, {
       customMetadata:
         {
           originalName: file.name
         }
     })
     .then())
     .pipe(
       map(fileref =>{
         fileref.id = uid;
         return fileref;
       })
     )
  }

  createFileMetaData(metadata: FileMetadata)
    : Observable<FileMetadata> {
    return from(
      this.db.collection('files')
        .add(metadata))
      .pipe(
        map(metaRef => {
          metadata.id = metaRef.id;
          return metadata;
        }));

  }
  getFileUrl(id: string): Observable<any> {
    return this.storage.ref('product-pictures/' + id)
      .getDownloadURL();
  }

  addImage(imageData: Image) {
    const messageCollection = this.db.collection<Image>('images');
    return messageCollection.add(imageData);
  }

  getAllProduct(): Observable<any> {
    return this.db.collection('images').valueChanges();
  }
}
