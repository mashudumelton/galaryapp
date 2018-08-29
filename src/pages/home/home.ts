
import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

 
  mash= 0;
  imageURI;
  stringPic;
  stringVideo;
  stringAudio;
  upload;
  uploadFile={
    name:'',
    downloadUrl:''
  }
  fire={
    downloadUrl:''
  }
  firebaseUploads;
  constructor(public navCtrl: NavController, public navParams: NavParams,private mediaCapture: MediaCapture, private platform : Platform, private f : File) {
    //  this.upload = firebase.database().ref('/upload/');
    this.firebaseUploads = firebase.database().ref('/fireuploads/');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  uploads(type) {
    this.platform.ready().then(() => {
      let promise
      switch (type) {
        case 'camera':
          promise = this.mediaCapture.captureImage()
          break
        case 'video':
          promise = this.mediaCapture.captureVideo()
          break
        case 'audio':
          promise = this.mediaCapture.captureAudio()
          break
      }

      promise.then((mediaFile: MediaFile[]) => {
        console.log(mediaFile)
       
        //this.presentLoading
        this.imageURI = mediaFile[0].fullPath
        var name = this.imageURI.substring(this.imageURI.lastIndexOf('/')+1, this.imageURI.length);
        console.log(name);
        
        switch (type) {
          case 'camera':
            this.stringPic = this.imageURI;
            this.uploadFile.name ="Camera Image"
            this.uploadFile.downloadUrl =  this.stringPic;
            this.upload.push({name:"Camera Image",downloadUrl: this.stringPic});
            break
          case 'video':
          this.stringVideo = this.imageURI;
          this.uploadFile.name ="Video"
          this.uploadFile.downloadUrl =   this.stringVideo ;
          this.upload.push({name:"Video",downloadUrl: this.stringVideo});
            break
          case 'audio':
          this.stringAudio = this.imageURI;
          this.uploadFile.name ="Audio"
          this.uploadFile.downloadUrl =  this.stringAudio;
          this.upload.push({name:"Audio",downloadUrl: this.stringAudio});
            break
        }
        var directory: string = this.imageURI.substring(0, this.imageURI.lastIndexOf('/')+1);
        directory = directory.split('%20').join(' ')
        name = name.split('%20').join(' ')
        console.log(directory)
        console.log('About to read buffer')
        let seperatedName = name.split('.')
        let extension = ''
        if (seperatedName.length > 1) {
          extension = '.' + seperatedName[1]
        }
        return this.f.readAsArrayBuffer(directory, name).then((buffer: ArrayBuffer) => {
          console.log(buffer)
          console.log('Uploading file')
          var blob = new Blob([buffer], { type: mediaFile[0].type });
          console.log(blob.size);
          console.log(blob)
          const storageRef = firebase.storage().ref('files/' + new Date().getTime() + extension);
          return storageRef.put(blob).then((snapshot:any) => {
            console.log('Upload completed')
            //this.loader.dismiss;
            console.log(snapshot.Q)
             let  files = [];
            storageRef.getDownloadURL().then((url) => {
              this.fire.downloadUrl = url;
              this.firebaseUploads.push({downloadUrl: url});
              return this.fire.downloadUrl;
            });
            console.log(this.firebaseUploads);
           
        
          })
          
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    })
  }
  navigate(obj){
    if(obj === "u"){
      this.mash = 1;
    }else if(obj === "v"){
      this.mash = 2;
    }else if(obj === "b"){
      this.mash = 0;
    }
  }
  melt = 0;
  viewUploads(cow){
    console.log("--------------------->"+ cow);
    if(cow === "p"){
      this.melt = 1;
      this.retriveImages();

      this.mash = -99;
    
    }else if(cow === "v"){
      console.log("--------------------->");
      this.melt = 3;
      this.getVideos();
      this.mash = -99;
    }else if(cow === "a"){
      this.melt = 4;
      this.getAudios();
      this.mash = -99;
    }
  }

  b;
 imageUrl;
 count =0;
 images =[];
 
 retriveImages(){
   firebase.database().ref('/fireuploads/').on("value",(snapshot) =>{
     snapshot.forEach((snap) =>{
       this.b = {keyname : snap.key, name :snap.val().downloadUrl};
       this.imageUrl =  this.b.name;
       this.images.push(this.imageUrl);

       return false;
     })
   });
 }
 imageVideoSrc : string;

   imageEmp;
   videos = [];
   videoUrl = "";


 getVideos(){

  firebase.database().ref('/fireuploads/').on("value",(snapshot) =>{
    snapshot.forEach((snap) =>{
      this.b = {keyname : snap.key, name :snap.val().downloadUrl};
      this.videoUrl =  this.b.name;
      if(this.videoUrl.indexOf('.3gp') >= 0){
        this.videos.push(this.videoUrl);

      }
      if(this.videoUrl.indexOf('.mp4') >= 0){
        this.videos.push(this.videoUrl);
   
      }
      return false;
    })
  });
 }





audios = [];
// audioUrl;
audioUrl = "";

 getAudios(){
  firebase.database().ref('/fireuploads/').on("value",(snapshot) =>{
    snapshot.forEach((snap) =>{
      this.b = {keyname : snap.key, name :snap.val().downloadUrl};
      this.audioUrl =  this.b.name;
      if(this.audioUrl.indexOf('.m4a') >= 0){
        this.audios.push(this.audioUrl);
        console.log("--------------audios---------->"+this.audioUrl);
      }
      if(this.audioUrl.indexOf('.mpeg') >= 0){
        this.audios.push(this.audioUrl);
        console.log(this.audioUrl);
      }
      if(this.audioUrl.indexOf('.wav') >= 0){
        this.audios.push(this.audioUrl);
        console.log(this.audioUrl);
      }
      if(this.audioUrl.indexOf('.mp3') >= 0){
        this.audios.push(this.audioUrl);
        console.log(this.audioUrl);
      }
      return false;
    })
  });
 }
}