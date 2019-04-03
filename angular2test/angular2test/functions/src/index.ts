import * as functions from 'firebase-functions';;
import * as admin from "firebase-admin";
import {reject} from "q";
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.uploadNewProductImage =
  functions.storage.object().onFinalize((object) => {
  // ... save metadata in firestore
    return new Promise( (resolve, reject) => {
      if(object && object.metadata && object.name)
      { const filemet  =
        {lastChanged:
            object.updated,
          name:
            object.metadata.originalName,
          size:
            object.size,
          type:
            "image/jpeg"
        }
        const nameForDoc = object.name.split('/')[1];
        admin.firestore().collection('images')
          .doc(nameForDoc)
          .set(filemet)
          .then(value => resolve(value))
          .catch(err => reject(err))
      }else
      {
        reject('error happen not enougth data');
      }
    });
});

exports.images = functions.https.onRequest((request, response) => {

  admin.firestore().collection('images')
    .get()
    .then(image =>{
      const listOfImage: any = [];
      image.forEach(ima =>  {
        let data = ima.data();
        data.id  = ima.id;
        listOfImage.push(data);
      });
      response.json(listOfImage);

  }).catch(err=> {console.log(err);})

});
