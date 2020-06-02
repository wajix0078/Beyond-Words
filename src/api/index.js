/* eslint class-methods-use-this: 0 */

import { snapshotToArray } from './../helpers';
import firebase from './../lib/firebase';
import '@firebase/firestore'
import '@firebase/storage'
// this.firestoreDb = firebase.firestore() 
import uuid from 'uuid';

class API {
  uid = '';
  dbRef = firebase.firestore();
  storageRef = firebase.storage().ref();
  messagesRef = null;

  constructor() {
    this.getCurrentUser()
  }
  setDbRef() {
    this.dbRef = firebase.firestore()
    this.storageRef = firebase.storage().ref();
  }
  setCurrentUser() {
    try {
      this.currentUser = firebase.auth().currentUser;
    } catch (error) {
      console.log(error)
    }
  }

  registerNewUser = async (userData) => {
    try {
      return firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
        .then(async (createdUser) => {
          this.setCurrentUser();
          this.setUid(createdUser.user.uid)
          return this.dbRef.collection('users').doc(createdUser.user.uid).set(userData)
            .then(res => {
              return {
                status: true,
                message: 'User Created with uid: ' + createdUser.user.uid
              }
            })
            .catch((error) => {
              return {
                status: false,
                message: error.message
              }
            })
        })
        .catch((error) => {
          return {
            status: false,
            message: error.message
          }
        })
    } catch (error) {
      return {
        status: false,
        message: error.message
      }
    }
  }


  getCurrentUser = () => new Promise((resolve, reject) => {
    try {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          this.setUid(user.uid);
          this.setCurrentUser();
          resolve(user);
        }
        else {
          resolve(false)
        }
      })
    }
    catch (e) {
      console.log(e)
      reject(e)
    }
  })


  setUid(value) {
    try {
      this.uid = value;
    } catch (error) {
      console.log(error)
    }
  }

  getUid() {
    return this.uid;
  }

  signOutFirebase() {
    return firebase.auth().signOut();
  }

  sendPasswordResetEmail(email) {
    return firebase
      .auth()
      .sendPasswordResetEmail(email);
  }

  getUserById = (userId) => new Promise(async (resolve, reject) => {
    try {
      let userRef = this.dbRef.collection('users').doc(userId);
      let getDoc = userRef.get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!');
            reject(null)
          } else {
            resolve(doc.data());
          }
        })
        .catch(err => {
          console.log('Error getting document', err);
          reject(null)
        });
    } catch (error) {
      console.log('No userId!', error);
      reject(null)
    }
    // this.dbRef.child(`users/${userId}`).once('value')
    //   .then(userSnap => {
    //     const user = userSnap.val();
    //     user.uid = userId;
    //     resolve(user)
    //   })
    //   .catch((err) => reject(err))
  });
  updateUserById = (userId, data) => new Promise(async (resolve, reject) => {
    try {
      this.dbRef.collection('users').doc(userId).update(data)
        .then(res => {
          resolve(true)
        })
    } catch (error) {
      console.log('No userId Found!', error);
      reject(null)
    }
  })

  addToHistoryForUser = (userId, sentence, date = Date.now()) => new Promise(async (resolve, reject) => {
    try {
      this.dbRef.collection('history').add({
        sentence,
        date,
        userId
      })
        .then(res => {
          resolve(true)
        })
        .catch(error => {
          console.log('Failed to add history!', error);
          reject(null)
        })

    } catch (error) {
      console.log('Failed to add history!', error);
      reject(null)
    }
  })
  getHistoryByUserId = (userId) => new Promise(async (resolve, reject) => {
    try {
      const historyRef = this.dbRef.collection('history')
      let queryRef = historyRef.where('userId', '==', userId).get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            reject(null)
          }
          resolve(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        })
        .catch(err => {
          console.log('Error getting documents', err);
          reject(null)
        });
    } catch (error) {
      console.log('No History Found!', error);
      reject(null)
    }
  })
  getCategories = () => new Promise(async (resolve, reject) => {
    try {
      const snapshot = await this.dbRef.collection('Categroies').get()
      resolve(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.log('No Categroies Found!', error);
      reject(null)
    }
  })

  deleteImageFromStorage = (fileName) => new Promise(async (resolve, reject) => {
    // Create a reference to the file to delete
    var desertRef = this.storageRef.child('/' + fileName);

    // Delete the file
    desertRef.delete().then(function () {
      // File deleted successfully
      resolve("Image successfully deleted!");
    }).catch(function (error) {
      // Uh-oh, an error occurred!
      reject(new TypeError("Error removing document: ", error));
    });
  })

  deleteImageById = (imageId) => new Promise(async (resolve, reject) => {
    this.dbRef.collection('Images').doc(imageId).delete().then(function () {
      resolve("Document successfully deleted!");
    }).catch(function (error) {
      reject(new TypeError("Error removing document: ", error));
    });
  })

  getUploadedImagesByCategoriesAndUserId = (userId, catId) => new Promise(async (resolve, reject) => {
    try {
      let imagesRef = this.dbRef.collection('Images');
      imagesRef.where('categoryID', '==', catId).where('userId', '==', userId).get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching Images for catId:', catId);
            reject(null);
          }
          // resolve(snapshot.docs.filter(doc => (doc.userId !== userId) || (doc.userId == undefined))
          resolve(snapshot.docs
            .map(doc => ({ ...doc.data(), id: doc.id })));
        })
        .catch(err => {
          console.log(err, 'No matching Images for catId:', catId);
          reject(null)
        });
    } catch (error) {
      console.log('No Categroies Found!', error);
      reject(null)
    }
  })
  getImagesByUserAndCategoryId = (userId, catId) => new Promise(async (resolve, reject) => {
    try {
      let imagesRef = this.dbRef.collection('Images');
      imagesRef.where('categoryID', '==', catId).where('userId', 'in', [userId, '']).get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching Images for catId:', catId);
            reject(null);
          }
          // resolve(snapshot.docs.filter(doc => (doc.userId !== userId) || (doc.userId == undefined))
          resolve(snapshot.docs
            .map(doc => ({ ...doc.data(), id: doc.id })));
        })
        .catch(err => {
          console.log(err, 'No matching Images for catId:', catId);
          reject(null)
        });
    } catch (error) {
      console.log('No Categroies Found!', error);
      reject(null)
    }
  })

  uploadImageDataByUserId = (userId, imageData, date = Date.now()) => new Promise(async (resolve, reject) => {
    try {
      this.dbRef.collection('Images').add({
        ...imageData,
        date,
        userId
      })
        .then(res => {
          resolve(true)
        })
        .catch(error => {
          console.log('Failed to add image!', error);
          reject(null)
        })

    } catch (error) {
      console.log('Failed to add image!', error);
      reject(null)
    }
  })
  updateImageDataById = (id, imageData, date = Date.now()) => new Promise(async (resolve, reject) => {
    try {
      this.dbRef.collection('Images').doc(id).update({
        ...imageData,
        date,
      })
        .then(res => {
          resolve(true)
        })
        .catch(error => {
          console.log('Failed to update image!', error);
          reject(null)
        })

    } catch (error) {
      console.log('Failed to update image!', error);
      reject(null)
    }
  })

  async uploadImageAsync(uri) {
    try {
      // Why are we using XMLHttpRequest? See:
      // https://github.com/expo/expo/issues/2402#issuecomment-443726662
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const ref = this.storageRef.child(uuid.v4());
      const snapshot = await ref.put(blob);

      // We're done with the blob, close and release it
      blob.close();

      return await snapshot.ref.getDownloadURL();
    } catch (error) {
      return (new TypeError('Network request failed: ' + error.message));
    }

  }

}



export default new API();
