import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';
import { Lesson } from '../../model/lesson';
import { FormUtilsService } from '../../../shared/form/form-utils.service';

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
    private route: ActivatedRoute,
    public formUtils: FormUtilsService){
    
  }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form = this.formBuilder.group({ 
    name:[course.name,[Validators.required,
      Validators.minLength(5), 
      Validators.maxLength(100)]],
    category: [course.category,[Validators.required]],
    lessons: this.formBuilder.array(this.retrieveLessons(course), Validators.required)
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
      id: [lesson.id,],
      name: [lesson.name,[Validators.required,
        Validators.minLength(5), 
        Validators.maxLength(100)]],
      youTubeUrl: [lesson.youTubeUrl, [Validators.required,
        Validators.minLength(10), 
        Validators.maxLength(100)]]
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
    if(this.form.valid){
      this.service.save(this.form.value)
      .subscribe(result => this.onSuccess(), error => this.onError());
    }else{
      this.formUtils.validateAllFormFields(this.form);
    }
 
  }

  onCancel(): void{
    this.location.back();
  }

  private onSuccess(){
    this.snackBar.open('Course saved successfully', '', { duration: 5000 });
    this.onCancel();
  }

  private onError(){
    this.snackBar.open('Error saving course', '', { duration: 5000 });
  }
}
