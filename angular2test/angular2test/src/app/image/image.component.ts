import { Component, OnInit } from '@angular/core';
import {switchMap, tap} from "rxjs/operators";
import {ImageCroppedEvent} from "ngx-image-cropper";
import {FormControl, FormGroup} from "@angular/forms";
import {FileService} from "../shared/file.service";
import {Observable} from "rxjs";
import {Image} from "../shared/entities/image";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  imageChangedEvent: any = '';
  private fileToUpload: File;
  productFormGroup: FormGroup;
  image: Image;
  croppedImage: any = '';
  products: Observable<any>;
  constructor (
    private fs: FileService) {

    this.productFormGroup = new FormGroup({
      message: new FormControl('')
    });
    /* this.fs.getAllProduct().subscribe(product => {
       this.products = product;
     });*/
    this.products = this.fs.getAllProduct()
      .pipe(
        tap(productsList  => {
          productsList.forEach(product => {
              if (product.id) {
                this.fs.getFileUrl(product.id).
                subscribe(url => {
                  product.url = url;
                });
              }

            }
          );
        })
      );
  }

  ngOnInit() {
  }
  uploadFile(event) {
    this.imageChangedEvent = event;
    // this.fileToUpload = event.target.files[0];
    //this.fs.upload(file).subscribe();
  }

  addProduct() {
    const imageData = this.productFormGroup.value;
    this.fs.upload(this.fileToUpload).
    pipe(
      switchMap( metaData => {
        imageData.id = metaData.id;
        return this.fs.addImage(imageData);
      })
    ).subscribe();

  }
  imageCropped(event: ImageCroppedEvent) {
    const beforeCrop = this.imageChangedEvent.target.files[0];
    this.fileToUpload = new File([event.file], beforeCrop.name,
      {type: beforeCrop.type});
  }
}

