import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Image, IImage } from '../model/image';

@Injectable({
  providedIn: 'root'
})
export class ImageLocalService extends BaseService{

  constructor() {
    super();
   }

  addImage(image: IImage) {
    /* this.standardizeinputs(watermanagement) */
    //console.log("C!!!!!!!!!! CA IS "+gaugestats.Image)
    console.log("Adding image "+image.Image_Name)
    return this.connection.insert({
      into: 'Images',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [image]
    });
  }

  getImage(image_name){
    console.log("getting "+image_name)
    return this.connection.select({
      from: "Images",
      where:{
        Image_Name:image_name
      }
    });
  }
}
