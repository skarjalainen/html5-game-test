require([], function () { 
  Q.Sprite.extend('Player', {
    init: function (p) {
      this._super(p, {
        sprite: 'player',
        sheet: 'player',
        jumpSpeed: -600
      });
 
      this.add('2d, platformerControls, animation');
      this.play("stand_right");  
    },
    step: function (dt) {
      /*if (Q.inputs['up']) {
        this.p.vy = -200;
      } else if (Q.inputs['down']) {
        this.p.vy = 200;
      } else if (!Q.inputs['down'] && !Q.inputs['up']) {
        this.p.vy = 0;
      }*/
      if(this.p.vx > 0) {
        this.play("run_right");
      } else if(this.p.vx < 0) {
        this.play("run_left");
      } else {
        //console.log(this.p.direction);
        this.play("stand_" + this.p.direction);
      }
      this.p.socket.emit('update', { playerId: this.p.playerId, x: this.p.x, y: this.p.y, sheet: this.p.sheet });
    }
  });

  Q.Sprite.extend('Actor', {
    init: function (p) {
      this._super(p, {
        update: true
      });
   
      var temp = this;
      setInterval(function () {
        if (!temp.p.update) {
          temp.destroy();
        }
        temp.p.update = false;
      }, 3000);
    }
  });
});