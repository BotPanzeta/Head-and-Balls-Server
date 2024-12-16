class SceneOptions extends Phaser.Scene {
  constructor() {
    super({ key: 'Options' });
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
    const bg = this.add.image(1280 / 2, 720 / 2, 'window')
    Element.onClick(bg, () => {}) //Prevent clickthrough


    //Add title
    const title = this.add.text(640, 120, 'Opciones', {
      fontFamily: 'college',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)


    //Add volome slider
    const sliderBG = this.add.image(1280 / 2, 260, 'slider')//this.add.rectangle(1280 / 2, 300, 400, 20, 0xffffff)
    this.slider = new Slider(this, 'ball', new Vec2(640 - 400 / 2, 260), new Vec2(640 + 400 / 2, 260), Settings.volume)
    this.volumeText = this.add.text(1280 / 2, 210, Math.floor(Settings.volume * 100), {
      fontFamily: 'college',
      fontSize: '34px',
      align: 'center'
    }).setOrigin(0.5)


    //Add controls
    const controls1 = this.add.image(1280 / 2 - 200, 440, 'controls1')
    const controls2 = this.add.image(1280 / 2 + 200, 440, 'controls2')


    //Add back button
    const back = new Button(this, 640, 600, 'Volver')
    Element.onClick(back.image, () => {
      this.scene.stop()
      this.scene.resume(data)
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
    Settings.volume = this.slider.Value();
    this.volumeText.text = 'Volumen (' + Math.floor(Settings.volume * 100) + '%)'
    this.sound.setVolume(Settings.volume)
  }
}



//Slider
class Slider {

  scene
  position = new Vec2()

  startPoint = new Vec2()

  endPoint = new Vec2()

  value = 0

  image

  down = false;

  constructor(scene, img, startPoint, endPoint, value) {
    this.scene = scene
    this.startPoint = new Vec2(startPoint)
    this.endPoint = new Vec2(endPoint)
    this.value = value
    this.position = this.Interpolate(startPoint, endPoint, value)

    this.image = this.scene.add.image(this.position.x, this.position.y, img)

    this.image.setPosition(this.position.x, this.position.y);

    Element.onClick(this.image, (event) => {
      this.down = true;
    })

    Element.onUp(this.image, () => {
      this.down = false;
    })

    Element.onOut(this.image, () => {
      this.down = false;
      localStorage.setItem('volume', this.value)
    })

    Element.onMove(this.image, (event) => {
      this.Update(event)
    })
  }

  Update(event) {
    if (this.down) {
      this.position.x = event.position.x;
      this.position.y = this.image.y;
      if (this.position.x < this.startPoint.x) this.position.x = this.startPoint.x
      if (this.position.x > this.endPoint.x) this.position.x = this.endPoint.x
      this.value = this.position.subtract(this.startPoint).magnitude() / this.endPoint.subtract(this.startPoint).magnitude()
      this.image.setPosition(this.position.x, this.position.y);
    }
  }

  Interpolate(p1, p2, value) {
    var dir = p2.subtract(p1).normalized()
    return p1.add(dir.multiply(value * p1.subtract(p2).magnitude()))
  }

  Value() {
    return this.value;
  }
}

class Settings {
  static volume = 1
}