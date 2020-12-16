import {Component, OnInit} from '@angular/core';
import {Label} from './models/Label';
import {Document} from './models/Document';
import {Annotation} from './models/Annotation';
import {analyzeNgModules} from '@angular/compiler';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Dictionnary} from './models/Dictionnary';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  constructor(private http: HttpClient) {
  }

  title = 'TestFront';
  labels: Label[] = [];
  currentLabel: any;
  selectedLabel = null;

  textdocument: Document = new Document();
  annotation: Annotation = null;
   dictionnary: Dictionnary;
  // tslint:disable-next-line:typedef
  changeSelectedLabel(labelid: any) {
    if (this.currentLabel != null) {
      this.currentLabel.style.color = '#FFFFFF';
    }
    this.currentLabel = document.getElementById(labelid);
    this.selectedLabel = this.labels[labelid];
    this.currentLabel.style.color = 'black';
  }

  // tslint:disable-next-line:typedef
  addAnnotation() {
    if (this.selectedLabel != null) {
      this.annotation = new Annotation();
      this.dictionnary = new Dictionnary();
      this.annotation.start = window.getSelection().anchorOffset;
      this.annotation.end = window.getSelection().focusOffset;
      this.annotation.label = this.selectedLabel;
      this.annotation.text = window.getSelection().toString();
      this.textdocument.annotation.push(this.annotation);
      this.dictionnary.text = this.annotation.text;
      this.dictionnary.label = this.selectedLabel.labelText;
      this.dictionnary.start = this.annotation.start;
      this.dictionnary.end = this.annotation.end;
      this.dictionnary.document = this.dictionnary.document;
      this.returnDataAnnotation(this.dictionnary);
      this.displayDocumentResult();
    } else {
      alert('Please Select a label before');
    }
  }


  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.getLabels();
    this.getAnnotation();
    this.displayDocumentResult();
  }

  // tslint:disable-next-line:typedef
  getLabels() {
    this.labels.push({labelText: 'DIPLOMA', bgColor: '#006400'});
    this.labels.push({labelText: 'SKILLS', bgColor: '#800080'});
    this.labels.push({labelText: 'EXPERIENCE', bgColor: '#000080'});
    this.labels.push({labelText: 'DIPLOMA_MAJOR', bgColor: '#8B0000'});

  }

  // tslint:disable-next-line:typedef
  getAnnotation() {
    this.textdocument.document = this.textdocument.document;
    this.textdocument.annotation = [];
  }

  // tslint:disable-next-line:typedef
  displayDocumentResult() {
    console.log(this.textdocument);
    this.textdocument.annotation.sort((obj1, obj2) => {
      if (obj1.start > obj2.start) {
        return 1;
      }

      if (obj1.start < obj2.start) {
        return -1;
      }
      return 0;
    });
    console.log(this.textdocument);
    let start = 0;
    let result = '';
    this.textdocument.annotation.forEach(annotation => {
      const inf: string = this.textdocument.document.substring(start, annotation.start);
      // tslint:disable-next-line:triple-equals
      if (annotation.start != start) {
        result += this.textdocument.document.substring(start, annotation.start);
      }
      const selectedLab = '<span style=\'background-color:white;color: black\'>' + annotation.label.labelText + '</span>';
      // tslint:disable-next-line:max-line-length
      const selectedText = '<span style=\'border: 2px solid ' + annotation.label.bgColor + '; color:white;background-color:' + annotation.label.bgColor + '\'>' + annotation.text + ' ' + selectedLab + '</span>';
      start = annotation.end;
      result += ' ' + selectedText + ' ';
    });
    const sup: string = this.textdocument.document.substring(start, this.textdocument.document.length);
    result += sup;
    document.getElementById('doc').innerHTML = result;
  }
  // tslint:disable-next-line:typedef
  returnDataAnnotation(annotation)
  {
    const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa('admin' + ':' + 'admin') });

    return this.http.post('http://127.0.0.1:8000/dictionary/', annotation, {headers})
      .subscribe((data) => {console.log(data); },
        (error => {console.log('error'); }));
  }
}
