import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'textarea-with-suggestions';
  setting = {
    machingStartChars : '{{',
    machingEndChars : '}',
    options: ['abc', 'bcd', '1cd', '2cd', '3cd', '11cd', '11qcd'],
    default: ''
  };
  form1;
  ngOnInit(){
    this.form1 = this.fb.group({
      test: ['sfsdfsdf'],
      test2:[]
    });
    this.form1.get('test').valueChanges.subscribe(arg => console.log(arg));
    
  }
  constructor(private fb: FormBuilder){}
}
