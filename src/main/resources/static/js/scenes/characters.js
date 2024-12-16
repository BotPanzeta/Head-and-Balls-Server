class SceneCharacters extends Phaser.Scene {
  constructor() {
    super({ key: 'Characters' });
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
    //Add background
    const bg = this.add.image(1280 / 2, 720 / 2, 'bg_menu')
    const bgw = this.add.image(1280 / 2, 720 / 2, 'window')

    //Add title
    const title = this.add.text(640, 120, 'Elije tu personaje', {  //120
      fontFamily: 'college',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Data to pass to game
    this.data = {
      p1: {
        number: 1,
        skin: Util.rand(1, 4),
        ready: false
      },
      p2: {
        number: 2,
        skin: Util.rand(1, 4),
        ready: false
      }
    }
    
    //Player 1
    this.createCharacterSelectScreen(this.data.p1)
    
    //Player 2
    this.createCharacterSelectScreen(this.data.p2)

    //Stop music on scene close
    Scene.onClose(this, () => {
      SceneMain.music.stop()
    })
  }

  createCharacterSelectScreen(key) {
    //Displacement
    const disp = 640 * (key.number - 1)
    const scale = key.number == 1 ? 1 : -1

    //Create player skin indicator
    const player = this.add.image(disp + 320, 360, 'preview' + key.skin)
    player.setScale(scale, 1)

    //Create skin swap buttons
    const prev = this.add.image(disp + 320 - 150, 360, 'arrow_next')
    prev.setScale(-0.1, 0.1)
    Element.onClick(prev, () => {
      key.skin--
      if (key.skin < 1) key.skin = 4
      player.setTexture('preview' + key.skin)
    })

    const next = this.add.image(disp + 320 + 150, 360, 'arrow_next')
    next.setScale(0.1, 0.1)
    Element.onClick(next, () => {
      key.skin++
      if (key.skin > 4) key.skin = 1
      player.setTexture('preview' + key.skin)
    })

    //Add ready button
    const ready = this.add.image(disp + 320, 600, 'button')
    const readyText = this.add.text(disp + 320, 600 - 6, 'No listo', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(ready, () => {
      ready.setTexture('buttonHover')
    }, () => {
      ready.setTexture('button')
    })
    Element.onClick(ready, () => {
      key.ready = !key.ready
      readyText.setText(key.ready ? 'Listo' : 'No listo');
    })
  }
  


   /*$   /$$                 /$$             /$$
  | $$  | $$                | $$            | $$
  | $$  | $$  /$$$$$$   /$$$$$$$  /$$$$$$  /$$$$$$    /$$$$$$ 
  | $$  | $$ /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
  | $$  | $$| $$  \ $$| $$  | $$  /$$$$$$$  | $$    | $$$$$$$$
  | $$  | $$| $$  | $$| $$  | $$ /$$__  $$  | $$ /$$| $$_____/
  |  $$$$$$/| $$$$$$$/|  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
   \______/ | $$____/  \_______/ \_______/   \___/   \_______/
            | $$
            | $$
            |_*/
  
  update(time, delta) {
    //Both ready
    if (this.data.p1.ready && this.data.p2.ready) Scene.changeScene(this, 'Game', this.data)
  }
}