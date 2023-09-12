import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from './student';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  url = "http://localhost:8080/students";
  constructor(private http: HttpClient) { }

  getStudent(): Observable<Student[]> {
    return this.http.get<Student[]>(this.url);
  }

  save(student: Student): Observable<Student>{
    return this.http.post<Student>(this.url, student);
  }

  update(student: Student): Observable<void>{
    return this.http.put<void>(`${this.url}/${student.id}`, student);
  }

  delete(student: Student): Observable<void>{
    return this.http.delete<void>(`${this.url}/${student.id}`);
  }
}
