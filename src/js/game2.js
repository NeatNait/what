(function() {
  'use strict';

  function Game2() {
    this.player = null;
  }

  Game2.prototype = {

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2;

      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //this.game.stage.backgroundColor = '#313131';

      this.bullets = this.game.add.group();
      this.bullets.enableBody = true;
      this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

      this.bullets.createMultiple(50, 'cool');
      this.bullets.setAll('checkWorldBounds', true);
      this.bullets.setAll('outOfBoundsKill', true);
      this.bullets.setAll('scale.x', 0.5);
      this.bullets.setAll('scale.y', 0.5);
      
      this.player = this.game.add.sprite(x, y, 'cool');
      this.player.anchor.set(0.5);

      this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

      this.player.body.allowRotation = false;
      this.player.body.immovable = true;

      this.fireRate = 200;
      this.nextFire = 0;


      this.cool = this.createThings('cool', 30);
      this.bad = this.createThings('bad', 30);

      this.player.cool = true;


    },

    

    revive: function(){

      /*var body = this.cool.getAllDead();
      body.revive();
      body.x = this.player.x;
      body.y = this.player.y;*/

      var that = this;

      if(this.player.cool){
        var enemies = this.cool;
      }
      else{
        var enemies = this.bad;
      }

      enemies.forEachDead(function(body){
        body.revive();
        body.x = that.player.x + that.game.rnd.integerInRange(-50, 50) + that.player.scale.x + 100;
        body.y = that.player.y + that.game.rnd.integerInRange(-50, 50) + that.player.scale.x + 100;
      });

    },

    createThings : function (spriteName, qty, x, y){
      var sprites = this.game.add.group();

      for (var i = 0; i < qty; i++)
      {
        if(x && y){
          var s = sprites.create(x, y, spriteName);
        }
        else{
          var s = sprites.create(0, 200, spriteName);
        }
        //s.animations.add('spin', [0,1,2,3]);
        //s.play('spin', 20, true);
        this.game.physics.enable(s, Phaser.Physics.ARCADE);
        s.body.velocity.x = this.game.rnd.integerInRange(-100, 100);
        s.body.velocity.y = this.game.rnd.integerInRange(-100, 100);
      }

      sprites.setAll('body.collideWorldBounds', true);
      sprites.setAll('body.bounce.x', 0.35);
      sprites.setAll('body.bounce.y', 0.35);
      sprites.setAll('body.minBounceVelocity', 0.2);
      sprites.setAll('scale.x', 0.5);
      sprites.setAll('scale.y', 0.5);

      return sprites;
    },

    getPoints : function (sprite){
      sprite.kill();

      this.player.scale.x+=0.1;
      this.player.scale.y+=0.1;

      this.points++;
      this.game.addPoints();
      
    },

    collisionHandlerCool: function (player, sprite) {

      if(!this.player.cool){
        console.log(this.points);
        this.game.state.start('menu');
      }else{
        this.getPoints(sprite);
      }
      
    },

    collisionHandlerBad: function (player, sprite) {

      if(this.player.cool){
        console.log(this.points);
        this.game.state.start('menu');
      }else{
        this.getPoints(sprite);
      }
      
    },

    collisionHandlerBulletsBad: function (bullet, sprite) {

      if(!this.player.cool){
        console.log(this.points);
        this.game.state.start('menu');
      }
      else{
        sprite.kill();
        bullet.kill();
      }
      
    },

    collisionHandlerBulletsCool: function (bullet, sprite) {

      if(this.player.cool){
        console.log(this.points);
        this.game.state.start('menu');
      }
      else{
        sprite.kill();
        bullet.kill();
      }
      
    },

    update: function () {

    this.game.physics.arcade.collide(this.player, this.bad, this.collisionHandlerBad, null, this);
    this.game.physics.arcade.collide(this.player, this.cool, this.collisionHandlerCool, null, this);
    this.game.physics.arcade.collide(this.bullets, this.bad, this.collisionHandlerBulletsBad, null, this);
    this.game.physics.arcade.collide(this.bullets, this.cool, this.collisionHandlerBulletsCool, null, this);

      this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);

      if (this.game.input.activePointer.isDown)
      {
          this.fire();
      }

    },

    fire: function () {
      if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
      {
          this.nextFire = this.game.time.now + this.fireRate;

          var bullet = this.bullets.getFirstDead();

          bullet.reset(this.player.x - 8, this.player.y - 8);

          this.game.physics.arcade.moveToPointer(bullet, 300);
      }
    }

  };

  window['what'] = window['what'] || {};
  window['what'].Game2 = Game2;

}());
