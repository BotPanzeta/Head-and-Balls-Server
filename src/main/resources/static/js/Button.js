class Button {

  image = undefined
  text = undefined

  constructor(scene, x, y, text) {
    //Create image & text
    this.image = scene.add.image(x, y, 'button')
    this.text = scene.add.text(x, y - 6, text, {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Hover animation
    Element.onHover(this.image, () => {
      this.image.setTexture('buttonHover')
    }, () => {
      this.image.setTexture('button')
    })
  }
}