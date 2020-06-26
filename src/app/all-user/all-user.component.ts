import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-all-user',
  templateUrl: './all-user.component.html',
  styleUrls: ['./all-user.component.scss']
})
export class AllUserComponent implements OnInit {
  constructor(private callApi: ApiserviceService) { }
  dataSource;
  repoDataSource;
  @ViewChild('allUser', { static: true }) paginatorAllUser: MatPaginator;
  @ViewChild('userRepos', { static: true }) paginatorUserRepos: MatPaginator;

  searchTextChanged = new Subject<string>();
  gitHubUser = [];
  userRepoData = [];
  displayedColumns: string[] = ['position', 'id', 'name', 'linkToRepo'];
  ngOnInit() {
    const initialValue = 0;
    this.searchTextChanged.pipe( // wait for the user to complete the search text
      debounceTime(350)
    ).subscribe(x => {
      if (x.trim().length > 0) {
        this.getSearchUser(x);
      }
    });
    this.allUser(initialValue);
  }

  userRepo(element) { // to get all the user repository
    this.userRepoData = [];
    this.callApi.getUerRepo(element).subscribe(data => {
      let position = 1;
      for (const item of data) {
        this.userRepoData.push({
          id: item.id,
          name: item.name,
          linkToRepo: item.html_url,
          position: position ++
        });
      }
      this.repoDataSource = new MatTableDataSource(this.userRepoData);
      this.repoDataSource.paginator = this.paginatorUserRepos;
    });
  }

  searchUser(e) {
    this.searchTextChanged.next(e.target.value);
  }
  getSearchUser(user) { // pushing search user data to the  data table
    this.gitHubUser = [];
    this.callApi.getSearchUser(user).subscribe(data => {
      let position = 1;
      this.gitHubUser.push({
        id: data.id,
        name: data.login,
        linkToRepo: data.repos_url,
        position: position ++
      });
      this.dataSource = new MatTableDataSource(this.gitHubUser);
      this.dataSource.paginator = this.paginatorAllUser;
    });
  }
  resetSearch() {// to reset the Search value in the All GitHub User table
    const value = 0;
    this.gitHubUser = [];
    this.allUser(value);
  }
  allUser(value) { // to get GitHub User from 1 to 30
    this.gitHubUser = [];
    this.callApi.getAllUer(value).subscribe(data => {
      let position = 1;
      for (const item of data) {
        this.gitHubUser.push({
          id: item.id,
          name: item.login,
          linkToRepo: item.repos_url,
          position: position ++
        });
      }
      this.dataSource = new MatTableDataSource(this.gitHubUser);
      this.dataSource.paginator = this.paginatorAllUser;

    });
  }
  openUserRepo(e) { //  redirct  to github repository of the user 
    window.open(e, '_blank');

  }
  nextData() {// next api call to get data of 30 users
    const userData = this.gitHubUser.pop();
    this.allUser(userData.id);
  }
}

