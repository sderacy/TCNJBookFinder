import { Component } from '@angular/core';                           //Import Ionic component
import { Http } from '@angular/http';                                //Allow HTTP requests
import { MapDisplayPage } from '../map-display/map-display.page';    //Get info from Map Display Page
import { Routes } from '@angular/router';                            //Import Router for navigating pages
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';                   //Import Router for navigating pages

//Define function for splitting a string at an index
const splitAt = index => x => [x.slice(0, index), x.slice(index)]

//Define Ionic Home Page component
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {

  public rootPage: any = HomePage;      //Define the Home Page as the root page
  stackData   = "";                     //Global string for holding value returned by database
  lCallNum    = "";                     //Global string (local to this file) that will hold the user call number
  callNum     = "";                     //Global string to be updated by the input to the text box (updated by HTML file)
  collection  = "";                     //Global String to be updated by the input to the collection dropdown (updated by HTML file)

  //Define Home Page properties
  data: any;
  navCtrl: any;
  storage: any;

  public info: string = "";

  //Constructor for routing from Home Page to Map Display Page
  constructor(public http: Http, private router: Router, public modalController: ModalController) {
    
    const routes: Routes = [
      { path: 'home', component: HomePage },
      { path: 'map-display', component: MapDisplayPage },
      { path: 'modal', component: ModalPage},
    ];
    this.http = http;

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage
    });
    return await modal.present();
  }

  textUpdate() {
    switch(this.collection) {
      case "":
        this.info = "";
        break;
      case "General Collection":
        this.info = "EX: A 15 .G"
        break;
      case "Bound Periodicals":
        this.info = "EX: D 839 .M435";
        break;
      case "Caldecott/Newberry":
        this.info = "EX: 185 or 99";
        break;
      case "Current Newspapers":
        this.info = "EX: LOOK THESE UP";
        break;
      case "Current Periodicals":
        this.info = "EX: LB1028.J69 or RC489.B4B435";
        break;
      case "Government Documents":
        this.info = "GA1.13:AFMD-93-58BR or 974.90 159 1988-1989 or U";
        break;
      case "Leisure Reading":
        this.info = "EX: LOOK THESE UP";
        break;
      case "Music Reference":
        this.info = "EX: ML 134 .K";
        break;
      case "New Books":
        this.info = "EX: LOOK THESE UP";
        break;
      case "RAND":
        this.info = "EX: AR-3792 or Ref. AS36 R3321 V. 30/39";
        break;
      case "Children's Collection":
        this.info = "EX: 791.3 M or Fict Zusak";
        break;
      case "Curriculum Reference":
        this.info = "EX: PN 1009";
        break;
      case "New Textbook Collection":
        this.info = "372.4 Ope";
        break;
      case "Old Textbook Collection":
        this.info = "374.2 Mer 1967";
        break;
      case "Recent Newspapers":
        this.info = "EX: LOOK THESE UP";
        break;
      default:
        this.info = "";
        break;
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  //Function to convert user entered call number into correctly formatted LoC Call Number string
  normalize() {
    if(this.collection == "General Collection" || this.collection == "Bound Periodicals" || this.collection == "Caldecott/Newberry" || this.collection == "Curriculum Reference" || this.collection == "Music Reference") {
      this.normalizeLC();
    }
    else if(this.collection == "Children's Collection" || this.collection == "New Textbook Collection" || this.collection == "Old Textbook Collection") {
      this.normalizeMelvil();
    }
  }

  //Function to convert user entered call number into correctly formatted LoC Call Number string
  normalizeLC() {
    var cutterNum = 0;  //Variable representing how many cutters are in the call number
    var str1, str2;     //Helper variables to hold 2 parts of a separated string

    //Place the string in a file-local variable so it does not update the text box
    this.lCallNum = this.callNum;

    //Remove all spaces from the string, and make the string all uppercase
    this.lCallNum = this.lCallNum.replace(/ /g, "");
    this.lCallNum = this.lCallNum.toUpperCase();

    //Read the second character of the string (the first will always be a letter)

      //If the second character is a number, place a space before the second character
      if(this.lCallNum.charCodeAt(1) >= 48 && this.lCallNum.charCodeAt(1) <= 57) { 
        this.lCallNum = splitAt(1)(this.lCallNum).join(' ');
      }

      //Otherwise, place a space after the second character
      else if ((this.lCallNum.charCodeAt(1) >= 65 && this.lCallNum.charCodeAt(1) <= 90) ||
      (this.lCallNum.charCodeAt(1) >= 97 && this.lCallNum.charCodeAt(1) <= 122)) {
        this.lCallNum = splitAt(2)(this.lCallNum).join(' ');
      }

    //Continue reading until a period (.) is found
    for (var i = 2; i < this.lCallNum.length; ++i) {
      //To prevent accidental infinite loops
      if(i > 50)
        break;

      //When a period is found
      if (this.lCallNum.charAt(i) == '.' && cutterNum == 0) {
        //Read the next character. If it is a number, it's still part of the classification number
        //If it is a letter, it's the beginning of the cutter and a space is added before the period
        if ((this.lCallNum.charCodeAt(i + 1) >= 65 && this.lCallNum.charCodeAt(i + 1) <= 90) ||
        (this.lCallNum.charCodeAt(i + 1) >= 97 && this.lCallNum.charCodeAt(i + 1) <= 122)) {
          this.lCallNum = splitAt(i)(this.lCallNum).join(' ');
          cutterNum = 1;
          i += 3;
        }
      }

      //Continue reading in characters.  If a c or a C is found, check the next letter
      if (this.lCallNum.charAt(i) == 'c' || this.lCallNum.charAt(i) == 'C') {
        //If it's a period, its a copy number and a space is added before the c
        if (this.lCallNum.charAt(i + 1) == '.') {
          
          this.lCallNum = splitAt(i)(this.lCallNum).join(' ');
          i += 3;

        }
        //Otherwise, this is a second cutter and a space is added before the c
        else {

          this.lCallNum = splitAt(i)(this.lCallNum).join(' ');
          i++;

        }
      }

      //If a v or a V is found, check the next letter
      if (this.lCallNum.charAt(i) == 'v' || this.lCallNum.charAt(i) == 'V') {
        //If it's a period, its a version number and a space is added before the v
        if (this.lCallNum.charAt(i + 1) == '.') {
          this.lCallNum = splitAt(i)(this.lCallNum).join(' ');
          i += 3;
        }
        //Otherwise, this is a second cutter and a space is added before the v
        else {
          
          this.lCallNum = splitAt(i)(this.lCallNum).join(' ');
          i++;

        }

      }

      //If a period is found, this is a second cutter, the period should be removed and a space
      //is added before the letter
      if (this.lCallNum.charAt(i) == '.' && cutterNum == 1) {
        
        str1 = this.lCallNum.substr(0, i);
        str2 = this.lCallNum.substr(i);
        str2 = str2.substr(1);
        this.lCallNum = str1 + ' ' + str2;
        i += 2;

      }

      //If any other letter is found, (not c or v), this is a second cutter and a space is
      //added before the letter
      if ((this.lCallNum.charCodeAt(i) >= 65 && this.lCallNum.charCodeAt(i) <= 90) ||
      (this.lCallNum.charCodeAt(i) >= 97 && this.lCallNum.charCodeAt(i) <= 122)) {

        if (!(this.lCallNum.charAt(i) == 'v' || this.lCallNum.charAt(i) == 'V' ||
        this.lCallNum.charAt(i) == 'c' || this.lCallNum.charAt(i) == 'C')) {
          
          this.lCallNum = splitAt(i)(this.lCallNum).join(' ');
          i++;

        }

      }

    }

    console.log("User Call Num Normalized: " + this.lCallNum);

  }

  normalizeMelvil() {
    //Place the string in a file-local variable so it does not update the text box
    this.lCallNum = this.callNum;

    //Make the string all uppercase
    this.lCallNum = this.lCallNum.toUpperCase();

    if(this.lCallNum.substring(0, 4) == "FICT") {
      this.lCallNum = this.lCallNum.substring(5);
    }
  }

  //Function to retrieve library info by querying the database for the user's call number and collection
  //This function is called when the submit button is pressed on the home page
  load() {

    //normalize the user's call number
    this.normalize();

    //Create an object that can be turned into a JSON string and sent to the database with an HTTP post
    var obj = {callnum: this.lCallNum, collection: this.collection};
    console.log('AAAAA');
    
    //Post the user data and get a response
    this.http.post("http://bookfind.hpc.tcnj.edu/retrieve-data.php", JSON.stringify(obj)).subscribe (data => {
      //Place the database response in the stackData variable
      this.stackData = data['_body'];

      console.log(this.stackData);

      this.router.navigateByUrl('map-display/:' + this.stackData);
    },
    
    (error : any) =>

    {
      //If the connection doesn't work, an error message is sent.
      alert(error); 
    });

  }

}