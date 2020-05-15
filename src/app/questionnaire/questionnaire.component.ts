import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StudentService } from "src/app/services/student.service";
import { FormGroup, FormControl } from "@angular/forms";
import { QuestionnaireService } from "../services/questionnaire.service";
import { AnswerService } from '../services/answer.service';

@Component({
  selector: "app-teacher",
  templateUrl: "./questionnaire.component.html",
  styleUrls: ["./questionnaire.component.css"],
})
export class QuestionnaireComponent implements OnInit {
  form: FormGroup;
  refNumber;
  students;
  heading;
  subjects;
  questionaire = [];
  listOfQuestionaire;
  selectedQuestionaireId;
  updatedTestRecord;
  formData: { [key: string]: any } = {};

  constructor(
    private studentNameService: StudentService,
    private questionnaireService: QuestionnaireService,
    private commonService: AnswerService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._route.params.subscribe((data) => {
      this.refNumber = data.ref;
      this.heading = data.heading;
      this.formData.selectedSubjectId = 0;
      this.selectedQuestionaireId = 0;
      this.formData.selectedStudentId = data.id;
      this.studentNameService
        .getStudentByRef(this.refNumber)
        .subscribe((data) => {
          this.students = data;
        });
      this.onChangeStudent();
    });
  }

  onChangeStudent() {
    this.studentNameService.getStudentSubjects(this.formData.selectedStudentId).subscribe((data) => {
      this.subjects = data;
    });
  }

  onChangeSubject() {
    this.questionnaireService.getCriteriaName(this.formData.selectedSubjectId).subscribe((data) => {
      this.listOfQuestionaire = data;
    });
  }
  onChangeQuestionaireType() {
    this.questionaire = [];
    if (this.selectedQuestionaireId > 0) {
      this.questionnaireService.getCriteriaById(this.selectedQuestionaireId).subscribe((data) => {
        //this.updatedTestRecord = this.updateTestRecord(this.formData);
        this.questionaire = JSON.parse(data[0].Criteria);
        this.form = new FormGroup({
          fields: new FormControl(JSON.stringify(this.questionaire)),
        });
        // TODO: we need to assign values in questionnaire.
        // this.questionnaireService.getUpdatedStudentTest(this.formData).subscribe(studentTest => {
        //   this.questionaire.forEach(q => {
        //     if (studentTest.hasOwnProperty(q.name)) {
        //       q.value = studentTest[q.name];
        //     }
        //   })
        //   console.log(this.questionaire);

        // });    
      });
    }
  }

  onSubmit(data) {

    const answer = { ...this.formData, answer: data, qId: this.selectedQuestionaireId };
    console.log("data::", JSON.stringify(answer));

    this.commonService.saveAnswer(answer).subscribe((data) => {
      console.log('Record saved successfully.');
      alert('Record saved successfully.');
    }, (err) => {
      alert('An error occured while saving your record');
      console.log(err);
    });

    this.questionaire = [];
  }

}
