import { Component, OnInit, Input, ElementRef, forwardRef, HostBinding, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
interface settingObj{
  machingStartChars : '@',
  machingEndChars : '',
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
export class TextareaWithSuggestionsComponent implements OnInit,ControlValueAccessor,OnChanges  {

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
    /* this.currentValue = this.setting.default;
    this.currentValueHTML = this._wrapSpan(this.currentValue); */ 
  }

  ngOnChanges(){
    this.currentValue = this.setting.default;
    this.currentValueHTML = this._wrapSpan(this.currentValue);
  }

  contentUpdated(event){
    this.target = event.target;
    this.currentValue = this.target.innerText;
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
        this.target.innerHTML = this._wrapSpan(this.currentValue);
        this._moveCaretLast(this.target);
      }
    } else if(lastChar == this.setting.machingStartChars){
      this.options = this.setting.options;
      this.showOption = true;
      this.optionStyle = this._getCaretGlobalPosition();
    }
    
  }

  optionSelected(option){
    if(option && this.target){
      this.currentValue += `${option}${this.setting.machingEndChars}`;
      this.target.innerHTML = this._wrapSpan(this.currentValue);
      this.onChange(this.currentValue);
      this._moveCaretLast(this.target);
    }   
    this.showOption = false;
    this.target = null;
  }

  private _wrapSpan(text: string = ''){
    let htmlString = '';
    if(text){
      htmlString = '<div>';
      const newLineSplit = text.split('\n');
      let wordCtr = 1;
      if(newLineSplit.length && Array.isArray(newLineSplit)){
        newLineSplit.forEach(lines => {
          const wordSplit = lines.split(/\u00a0/);
          if(wordSplit.length && Array.isArray(wordSplit)){
            if(htmlString != '<div>'){
              htmlString += '</div><div>';
            } 
            /* text.split(/\u00a0/).forEach(word =>{
              if(word != ''){
                let cssClass = this._getWordClass(word);
                htmlString += ` <span id="tws-word-${wordCtr++}" class="${cssClass}">${(word)}</span>`;
              }              
            });  */
            htmlString += this._wordSplit(lines);
            //htmlString += `<span id="tws-word-${wordCtr++}"> </span>`;
          }
        }); 
      }
      htmlString += '</div>';
      
    }
    htmlString += `<span id="tws-word-"></span>`;
    return htmlString; 
    
  }

  private _wordSplit(text){
    const splitText = text.split(/\u00a0 | /)
    let _out = [];
    const count = splitText.length; 
    let i=0;
    for(i=0;i < count; i++){      
      let cssClass = this._getWordClass(splitText[i]); 
      _out[i] = `<span class="${cssClass}">${splitText[i]}</span>`;      
    }  
    let result = _out.join(' ');
    return result; 
  }

   private _getWordClass(str: string = ''){   
    if(str.substr(0, this.setting.machingStartChars.length) === this.setting.machingStartChars){
      return 'highlight';
    }
    return '';
   }               

  private _moveCaretLast(el) {
    console.log(el, this.target);
    const range = document.createRange();
    const sel = window.getSelection();
    let node = range.endContainer;
    let offset = 0;
    let childNodes = this.target.childNodes;
    node = childNodes[childNodes.length -1];
    range.setStart(node, offset);
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
    //this.currentValue = value;
    //this.currentValueHTML = this._wrapSpan(this.currentValue);
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
