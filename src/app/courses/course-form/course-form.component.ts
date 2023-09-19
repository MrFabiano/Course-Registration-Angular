import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit{

  form = this.formBuilder.group({ 
    name:  [''],
    category: ['']
  });

  constructor(private formBuilder: FormBuilder,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private location: Location){
    
  }

  ngOnInit(): void {}

  onSubmit(){
    this.service.save(this.form.value)
    .subscribe(result => this.onSuccess(), error => this.onError());
  }

  onCancel(): void{
    this.location.back();
  }

  private onSuccess(){
    this.snackBar.open('Curso salvo com sucesso', '', { duration: 5000 });
    console.log('sucesso');
    this.onCancel();
  }

  private onError(){
    this.snackBar.open('Erro salvar o curso', '', { duration: 5000 });
  }
}
