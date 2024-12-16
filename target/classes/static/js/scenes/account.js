class SceneAccount extends Phaser.Scene {
  constructor() {
    super({ key: 'Account' });
  }



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
    const usernameInput = new InputField(this.add.text(640, 300, '', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'Usuario',
      max: 15
    })


    //Password input 
    const passwordInput = new InputField(this.add.text(640, 350, '', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'Contraseña',
      max: 15
    })
    

    //Register & login buttons
    const register = new Button(this, 480, 450, 'Crear')
    Element.onClick(register.image, () => {
      OnlineManager.register(usernameInput.text, passwordInput.text, (isLogged) => {
        //Not logged in -> Return
        if (!isLogged) return

        //Disable input fields
        if (InputField.current) InputField.current.disable()
        
        //Stop scene
        this.scene.stop()
        
        //Check if logged in changed
        mainScene.checkLogged()
      })
    })

    const login = new Button(this, 800, 450, 'Login')
    Element.onClick(login.image, () => {
      OnlineManager.login(usernameInput.text, passwordInput.text, (isLogged) => {
        //Not logged in -> Return
        if (!isLogged) return

        //Disable input fields
        if (InputField.current) InputField.current.disable()
        
        //Stop scene
        this.scene.stop()
        
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
    const deleteButton = new Button(this,195 , 600, 'Borrar')
    Element.onClick(deleteButton.image, () =>{ 
      // borrar cuenta aqui
    })

  }
}