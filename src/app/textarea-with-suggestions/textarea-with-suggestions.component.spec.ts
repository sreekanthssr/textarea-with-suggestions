import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaWithSuggestionsComponent } from './textarea-with-suggestions.component';

describe('TextareaWithSuggestionsComponent', () => {
  let component: TextareaWithSuggestionsComponent;
  let fixture: ComponentFixture<TextareaWithSuggestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextareaWithSuggestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaWithSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
