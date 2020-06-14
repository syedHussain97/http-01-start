import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from './post.model';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostService {

  constructor(private http: HttpClient) {
  }

  createAndStorePost(title: string, content: string) {
    const postData: Post = {title, content};
    return this.http
      .post<{ name: string }>(
        'https://learning-angular-http-request.firebaseio.com/posts.json',
        postData
      );

  }

  fetchPost() {
    return this.http.get<{ [key: string]: Post }>('https://learning-angular-http-request.firebaseio.com/posts.json')
      .pipe(map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({...responseData[key], id: key});
            }
          }
          return postArray;
        }
      ));
  }

   clearPosts() {
    return this.http.delete('https://learning-angular-http-request.firebaseio.com/posts.json');
  }

}
