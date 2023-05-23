import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(private estudanteService: EstudanteService,
    private formBuilder: FormBuilder, private modalService: NgbModal) {
    this.formGroupEstudante = formBuilder.group({
      id: [''],
      name: [''],
      email: [''],
      RG: [''],
      data_nasc: [''],
      tel: ['']
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
    if(this.isEditing)
    {
      this.estudanteService.update(this.formGroupEstudante.value).subscribe(
        {
          next: () => {
            this.loadEstudantes();
            this.formGroupEstudante.reset();
            this.isEditing = false;
          }
        }
      )
    }
    else{
      this.estudanteService.save(this.formGroupEstudante.value).subscribe(
        {
          next: data => {
            this.estudantes.push(data);
            this.formGroupEstudante.reset();
          }
        }
      )
    }
  }

  edit(estudante: Estudante){
    this.formGroupEstudante.setValue(estudante);
    this.isEditing = true;
  }

  delete(estudante: Estudante){
    this.estudanteService.delete(estudante).subscribe({
      next: () => this.loadEstudantes()
    })
  }

  open(content: any) {
    this.modalService.open(content);
  }
}