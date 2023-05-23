import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Estudante } from '../estudante';
import { EstudanteService } from '../estudante.service';

@Component({
  selector: 'app-estudantes',
  templateUrl: './estudantes.component.html',
  styleUrls: ['./estudantes.component.css']
})
export class EstudantesComponent {
  estudantes: Estudante[] = [];
  isEditing : boolean = false;
  formGroupEstudante: FormGroup;
  submitted: boolean = false;

  constructor(private estudanteService: EstudanteService,
    private formBuilder: FormBuilder, private modalService: NgbModal) {
    this.formGroupEstudante = formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      RG: ['', [Validators.required]],
      data_nasc: ['', [Validators.required]],
      tel: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    this.loadEstudantes();
  }

  loadEstudantes() {
    this.estudanteService.getEstudante().subscribe(
      {
        next: data => this.estudantes = data
      }
    );
  }

  save() {
    this.submitted = true;

    if(this.formGroupEstudante.valid) {
      if(this.isEditing)
    {
      this.estudanteService.update(this.formGroupEstudante.value).subscribe(
        {
          next: () => {
            this.loadEstudantes();
            this.formGroupEstudante.reset();
            this.isEditing = false;
            this.submitted = false;
          }
        }
      )
    }
    else {
      this.estudanteService.save(this.formGroupEstudante.value).subscribe(
        {
          next: data => {
            this.estudantes.push(data);
            this.formGroupEstudante.reset();
            this.submitted = false;
          }
        }
      )
    }
    }
  }

  limpar() {
    this.formGroupEstudante.reset();
    this.isEditing = false;
    this.submitted = false;
  }

  edit(estudante: Estudante) {
    this.formGroupEstudante.setValue(estudante);
    this.isEditing = true;
  }

  delete(estudante: Estudante) {
    this.estudanteService.delete(estudante).subscribe({
      next: () => this.loadEstudantes()
    })
  }

  open(content: any) {
    this.modalService.open(content);
  }

  get name() : any {
    return this.formGroupEstudante.get("name")
  }

  get email() : any {
    return this.formGroupEstudante.get("email")
  }

  fecharModal() {
    if (this.formGroupEstudante.valid) {
      this.modalService.dismissAll();
      this.submitted = false;
    }
  }
  
}