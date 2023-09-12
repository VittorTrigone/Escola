import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Student } from '../student';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {
  students: Student[] = [];
  isEditing : boolean = false;
  formGroupStudent: FormGroup;
  submitted: boolean = false;

  constructor(private studentService: StudentService,
    private formBuilder: FormBuilder, private modalService: NgbModal) {
    this.formGroupStudent = formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]],
      location: ['', [Validators.required]]
    })
  }
  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudent().subscribe(
      {
        next: data => this.students = data
      }
    );
  }

  save() {
    this.submitted = true;

    if(this.formGroupStudent.valid) {
      if(this.isEditing)
    {
      this.studentService.update(this.formGroupStudent.value).subscribe(
        {
          next: () => {
            this.loadStudents();
            this.formGroupStudent.reset();
            this.isEditing = false;
            this.submitted = false;
          }
        }
      )
    }
    else {
      this.studentService.save(this.formGroupStudent.value).subscribe(
        {
          next: data => {
            this.students.push(data);
            this.formGroupStudent.reset();
            this.submitted = false;
          }
        }
      )
    }
    }
  }

  limpar() {
    this.formGroupStudent.reset();
    this.isEditing = false;
    this.submitted = false;
  }

  edit(student: Student) {
    this.formGroupStudent.setValue(student);
    this.isEditing = true;
  }

  delete(student: Student) {
    this.studentService.delete(student).subscribe({
      next: () => this.loadStudents()
    })
  }

  open(content: any) {
    this.modalService.open(content);
  }

  get name() : any {
    return this.formGroupStudent.get("name")
  }

  get email() : any {
    return this.formGroupStudent.get("email")
  }

  get cpf() : any {
    return this.formGroupStudent.get("cpf")
  }

  get location() : any {
    return this.formGroupStudent.get("location")
  }

  fecharModal() {
    if (this.formGroupStudent.valid) {
      this.modalService.dismissAll();
      this.submitted = false;
    }
  }

}
