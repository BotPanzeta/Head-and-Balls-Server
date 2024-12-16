class SceneMain extends Phaser.Scene {

  static music

  constructor() {
    super({ key: 'Main' });
  }



   /*$$$$$$                     /$$                           /$$
  | $$__  $$                   | $$                          | $$
  | $$  \ $$ /$$$$$$   /$$$$$$ | $$  /$$$$$$   /$$$$$$   /$$$$$$$
  | $$$$$$$//$$__  $$ /$$__  $$| $$ /$$__  $$ |____  $$ /$$__  $$
  | $$____/| $$  \__/| $$$$$$$$| $$| $$  \ $$  /$$$$$$$| $$  | $$
  | $$     | $$      | $$_____/| $$| $$  | $$ /$$__  $$| $$  | $$
  | $$     | $$      |  $$$$$$$| $$|  $$$$$$/|  $$$$$$$|  $$$$$$$
  |__/     |__/       \_______/|__/ \______/  \_______/ \______*/

  preload() {
    //Load audio
    Scene.loadAudios(this, [
      //Music
      ['music_menu', 'assets/main/music_menu.mp3'],
      ['music_game','assets/game/music_game.mp3'],
      //Voices
      ['voice1.0', 'assets/game/voices/1.0.mp3'],
      ['voice1.1', 'assets/game/voices/1.1.mp3'],
      ['voice2.0', 'assets/game/voices/2.0.mp3'],
      ['voice2.1', 'assets/game/voices/2.1.mp3'],
      ['voice3.0', 'assets/game/voices/3.0.mp3'],
      ['voice3.1', 'assets/game/voices/3.1.mp3'],
      ['voice4.0', 'assets/game/voices/4.0.mp3'],
      ['voice4.1', 'assets/game/voices/4.1.mp3'],
      //SFX
      ['piii', 'assets/game/sfx/piii.mp3'],
      ['kick', 'assets/game/sfx/kick.mp3'],
    ])

    //Load images
    Scene.loadImages(this, [
      //Main menu
      ['bg_menu', 'assets/main/bg_menu.png'],
      ['title', 'assets/main/title.png'],
      ['button', 'assets/main/button.png'],
      ['buttonHover', 'assets/main/buttonHover.png'],
      ['window', 'assets/main/window.png'],
      ['userOn', 'assets/main/userOn.png'],
      ['userOff', 'assets/main/userOff.png'],
      //Options
      ['slider', 'assets/main/slider.png'],
      ['controls1', 'assets/main/controls1.png'],
      ['controls2', 'assets/main/controls2.png'],
      //Characters
      ['arrow_next', 'assets/characters/arrow_next.png'],
      ['preview1', 'assets/characters/p1.png'],
      ['preview2', 'assets/characters/p2.png'],
      ['preview3', 'assets/characters/p3.png'],
      ['preview4', 'assets/characters/p4.png'],
      ['skin1', 'assets/characters/s1.png'],
      ['skin2', 'assets/characters/s2.png'],
      ['skin3', 'assets/characters/s3.png'],
      ['skin4', 'assets/characters/s4.png'],
      //Game (map)
      ['bg_game', 'assets/game/bg_game.png'],
      ['campo', 'assets/game/campo.png'],
      ['goal', 'assets/game/goal.png'],
      ['ball', 'assets/game/ball.png'],
      ['foot', 'assets/game/zapato.png'],
      //Game (powers)
      ['powerBigBall', 'assets/game/powerBigBall.png'],
      ['powerBouncyBall', 'assets/game/powerBouncyBall.png'],
      ['powerIce', 'assets/game/powerIce.png'],
      ['powerIceBad', 'assets/game/powerIceBad.png'],
      ['powerSmallBall', 'assets/game/powerSmallBall.png'],
      //Game (UI)
      ['marcador', 'assets/game/marcador.png'],
      ['setting_button', 'assets/game/settings_button.png'],
      ['back_button', 'assets/game/back_button.png'],
      //Results
      ['trophy', 'assets/game/trophy.png'],
    ])
  }



    /*$$$$$                                  /$$              
   /$$__  $$                                | $$              
  | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$    /$$$$$$ 
  | $$       /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
  | $$      | $$  \__/| $$$$$$$$  /$$$$$$$  | $$    | $$$$$$$$
  | $$    $$| $$      | $$_____/ /$$__  $$  | $$ /$$| $$_____/
  |  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
   \______/ |__/       \_______/ \_______/   \___/   \______*/
  
  create(data) {
    //Update settings
    try {
      const temp = parseFloat(localStorage.getItem('volume'))
      if (temp != NaN) Settings.volume = temp
      this.sound.setVolume(Settings.volume)
    } catch(e) {
      Settings.volume = 1
      this.sound.setVolume(Settings.volume)
    }

    //Init online manager
    OnlineManager.init()

    
    //Add background music
    SceneMain.music = this.sound.add('music_menu')
    SceneMain.music.loop = true
    SceneMain.music.play()


    //Add background
    const bg = this.add.image(1280 / 2, 720 / 2, 'bg_menu')

    //Add title
    const title = this.add.image(640, 150, 'title')


    //Play, options & credits buttons
    const play = new Button(this, 640, 400, 'Jugar')
    Element.onClick(play.image, () => {
      this.scene.launch('Modes', this)
    })
    
    const options = new Button(this, 640, 500, 'Opciones')
    Element.onClick(options.image, () => {
      this.scene.launch('Options', 'Main')
    })

    const credits = new Button(this, 640, 600, 'Créditos')
    Element.onClick(credits.image, () => {
      this.scene.launch('Credits')
    })
    

    //Account button
    this.account = this.add.image(1180, 600, 'userOff')
    Element.onClick(this.account, () => {
      this.scene.launch('Account', this)
    })
    this.checkLogged()
  }

  checkLogged() {
    OnlineManager.checkLogged((isLogged) => {
      this.account.setTexture(isLogged ? 'userOn' : 'userOff')
    })
  }
}
