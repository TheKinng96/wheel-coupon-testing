function createCustomWheel(containerId, wheelImagePath, pointerImagePath, slices, slicePrizes) {
  var game;
  var wheel;
  var canSpin;
  var prize;
  var prizeText;

  // Create the container if it doesn't exist
  if (!document.getElementById(containerId)) {
      var container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
  }

  // Set the container's inner HTML
  document.getElementById(containerId).innerHTML = `
      <div id="game-container" style="position: relative; width: 500px; height: 500px;"></div>
      <div class="prize-text" id="prizeText" style="color: black; text-align: center; font-size: 24px; margin-top: 10px;"></div>
      <button onclick="spinWheel()" style="margin-top: 10px;">Spin</button>
  `;

  prizeText = document.getElementById("prizeText");

  game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 500,
      height: 500,
      scene: {
          preload: preload,
          create: create
      },
      parent: 'game-container'
  });

  function preload() {
      this.load.image('wheel', wheelImagePath);
      this.load.image('pointer', pointerImagePath);
  }

  function create() {
      wheel = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'wheel');
      wheel.setOrigin(0.5);
      var pointer = this.add.sprite(this.cameras.main.width / 2 + wheel.width / 2, this.cameras.main.height / 2, 'pointer');
      pointer.setOrigin(0.5, 0.5);
      canSpin = true;
      this.input.on('pointerdown', spin, this);
  }

  function spin() {
      if (canSpin) {
          prizeText.textContent = "";
          var rounds = Phaser.Math.Between(2, 4);
          var degrees = Phaser.Math.Between(0, 360);
          prize = slices - 1 - Math.floor(degrees / (360 / slices));
          canSpin = false;
          this.tweens.add({
              targets: wheel,
              angle: 360 * rounds + degrees,
              duration: 3000,
              ease: 'Cubic.easeOut',
              callbackScope: this,
              onComplete: winPrize
          });
      }
  }

  function winPrize() {
      canSpin = true;
      prizeText.textContent = slicePrizes[prize];
      console.log(slicePrizes[prize]);
  }

  window.spinWheel = function() {
      game.scene.scenes[0].spin();
  }
}
