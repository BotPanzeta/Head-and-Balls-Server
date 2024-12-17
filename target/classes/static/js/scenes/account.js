class SceneAccount extends Phaser.Scene {
  constructor() {
    super({ key: 'Account' });
  }

  deleteButton
  register
  login
  logout

  usernameInput
  passwordInput

    /*$$$$$                                  /$$              
   /$$__  $$                                | $$              
  | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$    /$$$$$$ 
  | $$       /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
  | $$      | $$  \__/| $$$$$$$$  /$$$$$$$  | $$    | $$$$$$$$
  | $$    $$| $$      | $$_____/ /$$__  $$  | $$ /$$| $$_____/
  |  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
   \______/ |__/       \_______/ \_______/   \___/   \______*/

  create(mainScene) {
    //Add background
    const bg = this.add.image(1280 / 2, 720 / 2, 'window')
    Element.onClick(bg, () => {}) //Prevent clickthrough


    //Add title
    const title = this.add.text(640, 120, 'Server & Cuenta', {
      fontFamily: 'college',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)


    //IP input
    const IPInput = new InputField(this.add.text(640, 250, OnlineManager.IP, {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'IP:PUERTO',
      max: 20,
      onInput: (text) => {
        OnlineManager.setIP(text)
      }
    })


    //Username input
    this.usernameInput = new InputField(this.add.text(640, 300, '', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'Usuario',
      max: 15,
      onInput: (text) => {
        OnlineManager.Name = text
      }
    })


    //Password input 
    this.passwordInput = new InputField(this.add.text(640, 350, '', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'Contraseña',
      max: 15,
      onInput: (text) => {
        OnlineManager.Password = text
      }
    })
    

    //Register button
    this.register = new Button(this, 480, 450, 'Crear')
    Element.onClick(this.register.image, () => {
      OnlineManager.register(this.usernameInput.text, this.passwordInput.text, (isLogged) => {
        //Not logged in -> Return
        if (!isLogged) return

        //Disable input fields
        if (InputField.current) InputField.current.disable()
        
        //Stop scene
        //this.scene.stop()
        
        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkLogged()
      })
    })

    //Login button
    this.login = new Button(this, 800, 450, 'Login')
    Element.onClick(this.login.image, () => {
      OnlineManager.login(this.usernameInput.text, this.passwordInput.text, (isLogged) => {
        //Not logged in -> Return
        if (!isLogged) return

        //Disable input fields
        if (InputField.current) InputField.current.disable()
        
        //Stop scene
        //this.scene.stop()
        
        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkLogged()
      })
    })

    //Logout button
    this.logout = new Button(this, 800, 450, 'Logout')
    Element.onClick(this.logout.image, () => {
      OnlineManager.logout((isLogged) => {
        //Still logged in -> Return
        if (isLogged) return

        //Disable input fields
        if (InputField.current) InputField.current.disable()
        
        //Stop scene
        //this.scene.stop()
        
        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkLogged()
      })
    })


    //Add back button
    const back = new Button(this, 640, 600, 'Volver')
    Element.onClick(back.image, () => {
      //Disable input fields
      if (InputField.current) InputField.current.disable()
      
      //Stop scene
      this.scene.stop()

      //Check if logged in changed
      mainScene.checkLogged()
    })


    //Add delete account button
    this.deleteButton = new Button(this, 480, 450, 'Borrar')
    Element.onClick(this.deleteButton.image, () =>{ 
      OnlineManager.deleteAccount((isLogged)=>{
        //Still logged in -> Return
        if (isLogged) return

        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkLogged()
      })
    })

    this.toggleLogged()

  }

  toggleLogged(){
    //Already logged
    if(OnlineManager.isLogged) {
      //Move buttons
      this.deleteButton.Move(480, 450)
      this.logout.Move(800, 450)
      this.register.Move(-200, -200)
      this.login.Move(-200, -200)

      //Change text
      this.usernameInput.text = OnlineManager.Name
      this.usernameInput.updateText()
      this.passwordInput.text = OnlineManager.Password
      this.passwordInput.updateText()

    }else{  //Not logged yet
      this.deleteButton.Move(-200, -200)

      this.logout.Move(-200, -200)
     
      this.register.Move(480, 450)

      this.login.Move(800, 450)

      this.usernameInput.text = ''
      this.usernameInput.updateText()
      this.passwordInput.text = ''
      this.passwordInput.updateText()
    }
  }
  
}