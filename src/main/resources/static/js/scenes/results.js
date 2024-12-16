class SceneResults extends Phaser.Scene {
  constructor() {
    super({ key: 'Results' });
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

    //Title
    const title = this.add.text(640, 120, 'Resultados', {
      fontFamily: 'college',
      fontSize: '60px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Get winner string
    const isTie = data.p1.points == data.p2.points
    let winner_s = 'Empate'
    
    //Not a tie
    if (!isTie) {
      winner_s = 'Ganador\n' + (data.p1.points > data.p2.points ? 'Jugador 1' : 'Jugador 2')
      
      //Add trophy
      const trophy = this.add.image(1280 / 2 + (data.p1.points > data.p2.points ? -420 : 420), 430, 'trophy')
      trophy.angle = (data.p1.points > data.p2.points ? -35 : 35)
    }
    
    //Winner
    const winner = this.add.text(640, 360, winner_s, {
      fontFamily: 'college',
      fontSize: '60px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    
    //Player 1
    const player1 = this.add.image(320, 360, 'preview' + data.p1.skin)
    player1.setScale(1, 1)
    const player1points = this.add.text(320, 500, data.p1.points, {
      fontFamily: 'college',
      fontSize: '60px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Player 2
    const player2 = this.add.image(960, 360, 'preview' + data.p2.skin)
    player2.setScale(-1, 1)
    const player2points = this.add.text(960, 500, data.p2.points, {
      fontFamily: 'college',
      fontSize: '60px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Back button
    const back = this.add.image(640, 600, 'button')
    const backText = this.add.text(640, 600 - 6, 'Volver', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(back, () => {
      back.setTexture('buttonHover')
    }, () => {
      back.setTexture('button')
    })
    Element.onClick(back, () => {
      Scene.changeScene(this, 'Main')
    })

    //Stop music on scene close
    Scene.onClose(this, () => {
      SceneGame.music.stop()
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
    
  }
}
