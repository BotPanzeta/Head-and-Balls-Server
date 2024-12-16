class SceneModes extends Phaser.Scene {
  constructor() {
    super({ key: 'Modes' });
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
    const title = this.add.text(640, 120, 'Modos', {
      fontFamily: 'college',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Add online button
    const online = this.add.image(420, 360, 'button')
    const onlineText = this.add.text(420, 360 - 6, 'Online', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(online, () => {
      online.setTexture('buttonHover')
    }, () => {
      online.setTexture('button')
    })
    Element.onClick(online, () => {
      this.scene.stop()
      this.scene.launch('Account', this)
    })

    //Add local button
    const local = this.add.image(860, 360, 'button')
    const localText = this.add.text(860, 360 - 6, 'Local', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(local, () => {
      local.setTexture('buttonHover')
    }, () => {
      local.setTexture('button')
    })
    Element.onClick(local, () => {
      this.scene.stop()
      Scene.changeScene(mainScene, 'Characters')
    })

    //Add resume button
    const resume = this.add.image(640, 600, 'button')
    const resumeText = this.add.text(640, 600 - 6, 'Volver', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(resume, () => {
      resume.setTexture('buttonHover')
    }, () => {
      resume.setTexture('button')
    })
    Element.onClick(resume, () => {
      this.scene.stop()
    })
  }
}