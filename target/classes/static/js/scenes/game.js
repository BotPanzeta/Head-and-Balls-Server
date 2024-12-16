class SceneGame extends Phaser.Scene {

  static music

  constructor() {
    super({ key: 'Game' });
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
    const bg = this.add.image(1280 / 2, 720 / 2, 'bg_game')
    bg.depth = -10

    //Save game state
    this.data = {
      //State
      isPlaying: true,
      isFinished: false,
      //Players
      p1: data.p1,
      p2: data.p2,
      //Timestamp when the game started
      timeStart: new Date().getTime(),
      //Timestamp when the game will end (after 3 minutes)
      timeEnd: new Date().getTime() + 1 * 60 * 1000,  //1 minute
      //timeEnd: new Date().getTime() + 6 * 1000,  //6 seconds for testing
    }

    //Add background music
    SceneGame.music = this.sound.add('music_game')
    SceneGame.music.loop = true
    SceneGame.music.play()

    //Play piii
    this.sound.add('piii').play()

    //Add pause button
    const pause_button = this.add.image(1280-60, 55, 'setting_button')
    Element.onClick(pause_button, ()=>{
      //Stop power spawn timer
      clearTimeout(this.powerTimer)

      ///Open options
      this.scene.pause()
      this.scene.launch('Options', 'Game')
    })


    //Add back button
    const back_button = this.add.image(60, 55, 'back_button')
    Element.onClick(back_button, ()=> {
      SceneGame.music.stop()
      this.scene.stop()
      this.scene.start('Main')
    })


    //Add floor
    this.floor = this.matter.add.rectangle(
      //Position
      640, 
      690, 
      1280, 
      60, 
      { 
        label: 'floor',
        isStatic: true 
      }
    )

    this.floorImage = Scene.imageWithPhysics(this, 'campo', {
      //Position
      x: 640,
      y: 660,
      //Options
      ignoreGravity: true,
      isSensor: true,
      isStatic: true,
      depth: -10,
    })
    


    //Add ball
    this.ball = new Ball(this)



    //Powers
    this.spawnPower()



    //Map
    this.mapVariant = this.add.rectangle(0, 0, 200, 40, 0x3e383d)
    this.matter.add.gameObject(this.mapVariant)
    this.mapVariant.setStatic(true)



    //Counter (time & points)
    this.counter = Scene.imageWithPhysics(this, 'marcador', {
      //Position
      x: 640,
      y: 75,
      //Options
      ignoreGravity: true,
      isSensor: true,
      isStatic: true,
      depth: -10,
    })
    
    this.timer = this.add.text(640, 93, '00:00', {
      fontFamily: 'digital',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)



    //Create player 1
    this.player1 = new Player(this, data.p1)

    //Create player 2
    this.player2 = new Player(this, data.p2)



    //Reset game
    this.reset()
  }

  reset() {
    //Start playing
    this.data.isPlaying = true

    //Reset ball
    this.ball.reset()

    //Reset players
    this.player1.reset()
    this.player2.reset()

    //Move & rotate map variant
    this.mapVariant.x = 640 + Util.rand(-450, 450)
    this.mapVariant.y = 250 + Util.rand(-50, 50)
    this.mapVariant.setRotation(Util.rand(-30, 30) * Math.PI / 180)
  }

  onGoal(number) {
    //Not playing
    if (!this.data.isPlaying) return

    //Stop playing
    this.data.isPlaying = false
    
    //Play piii
    this.sound.add('piii').play()

    //Add points
    switch (number) {
      case 1:
        //Scored in player 1's goal
        this.player2.addPoint()
        break
      case 2:
        //Scored in player 2's goal
        this.player1.addPoint()
        break
    }
    
    //Wait and reset
    setTimeout(() => {
      this.reset()
    }, 2000)
  }

  spawnPower() {
    this.powerTimer = setTimeout(() => {
      this.power = new Power(this)
    }, PowerInfo.DELAY)
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
    //Update players
    this.player1.update(delta)
    this.player2.update(delta)

    //Still in game
    if (this.data.isFinished) return

    //Update timer
    this.updateTimer()

    //Game finished
    if (new Date().getTime() >= this.data.timeEnd) {
      //Stop playing
      this.data.isFinished = true
      this.data.isPlaying = false
    
      //Play piii
      this.sound.add('piii').play()

      //Wait to show results scene
      setTimeout(() => {
        //Stop power spawn timer
        clearTimeout(this.powerTimer)

        ///Go to results
        Scene.changeScene(this, 'Results', {
          p1: {
            skin: this.data.p1.skin,
            points: this.player1.points
          },
          p2: {
            skin: this.data.p2.skin,
            points: this.player2.points
          }
        })
      }, 3000)
    }
  }

  updateTimer() {
    const current = new Date(new Date().getTime() - this.data.timeStart)
    let seconds = current.getSeconds()
    if (seconds < 10) seconds = '0' + seconds
    this.timer.setText('0' + current.getMinutes() + ':' + seconds)
  }
}



//Ball
class Ball {

  last = 1
  
  constructor(scene) {
    //Save scene
    this.scene = scene

    //Create ball sprite
    this.ball = Scene.imageWithPhysics(this.scene, 'ball', {
      //Position
      x: 640,
      y: 200,
      //Options
      label: 'ball',
      circle: 25,
      bounce: 0.6,
      friction: 0.05,
      frictionAir: 0,
      frictionStatic: 0,
      depth: -7
    })

    //Create sfx
    this.sfx = this.scene.sound.add('kick')

    //Reset ball
    this.reset()
  }

  //Movement
  kick(direction, player) {
    this.ball.setVelocity(direction.x, direction.y)
    this.last = player
    this.sfx.play()
  }

  //State
  reset() {
    //Reset position & velocity
    this.ball.setPosition(640, 360)
    this.ball.setVelocity(0, 0)
    this.ball.setAngularVelocity(0)
  }
}



//Player
class Player {
  //Player data
  scene
  data = {}
  
  //Points
  points = 0

  //Movement
  isGrounded = true
  isMovingRight = false
  isMovingLeft = false
  moveSpeed = 6
  jumpSpeed = 12

  //Kick
  isKicking = false
  kickProgress = 0
  kickSpeed = 20
  footOffset = new Vec2()

  //Other
  isStunned = false
  
  constructor(scene, data) {
    //Save data
    this.scene = scene
    this.data = data

    //Update data
    this.data.index = data.number - 1
    this.data.scale = data.number == 1 ? 1 : -1

    //Create goal
    this._initGoal()

    //Create player
    this._initPlayer()

    //Add input
    this._initInput()

    //Create points & player name text
    this.pointsText = scene.add.text(640 - data.scale * 100, 82, '0', {
      fontFamily: 'digital',
      fontSize: '64px',
      fill: '#fff',
    }).setOrigin(0.5)

    this.playerText = scene.add.text(640 - data.scale * 100, 26, 'Jugador ' + this.data.number, {
      fontFamily: 'digital',
      fontSize: '18px',
      fill: '#fff',
    }).setOrigin(0.5)
  }

  //Init
  _initGoal() {
    //Create goal
    this.goalTrigger = Scene.imageWithPhysics(this.scene, 'goal', {
      //Position
      x: this.data.index * this.scene.sys.game.canvas.width + (this.data.scale * 75),
      y: 540,
      //Scale
      scaleX: this.data.scale,
      scaleY: 1,
      //Options
      label: 'goal' + this.data.number,
      isStatic: true,
      isSensor: true,
      ignoreGravity: true,
      depth: -1
    })

    //Add goal interaction
    this.goalTrigger.setOnCollide(pair => {
      //Not touching the ball
      if (pair.bodyA.label != 'ball' && pair.bodyB.label != 'ball') return

      //Headbutt the ball
      this.scene.onGoal(this.data.number)
    })

    //Add goal ceiling (to prevent ball from entering from the top)
    this.scene.matter.add.rectangle(
      this.goalTrigger.x + (10 * this.data.scale), 
      this.goalTrigger.y - this.goalTrigger.height / 2 - 10, 
      this.goalTrigger.width + 20, 
      20, 
      { 
        label: 'goalCeiling' + this.data.number,
        isStatic: true 
      }
    )

    this.scene.matter.add.trapezoid(
      0 + 1280 * this.data.index, 
      this.goalTrigger.y - this.goalTrigger.height / 2 - 33, 
      this.goalTrigger.width * 2 + 40, 
      40,
      1,
      { 
        label: 'goalCeiling' + this.data.number,
        isStatic: true 
      }
    )

    //Add goal back (to prevent ball from touching the wall)
    this.scene.matter.add.trapezoid(
      0 + 1280 * this.data.index, 
      this.goalTrigger.y - 40, 
      this.goalTrigger.width * 0.6, 
      -this.goalTrigger.height,
      1,
      { 
        label: 'goalWall' + this.data.number,
        isStatic: true 
      }
    )
  }

  _initPlayer() {
    //Create player
    this.player = Scene.imageWithPhysics(this.scene, 'skin' + this.data.skin, {
      //Position
      x: 0,
      y: 0,
      //Scale
      scaleX: this.data.scale,
      scaleY: 1,
      //Options
      label: 'player' + this.data.number,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      fixedRotation: true,
      depth: -3
    })

    //Add headbutt interaction
    this.player.setOnCollide(pair => {
      //Not jumping
      if (this.isGrounded) return

      //Not touching the ball
      if (pair.bodyA.label != 'ball' && pair.bodyB.label != 'ball') return

      //Headbutt the ball
      const posPlayer = new Vec2(this.player.x, this.player.y)
      const posBall = new Vec2(this.scene.ball.ball)
      const direction = posBall.subtract(posPlayer).normalized().multiply(this.kickSpeed)
      this.scene.ball.kick(direction, this.data.number)
    })

    //Create foot
    this.foot = Scene.imageWithPhysics(this.scene, 'foot', {
      //Position
      x: 0,
      y: 0,
      //Scale
      scaleX: this.data.scale,
      scaleY: 1,
      //Options
      label: 'foot' + this.data.number,
      isSensor: true,
      ignoreGravity: true,
      depth: -4
    })

    //Add kick ball interaction
    this.foot.setOnCollideActive(pair => {
      //Not kicking
      if (!this.isKicking) return

      //Not touching the ball
      if (pair.bodyA.label != 'ball' && pair.bodyB.label != 'ball') return

      //Kick the ball
      const direction = new Vec2(pair.collision.normal).multiply(this.kickSpeed)
      this.scene.ball.kick(direction, this.data.number)
    })

    //Reset player position & velocity
    this.reset()
  }

  _initInput() {
    //Move left
    Scene.input(this.scene, this.data.number == 1 ? 'A' : 'LEFT', () => {
      //Button down
      this.isMovingLeft = true
    }, () => {
      //Button up
      this.isMovingLeft = false
    })

    //Move right
    Scene.input(this.scene, this.data.number == 1 ? 'D' : 'RIGHT', () => {
      //Button down
      this.isMovingRight = true
    }, () => {
      //Button up
      this.isMovingRight = false
    })

    //Jump
    Scene.input(this.scene, this.data.number == 1 ? 'W' : 'UP', () => {
      //Button down
      if (!this.isStunned && this.isGrounded) this.player.setVelocityY(-this.jumpSpeed)
    })

    //Kick
    Scene.input(this.scene, this.data.number == 1 ? 'S' : 'DOWN', () => {
      //Button down
      if (!this.isStunned && !this.isKicking) {
        this.isKicking = true
        this.kickProgress = 0
      }
    })
  }

  //State
  stun(duration) {
    //Fix arg
    if (typeof duration !== 'number') duration = 3000

    //Stop & stun
    this.player.setVelocityX(0)
    this.isStunned = true

    //Wait for stun to end
    setTimeout(() => {
      this.isStunned = false
    }, duration)
  }

  reset() {
    //Reset position & velocity
    this.player.setPosition(640 + (this.data.number == 1 ? -360 : 360), 600 + this.data.number)
    this.player.setVelocity(0, 0)
  }

  update(delta) {
    //Update current velocity based on input
    let inputX = 0
    if (this.isMovingLeft) inputX--
    if (this.isMovingRight) inputX++
    this.player.setVelocityX(inputX * this.moveSpeed * (this.isStunned ? 0 : 1))
    
    

    //Prepare raycast (to check if grounded)
    const bodies = [
      (this.data.number == 2 ? this.scene.player1 : this.scene.player2).player.body,
      this.scene.ball.ball.body,
      this.scene.floor,
    ]
    const from = Phaser.Physics.Matter.Matter.Vector.create(this.player.x, this.player.y)
    const to = Phaser.Physics.Matter.Matter.Vector.create(this.player.x, this.player.y + this.player.height / 2)

    //Raycast (to check if grounded)
    const ray = Phaser.Physics.Matter.Matter.Query.ray(bodies, from, to, 1)
    this.isGrounded = ray.length > 0
    


    //Kick animation
    if (this.isKicking) {
      //Update animation progress
      this.kickProgress = Math.min(this.kickProgress + delta * 2 / 1000, 1)
      const progress = Util.cliff(this.kickProgress)

      //Animate kick
      this.foot.angle = progress * 30 * -this.data.scale
      this.footOffset = new Vec2(progress * 50 * this.data.scale, progress * -10)
      
      //Finished kick
      if (this.kickProgress >= 1) this.isKicking = false
    }



    //Update foot position
    const footOrigin = new Vec2(
      this.player.x + (this.player.width / 2 - this.foot.width / 2 - 2) * this.data.scale, 
      this.player.y + (this.player.height / 2 - this.foot.height / 2 - 2)
    )
    const footPosition = footOrigin.add(this.footOffset)
    this.foot.setPosition(footPosition.x, footPosition.y)
  }

  //Other
  addPoint() {
    //Add point to score
    this.points++
    this.pointsText.setText(this.points)

    //Play voiceline
    this.scene.sound.add('voice' + this.data.skin + '.' + Util.rand(0, 1)).play()  //Play a random voiceline (0 or 1)
  }
}



//Powerups
const PowerInfo = Object.freeze({
  MAX: 4,
  DELAY: 10000, 
  //Ball
  BallBouncy: 0,
  BallBig:    1,
  BallSmall:  2,
  //Players
  StunPlayer: 3,
  StunEnemy:  4,
})

const PowerSprite = Object.freeze([
  'powerBouncyBall',
  'powerBigBall',
  'powerSmallBall',
  'powerIceBad',
  'powerIce',
])

class Power {

  constructor(scene) {
    //Save scene
    this.scene = scene

    //Save type
    this.type = Util.rand(0, PowerInfo.MAX)

    //Create power image
    this.power = Scene.imageWithPhysics(this.scene, PowerSprite[this.type], {
      //Position
      x: 1280 * 0.2 + Util.rand(0, 1280 * 0.6),
      y: 250 + Util.rand(-50, 50),
      //Options
      ignoreGravity: true,
      isStatic: true,
      isSensor: true
    })

    //Add on trigger
    this.power.setOnCollideActive(pair => {
      //Not touching the ball
      if (pair.bodyA.label != 'ball' && pair.bodyB.label != 'ball') return

      //Take powerup
      this.power.destroy(true)
      this.onTake()
    })
  }

  onTake() {
    //Get ball & players
    const ball = this.scene.ball.ball
    const player = this.scene.ball.last == 1 ? this.scene.player1 : this.scene.player2
    const enemy = this.scene.ball.last == 1 ? this.scene.player2 : this.scene.player1

    //Get duration (default 10 seconds)
    let duration = 10000

    //Execute power
    switch (this.type) {
      case PowerInfo.BallBig:
        ball.setScale(2)
        break
      case PowerInfo.BallSmall:
        ball.setScale(0.5)
        break
      case PowerInfo.BallBouncy:
        ball.setBounce(1)
        break
      case PowerInfo.StunPlayer:
        duration = 3000
        player.stun(duration)
        break
      case PowerInfo.StunEnemy:
        duration = 3000
        enemy.stun(duration)
        break
    }

    //Wait until end
    setTimeout(() => {
      this.onEnd()
    }, duration)
  }

  onEnd() {
    //Get ball
    const ball = this.scene.ball.ball

    //End power
    switch (this.type) {
      case PowerInfo.BallBig:
      case PowerInfo.BallSmall:
        ball.setScale(1)
        break
      case PowerInfo.BallBouncy:
        ball.setBounce(0.6)
        break
    }

    //Wait to spawn another
    this.scene.spawnPower()
  }
}