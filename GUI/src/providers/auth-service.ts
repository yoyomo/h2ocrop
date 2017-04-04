import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
 
export class User {
  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
 
  constructor(name: string, lastName: string, username: string, email: string, password:string) {
    this.name = name;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
    
  }
}
 
@Injectable()
export class AuthService {
  currentUser: User;
 
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = (credentials.password === "pass" && credentials.email === "email");
        this.currentUser = new User('Illary', 'Lopes', 'illary.lopes', 'illary.lopes@gmail.com', 'illy');
        observer.next(access);
        observer.complete();
      });
    }
  }
 
  public register(credentials) {
    if (credentials.name === null || credentials.lastname === null || credentials.email == null || 
    credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public forgotPassword(credentials) {
    if ( credentials.email === null || credentials.email != "illary.lopes@gmail.com") {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        let success = (credentials.email === "illary.lopes@gmail.com")
        observer.next(success);
        observer.complete();
      });
    }
  }
 
  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}