import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  constructor(private http: HttpClient) { }

public  getAllUer(value): Observable<any>{
 return this.http.get('https://api.github.com/users?since='+value);
}
public  getUerRepo(userName): Observable<any>{
  return this.http.get("https://api.github.com/users/"+userName+"/repos");
 }
 public   getSearchUser(user): Observable<any>{
  return this.http.get("https://api.github.com/users/"+user);
 }
}
