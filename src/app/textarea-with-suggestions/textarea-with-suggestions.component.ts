import { Component, OnInit, Input, ElementRef, forwardRef, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
interface settingObj{
  machingStartChars : '${',
  machingEndChars : '}',
  options: [],
  default: ''
}

@Component({
  selector: 'app-textarea-with-suggestions',
  templateUrl: './textarea-with-suggestions.component.html',
  styleUrls: ['./textarea-with-suggestions.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaWithSuggestionsComponent),
      multi: true
    }
  ]
})
export class TextareaWithSuggestionsComponent implements OnInit,ControlValueAccessor  {

  @Input() setting : settingObj;
  showOption: boolean = false;
  currentValue: string = '';
  currentValueHTML: string = '';
  optionStyle: Object = {top: 0, left: 0};
  target: any = null;
  options: string[] = null;

  @Input() disabled = false;

  @HostBinding('style.opacity')
  get opacity() {
    return this.disabled ? 0.25 : 1;
  }
  
  constructor() { }

  ngOnInit() {
    this.currentValue = this.setting.default;
    this.currentValueHTML = this._wrap_span(this.currentValue); 
  }

  contentUpdated(event){
    const target = event.target
    this.currentValue = target.innerText;
    this.onChange(this.currentValue);
    const lastChar = this.currentValue.substr(this.currentValue.length - this.setting.machingStartChars.length);
    if(this.showOption){
      const valueSplit = this.currentValue.split(this.setting.machingStartChars);
      let filterChar = valueSplit[valueSplit.length -1];
      //@ts-ignore
      this.options = this.setting.options.filter(obj => obj.toLowerCase().startsWith(filterChar));   
    }
    if(event.keyCode == 32){      
      if(this.currentValue){
        target.innerHTML = this._wrap_span(this.currentValue);
        this._moveCaretLast(target);
      }
    } else if(lastChar == this.setting.machingStartChars){
      this.options = this.setting.options;
      this.showOption = true;
      this.optionStyle = this._getCaretGlobalPosition();
      this.target = target;
    }
    
  }

  optionSelected(option){
    if(option && this.target){
      this.currentValue += `${option}${this.setting.machingEndChars}`;
      this.target.innerHTML = this._wrap_span(this.currentValue);
      this.onChange(this.currentValue);
      this._moveCaretLast(this.target);
    }   
    this.showOption = false;
    this.target = null;
  }

  private _wrap_span(text){
    const split_text = text.split(' ');
    let _out = [];
    const count = split_text.length; 
    for(let i=0;i < count; i++){
      _out[i] = `<span id="tws-word-${i}">${split_text[i]}</span>`;
    }    
    return _out.join(' ');
  }

  private _moveCaretLast(el) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(el.childNodes[el.childNodes.length-1], 1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  }

  private _getCaretGlobalPosition(){
    const r = document.getSelection().getRangeAt(0)
    const node = r.startContainer
    const offset = r.startOffset
    const pageOffset = {x:window.pageXOffset, y:window.pageYOffset}
    let rect,  r2;

    if (offset > 0) {
        r2 = document.createRange()
        r2.setStart(node, (offset - 1))
        r2.setEnd(node, offset)
        rect = r2.getBoundingClientRect()
        return { left:rect.right + pageOffset.x, top:rect.bottom + pageOffset.y }
    }
  }

  onChange = (value: any) => {};
  
  onTouched = () => {};
  get value(): string {
    return this.currentValue;
  }

  writeValue(value: string): void {
    this.currentValue = value;
    this.currentValueHTML = this._wrap_span(this.currentValue); 
  }
  
  registerOnChange(value) {
    this.onChange = value;
  }
  
  registerOnTouched(value) {
    this.onTouched = value;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get CurrentValue(){
    return this.currentValue;
  }

}
