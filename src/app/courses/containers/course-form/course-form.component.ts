import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';
import { Lesson } from '../../model/lesson';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit{

   form!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute){
    
  }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form = this.formBuilder.group({ 
    name:[course.name,[Validators.required,
      Validators.minLength(5), 
      Validators.maxLength(100)]],
    category: [course.category,[Validators.required]],
    lessons: this.formBuilder.array(this.retrieveLessons(course))
  });
  console.log(this.form);
  console.log(this.form.value);
  }

  private retrieveLessons(course: Course){
    const lessons = [];
     if(course?.lessons){
        course.lessons.forEach(lesson => lessons.push(this.createLesson(lesson)))
     }else{
        lessons.push(this.createLesson());
     }

     return lessons;
  }

  private createLesson(lesson: Lesson = {id: '', name: '', youTubeUrl: ''}){
    return this.formBuilder.group({
      id: [lesson.id],
      name: [lesson.name],
      youTubeUrl: [lesson.youTubeUrl]
    });
  }

  addNewLesson(){
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.push(this.createLesson());
  }

  removeLesson(index: number){
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.removeAt(index);
  }

  getLessonsFormArray(){
    return (<UntypedFormArray>this.form.get('lessons')).controls;
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
