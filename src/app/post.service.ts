import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {Post} from './post.model';
import {catchError, map, tap} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  createAndStorePost(title: string, content: string) {
    const postData: Post = {title, content};
    this.http
      .post<{ name: string }>(
        'https://learning-angular-http-request.firebaseio.com/posts.json',
        postData,
        {observe: 'response'}
      ).subscribe(value => console.log(value), error => {
      this.error = error;
    });
  }

  fetchPost() {
    let print = new HttpParams().set('print', 'pretty');
    print = print.append('key', 'value');
    return this.http.get<{ [key: string]: Post }>('https://learning-angular-http-request.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({'Custom-Header': 'hello'}),
        params: print
      })
      .pipe(map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({...responseData[key], id: key});
            }
          }
          return postArray;
        }
      ), catchError(errorResponse => {
        console.log(errorResponse);
        return throwError(errorResponse);
      }));
  }

  clearPosts() {
    return this.http.delete('https://learning-angular-http-request.firebaseio.com/posts.json',
      {
        observe: 'events'
      }).pipe(tap(event => {
      console.log(event);
      if (event.type === HttpEventType.Sent) {
        // ..
      }
      if (event.type === HttpEventType.Response) {
        console.log(event.body);
      }
    }));
  }
}
