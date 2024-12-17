 /*$$$$$$$ /$$                                               /$$
| $$_____/| $$                                              | $$
| $$      | $$  /$$$$$$  /$$$$$$/$$$$   /$$$$$$  /$$$$$$$  /$$$$$$   /$$$$$$$
| $$$$$   | $$ /$$__  $$| $$_  $$_  $$ /$$__  $$| $$__  $$|_  $$_/  /$$_____/
| $$__/   | $$| $$$$$$$$| $$ \ $$ \ $$| $$$$$$$$| $$  \ $$  | $$   |  $$$$$$
| $$      | $$| $$_____/| $$ | $$ | $$| $$_____/| $$  | $$  | $$ /$$\____  $$
| $$$$$$$$| $$|  $$$$$$$| $$ | $$ | $$|  $$$$$$$| $$  | $$  |  $$$$//$$$$$$$/
|________/|__/ \_______/|__/ |__/ |__/ \_______/|__/  |__/   \___/ |______*/

class Element {

  static updateOptions(elem, options) {
    //Priority
    if (typeof options.circle === 'number') elem.setCircle(options.circle)

    //Update scale
    if (typeof options.scaleX !== 'number') options.scaleX = elem.scaleX
    if (typeof options.scaleY !== 'number') options.scaleY = elem.scaleY
    elem.setScale(options.scaleX, options.scaleY)

    //Update label
    if (typeof options.label === 'string') elem.body.label = options.label

    //Update bools
    if (typeof options.isStatic === 'boolean') elem.setStatic(options.isStatic)
    if (typeof options.isSensor === 'boolean') elem.setSensor(options.isSensor)
    if (typeof options.ignoreGravity === 'boolean') elem.setIgnoreGravity(options.ignoreGravity)

    //Update numbers
    if (typeof options.mass === 'number') elem.setMass(options.mass)
    if (typeof options.bounce === 'number') elem.setBounce(options.bounce)
    if (typeof options.friction === 'number') elem.setFriction(options.friction)
    if (typeof options.frictionAir === 'number') elem.setFrictionAir(options.frictionAir)
    if (typeof options.frictionStatic === 'number') elem.setFrictionStatic(options.frictionStatic)
    if (typeof options.depth === 'number') elem.depth = options.depth

    //Update other
    if (options.fixedRotation) elem.setFixedRotation()
  }



   /*$$$$$                                 /$$
  |_  $$_/                                | $$
    | $$   /$$$$$$$   /$$$$$$  /$$   /$$ /$$$$$$
    | $$  | $$__  $$ /$$__  $$| $$  | $$|_  $$_/
    | $$  | $$  \ $$| $$  \ $$| $$  | $$  | $$
    | $$  | $$  | $$| $$  | $$| $$  | $$  | $$ /$$
   /$$$$$$| $$  | $$| $$$$$$$/|  $$$$$$/  |  $$$$/
  |______/|__/  |__/| $$____/  \______/    \___/
                    | $$
                    | $$
                    |_*/

  static onClick(element, callback) {
    element.setInteractive().on('pointerdown', callback);
  }

  static onHover(element, over, out) {
    if (typeof over === 'function') element.setInteractive().on('pointerover', over)
    if (typeof out === 'function') element.setInteractive().on('pointerout', out)
  }

  static onMove(element, callback) {
    element.setInteractive().on('pointermove', callback);
  }
  
  static onUp(element, callback) {
    element.setInteractive().on('pointerup', callback);
  }

  static onOut(element, callback){
    element.setInteractive().on('pointerout', callback);
  }
}



  /*$$$$$
 /$$__  $$
| $$  \__/  /$$$$$$$  /$$$$$$  /$$$$$$$   /$$$$$$
|  $$$$$$  /$$_____/ /$$__  $$| $$__  $$ /$$__  $$
 \____  $$| $$      | $$$$$$$$| $$  \ $$| $$$$$$$$
 /$$  \ $$| $$      | $$_____/| $$  | $$| $$_____/
|  $$$$$$/|  $$$$$$$|  $$$$$$$| $$  | $$|  $$$$$$$
 \______/  \_______/ \_______/|__/  |__/ \______*/

class Scene {
  //Helper class because I hate JS and doing 'this.' before everything is the goofyest thing ever

    /*$$$$$                                 /$$
   /$$__  $$                               | $$
  | $$  \ $$  /$$$$$$$ /$$$$$$$  /$$$$$$  /$$$$$$   /$$$$$$$
  | $$$$$$$$ /$$_____//$$_____/ /$$__  $$|_  $$_/  /$$_____/
  | $$__  $$|  $$$$$$|  $$$$$$ | $$$$$$$$  | $$   |  $$$$$$ 
  | $$  | $$ \____  $$\____  $$| $$_____/  | $$ /$$\____  $$
  | $$  | $$ /$$$$$$$//$$$$$$$/|  $$$$$$$  |  $$$$//$$$$$$$/
  |__/  |__/|_______/|_______/  \_______/   \___/ |______*/

  static loadAudios(scene, audios) {
    /*
    Scene.loadAudios(this, [
      ['select', 'Assets/select.mp3'],
      ['background', 'Assets/8bit-music.mp3']
    ])
    */

    //Not a valid array
    if (!Array.isArray(audios)) return

    //Loop audios
    audios.forEach(pair => {
      //Not a valid array
      if (!Array.isArray(pair)) return
      if (pair.length < 2) return

      //Not valid key
      const key = pair[0]
      if (typeof key !== 'string') return

      //Not valid path
      const path = pair[1]
      if (typeof path !== 'string') return

      //Load audio
      scene.load.audio(key, path)
    });
  }

  static loadImages(scene, images) {
    /*
    Scene.loadImages(this, [
      ['start_button', 'Assets/start-button.svg'],
      ['help_button', 'Assets/help-button.svg'],
      ['config_button', 'Assets/config-button.svg']
    ])
    */

    //Not a valid array
    if (!Array.isArray(images)) return

    //Loop images
    images.forEach(pair => {
      //Not a valid array
      if (!Array.isArray(pair)) return
      if (pair.length < 2) return

      //Not valid key
      const key = pair[0]
      if (typeof key !== 'string') return

      //Not valid path
      const path = pair[1]
      if (typeof path !== 'string') return

      //Load audio
      scene.load.image(key, path)
    });
  }



   /*$       /$$             /$$
  | $$      |__/            | $$
  | $$       /$$  /$$$$$$$ /$$$$$$    /$$$$$$  /$$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$
  | $$      | $$ /$$_____/|_  $$_/   /$$__  $$| $$__  $$ /$$__  $$ /$$__  $$ /$$_____/
  | $$      | $$|  $$$$$$   | $$    | $$$$$$$$| $$  \ $$| $$$$$$$$| $$  \__/|  $$$$$$
  | $$      | $$ \____  $$  | $$ /$$| $$_____/| $$  | $$| $$_____/| $$       \____  $$
  | $$$$$$$$| $$ /$$$$$$$/  |  $$$$/|  $$$$$$$| $$  | $$|  $$$$$$$| $$       /$$$$$$$/
  |________/|__/|_______/    \___/   \_______/|__/  |__/ \_______/|__/      |______*/

  static on(scene, name, callback) {
    scene.events.on(name, callback); 
  }

  static once(scene, name, callback) {
    scene.events.once(name, callback); 
  }

  static onClose(scene, callback) {
    this.once(scene, 'shutdown', callback)
  }

  static onDestroy(scene, callback) {
    this.once(scene, 'destroy', callback)
  }
  
   /*$$$$$                                 /$$
  |_  $$_/                                | $$
    | $$   /$$$$$$$   /$$$$$$  /$$   /$$ /$$$$$$
    | $$  | $$__  $$ /$$__  $$| $$  | $$|_  $$_/
    | $$  | $$  \ $$| $$  \ $$| $$  | $$  | $$
    | $$  | $$  | $$| $$  | $$| $$  | $$  | $$ /$$
   /$$$$$$| $$  | $$| $$$$$$$/|  $$$$$$/  |  $$$$/
  |______/|__/  |__/| $$____/  \______/    \___/
                    | $$
                    | $$
                    |_*/

  static input(scene, name, down, up) {
    scene.input.keyboard.on('keydown-' + name, (event) => {
      if (event.repeat) return
      down()
    });

    if (typeof up !== 'function') return
    scene.input.keyboard.on('keyup-' + name, (event) => {
      if (event.repeat) return
      up()
    });
  }

  static onClick(scene, callback) {
    scene.input.on('pointerdown', callback)
  }



    /*$$$$$    /$$     /$$                          
   /$$__  $$  | $$    | $$                          
  | $$  \ $$ /$$$$$$  | $$$$$$$   /$$$$$$   /$$$$$$ 
  | $$  | $$|_  $$_/  | $$__  $$ /$$__  $$ /$$__  $$
  | $$  | $$  | $$    | $$  \ $$| $$$$$$$$| $$  \__/
  | $$  | $$  | $$ /$$| $$  | $$| $$_____/| $$
  |  $$$$$$/  |  $$$$/| $$  | $$|  $$$$$$$| $$
   \______/    \___/  |__/  |__/ \_______/|_*/

  static changeScene(scene, name, data) {
    if (data == undefined)
      scene.scene.launch(name)
    else
      scene.scene.launch(name, data)
    scene.scene.stop(scene.scene.key)
  }

  static imageWithPhysics(scene, image, options) {
    //Fix arguments
    if (typeof image !== 'string') image = ''
    if (typeof options !== 'object') options = {}
    if (typeof options.x !== 'number') options.x = 0
    if (typeof options.y !== 'number') options.y = 0

    //Create element
    const elem = scene.matter.add.image(options.x, options.y, image)

    //Update options
    Element.updateOptions(elem, options)

    //Return element
    return elem
  }
}



 /*$   /$$   /$$     /$$ /$$
| $$  | $$  | $$    |__/| $$
| $$  | $$ /$$$$$$   /$$| $$
| $$  | $$|_  $$_/  | $$| $$
| $$  | $$  | $$    | $$| $$
| $$  | $$  | $$ /$$| $$| $$
|  $$$$$$/  |  $$$$/| $$| $$
 \______/    \___/  |__/|_*/

class Util {
  static cliff(x) {
    return 1 - Math.pow(2 * (x - 0.5), 2)
  }

  static clamp(x, min, max) {
    return Math.min(Math.max(x, min), max)
  }

  static rand(min, max) {
    //Both inclusive
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}



 /*$    /$$                      /$$
| $$   | $$                     | $$
| $$   | $$ /$$$$$$   /$$$$$$$ /$$$$$$    /$$$$$$   /$$$$$$
|  $$ / $$//$$__  $$ /$$_____/|_  $$_/   /$$__  $$ /$$__  $$
 \  $$ $$/| $$$$$$$$| $$        | $$    | $$  \ $$| $$  \__/
  \  $$$/ | $$_____/| $$        | $$ /$$| $$  | $$| $$
   \  $/  |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$/| $$
    \_/    \_______/ \_______/   \___/   \______/ |_*/

class Vec2 {
  x = 0
  y = 0

  constructor(x, y) {
    if (typeof x == 'object') {
      //From a Vec2
      if (typeof x.x == 'number') this.x = x.x
      if (typeof x.y == 'number') this.y = x.y
    } else {
      //From x & y
      if (typeof x == 'number') this.x = x
      if (typeof y == 'number') this.y = y
    }
  }

  equals(v) { 
    return (this.x == v.x && this.y == v.y)
  }

  add(v) { 
    return new Vec2(this.x + v.x, this.y + v.y) 
  }

  subtract(v) { 
    return new Vec2(this.x - v.x, this.y - v.y) 
  }

  multiply(n) { 
    return new Vec2(this.x * n, this.y * n) 
  }

  divide(n) { 
    return new Vec2(this.x / n, this.y / n) 
  }

  magnitude() { 
    return Math.sqrt(this.x * this.x + this.y * this.y) 
  }

  normalized() { 
    return this.divide(this.magnitude()) 
  }

  moveTowards(towards, delta) {
    let dir = towards.subtract(this)
    if (dir.magnitude() > delta) 
      return this.add(dir.normalized().multiply(delta))
    else 
      return towards
  }
}