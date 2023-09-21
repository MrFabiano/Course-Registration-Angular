import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit{

  form = this.formBuilder.group({ 
    name:['',[Validators.required,
      Validators.minLength(5), 
      Validators.maxLength(100)]],
    category: ['',[Validators.required]]
  });

  constructor(private formBuilder: FormBuilder,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute){
    
  }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form.setValue({
      name: course.name,
      category: course.category
    });
  }

  onSubmit(){
    this.service.save(this.form.value)
  .subscribe(result => this.onSuccess(), error => this.onError());
  }

  onCancel(): void{
    this.location.back();
  }

  private onSuccess(){
    this.snackBar.open('Curso salvo com sucesso', '', { duration: 5000 });
    this.onCancel();
  }

  private onError(){
    this.snackBar.open('Erro salvar o curso', '', { duration: 5000 });
  }

  getErrorMessage(fieldName: string){
    const field = this.form.get(fieldName);
    if(field?.hasError('required')){
      return 'campo abrigatorio';
    }
    if(field?.hasError('minlength')){
      const requiredLength: number = field.errors ? field.errors['minlength']['requiredLength'] : 5;
      return `Tamanho minino precisa ser de ${requiredLength} caracteres.`;
    }

    if(field?.hasError('maxLength')){
      const requiredLength: number  = field.errors ? field.errors['maxlength']['requiredLength'] : 200;
      return `Tamanho maximo execidido ${requiredLength} caracteres.`;
    }

    return 'Campo invalido';
  }
}
