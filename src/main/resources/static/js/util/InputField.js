class InputField {

  //Current input being used
  static current = undefined

  //Input info
  enabled = false
  onKey = undefined
  element = undefined
  text = ''

  //Customizable info
  placeholder = 'Input'
  selectColor = 'green'
  max = Infinity
  min = 0
  onInput = undefined

  constructor(element, options) {
    //Save element
    this.element = element
    this.text = element.text

    //Add click event to text (to toggle input)
    Element.onClick(element, () => { this.toggle() })

    //Check options
    if (typeof options === 'object') {
      if (typeof options.placeholder === 'string') this.placeholder = options.placeholder
      if (typeof options.selectColor === 'string') this.selectColor = options.selectColor
      if (typeof options.max === 'number') this.max = options.max
      if (typeof options.min === 'number') this.min = options.min
      if (typeof options.onInput === 'function') this.onInput = options.onInput
    }

    //Update text
    this.updateText()
  }

  setText(text) {
    //Change text
    this.text = text
    this.updateText()

    //Call onInput
    if (typeof this.onInput === 'function') this.onInput(this.text)
  }

  updateText() {
    if (this.text.length <= 0) {
      //Placeholder
      this.element.alpha = 0.5
      this.element.text = this.placeholder
    } else {
      //Text
      this.element.alpha = 1
      this.element.text = this.text
    }
  }

  disable() {
    //Disable
    if (!this.enabled) return
    this.enabled = false

    //Deselect input
    InputField.current = undefined
    this.element.setBackgroundColor('transparent')
    
    //Remove listener
    window.removeEventListener('keydown', this.onKey)
  }

  enable() {
    //Enable
    if (this.enabled) return
    this.enabled = true

    //Another enabled -> Disable it
    if (InputField.current) InputField.current.disable()   

    //Select input (change background)
    InputField.current = this
    this.element.setBackgroundColor(this.selectColor)

    //Create & add listener
    this.onKey = (event) => {
      //Should call onInput
      let callOnInput = true

      //Check key
      switch (event.key.toLowerCase()) {
        //Special
        case 'f1':
        case 'f2':
        case 'f3':
        case 'f4':
        case 'f5':
        case 'f6':
        case 'f7':
        case 'f8':
        case 'f9':
        case 'f10':
        case 'f11':
        case 'f12':
        case 'contextmenu':
        case 'alt':
        case 'altgraph':
        case 'control':
        case 'shift':
          callOnInput = false
          break

        //Remove key
        case 'backspace':
          //Minimum length reached
          if (this.text.length <= this.min) break
          
          //No text
          if (this.text == "") break

          //Remove character
          this.text = this.text.slice(0, -1)
          this.updateText()
          break

        //Finish
        case 'enter':
        case 'tab':
          this.disable()
          break

        //Normal key
        default:
          //Maximum length reached
          if (this.text.length >= this.max) break

          //Add character
          this.text += event.key
          this.updateText()
          break
      }

      //Call onInput
      if (callOnInput && typeof this.onInput === 'function') this.onInput(this.text)
    }
    window.addEventListener('keydown', this.onKey)
  }

  toggle() {
    if (this.enabled)
      this.disable()
    else
      this.enable()
  }

  static reset() {
    if (InputField.current) InputField.current.disable()
  }
}