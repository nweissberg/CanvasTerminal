MOM.get('obj2D_1').del()
var app_name = "Snake"
var game_stg = new stg2D({
  cvs:"m_cvs",
  color:colors.stage,
  tab:1
})
var game_hud = new stg2D({
  // cvs:"h_cvs",
  color:colors.alpha,
  tab:0
})
var grid = 20
var speed = grid
var points = 0
const intervals = [222,88,55]
var interval = intervals[1]
var tail = []
var del_list = []
var snd_eat = new Sound("./__SND__/Eat")
var snd_hit = new Sound("./__SND__/Hit")
var game_loop = null
var high_score
var high_score_txt = loadVar("high_score")
var high_score_obj
// console.log(high_score_txt)
if(high_score_txt!=null){
  var decoded = Aes.Ctr.decrypt( high_score_txt, keyCode, 256);
  high_score = JSON.parse(decoded)
  console.log(high_score)
}
if(high_score == undefined) high_score = {points:points}
if(high_score.points > 0){
  high_score_obj = new txt2D({
    size:20,
    pos:new vec3D(0,30,0),
    color:colors.font_light,
    indx:[0,2],
    prnt:game_hud,
    txt:"High Score:\n<c=gold>"+high_score.points+": "+ high_score.player+"</c>"
  })
}

new txt2D({
  // family:"Times New Roman",
  txt:"👑",
  indx:2,
  prnt:game_hud,
  size:150,
  color:colors.font_light,
  pos:new vec3D(0,-30,0)
})

new bttn2D({
  cvs:"h_cvs",
  src:'./__SVG__/star.svg',
  color:color("gold"),
  font_color:colors.font_dark,
  pos:new vec3D(0,(stg_h/2)-50,0),
  prnt:game_hud,
  img_color:color("white"),
  img_scale:0.7,
  size:22,
  style:"bold",
  w:80,
  h:80,
  rds:40,
  indx:2,
  rltv:false,
  onTch_U:(function(){
    // console.log(player_name.lbl.txt)
    var high_score_var = {
      player:player_name.lbl.txt,
      points:points
    }
    if(high_score_obj){
      high_score_obj.txt = "High Score:\n<c=gold>"+high_score_var.points+": "+ high_score_var.player+"</c>"
    }else{
      high_score_obj = new txt2D({
        size:20,
        color:colors.font_light,
        indx:[0,2],
        prnt:game_hud,
        txt:"High Score:\n<c=gold>"+high_score_var.points+": "+ high_score_var.player+"</c>"
      })
    }
    var high_score_str = JSON.stringify(high_score_var)
    var AES_TXT = Aes.Ctr.encrypt( high_score_str, keyCode, 256);
    saveVar("high_score",AES_TXT)
    // reset_game()
    // game_hud.tab = 0
    // game_stg.tab = 1
  })
})

var player_name = new inputfield({
  prnt:game_hud,
  pos: new vec3D(0,30,0),
  // txt_pos: new vec3D(2,12,0),
  color:colors.window,
  font_color:colors.font_light,
  txt_pvt:[0.5,0.5],
  size:22,
  rds:10,
  w:30,
  h:10,
  indx:2
  // onOvr:(()=>{
  //  document.body.style.cursor = "text"
  // })
})
new txt2D({
  family:"Times New Roman",
  txt:"SNAKE",
  prnt:game_hud,
  size:100,
  color:colors.font_light,
  pos:new vec3D(0,-10,0)
})
new bttn2D({
  // cvs:"h_cvs",
  txt:"Easy",
  color:colors.active,
  font_color:colors.font_dark,
  pos:new vec3D(-22,10,0),
  prnt:game_hud,
  size:22,
  style:"bold",
  // rltv:false,
  w:20,
  h:10,
  rds:5,
  // indx:1,
  onTch_U:(function(){
    interval = intervals[0]
    game_hud.tab = 1
    game_stg.tab = 0
    reset_game()
  })
})

new bttn2D({
  // cvs:"h_cvs",
  txt:"Medium",
  color:colors.active,
  font_color:colors.font_dark,
  pos:new vec3D(0,10,0),
  prnt:game_hud,
  size:22,
  style:"bold",
  w:20,
  h:10,
  rds:5,
  onTch_U:(function(){
    interval = intervals[1]
    game_hud.tab = 1
    game_stg.tab = 0
    reset_game()
  })
})

new bttn2D({
  // cvs:"h_cvs",
  txt:"Hard",
  color:colors.active,
  font_color:colors.font_dark,
  pos:new vec3D(22,10,0),
  prnt:game_hud,
  size:22,
  style:"bold",
  // rltv:false,
  w:20,
  h:10,
  rds:5,
  // indx:1,
  onTch_U:(function(){
    interval = intervals[2]
    game_hud.tab = 1
    game_stg.tab = 0
    reset_game()
  })
})

var score = new txt2D({
  cvs:"h_cvs",
  txt:"Score: <b><c=gold>"+points+"</c></b>",
  color:colors.font_light,
  pvt:[0.5,0.5],
  size:22,
  // indx:[0,1],
  pos: new vec3D(0,-40,0),
  prnt:game_stg
})
function reset_game(){
  if(del_list.length>0){
    for(var i in del_list){
      del_list[i].del()
    }
  }else{
    tail = []
    tail.push(char)
    return
  }
  retry_bot.vis=false
  retry_bot.lbl.vis=false
  score.size = 22
  score.pos.y = -40
  char.pos = randomPos()
  food.pos = randomPos()
  char.color = colors.active
  points = 0
  score.txt = "Score: <b><c=gold>"+points+"</c></b>"
  char.loop = game_loop
  tail.push(char)
  speed = grid
}
function randomPos(){
  var x = Math.floor(Math.random()*((stg_w-20)/grid))*grid
  var y = Math.floor(Math.random()*((stg_h-20)/grid))*grid
  for(var t in tail){
    if(tail[t].pos.x == x && tail[t].pos.y == y){
      return randomPos()
    }
  }
  return new vec3D(x,y,0)
}
new joystick({
  cvs:"h_cvs",
  prnt: h_stg,
})
var retry_bot = new bttn2D({
  cvs:"h_cvs",
  txt:"Retry",
  color:colors.active,
  font_color:colors.font_dark,
  pos:new vec3D(0,15,0),
  prnt:game_stg,
  size:22,
  style:"bold",
  w:30,
  h:10,
  rds:5,
  vis:false,
  onTch_U:(function(){
    // reset_game()
    if(high_score_obj)high_score_obj.pos.y = 30
    game_hud.tab = 0
    game_stg.tab = 1
  })
})

var food = new pln2D({
  cvs:"m_cvs",
  prnt:game_stg,
  color:colors.positive,
  pos: randomPos(),
  rds:grid*0.5,
  w:grid,
  h:grid,
  pvt:[0,0],
  rltv:false,
})
var char = new pln2D({
  cvs:"m_cvs",
  prnt:game_stg,
  color:colors.active,
  pos: randomPos(),
  pvt:[0,0],
  rds:5,
  w:grid,
  h:grid,
  rltv:false,
  auto:true,
  onLoad:(function(){
    this.ticks = interval
    this.time = Date.now()
    this.dir = 0
    this.last_dir = this.dir
  }),
  loop:(function(){
    // console.log(touchpad.dir)
    if((getKey(['UP','W'],1) || touchpad.dir == 'W') && this.last_dir != 3) this.dir = 0
    if((getKey(['LEFT','A'],1)|| touchpad.dir == 'A') && this.last_dir != 2) this.dir = 1
    if((getKey(['RIGHT','D'],1)|| touchpad.dir == 'D') && this.last_dir != 1) this.dir = 2
    if((getKey(['DOWN','S'],1)|| touchpad.dir == 'S') && this.last_dir != 0) this.dir = 3
    if(getKey("ESC",1)) speed = 0
    if(Date.now() - this.time < interval) return
    // if(this.ticks>0){
    //   this.ticks -- 
    //   return
    // }
    if(speed == 0){
      if(tail.length == 0){
        game_loop = this.loop
        this.loop = null
        this.auto = false
        // game_stg.tab = 1
        score.lerpTo("size",50,15).stack()
        score.lerpTo("pos.y",-10,15).exec((function(){
          retry_bot.vis=true
          retry_bot.lbl.vis=true
          if(points > high_score.points){
            game_hud.tab = 2 
            if(high_score_obj) high_score_obj.pos.y = 0
          }
          
        })).play()
        return
      }
      tail[0].color = colors.negative
      if(snd_hit.sound != undefined){
        snd_hit.sound.play();
      }
      if(tail[0]!=this)del_list.push(tail[0])
      tail.shift()
    }else{
      for (var i = tail.length - 1; i >= 0; i--) {
        if(i>0){
          if(this.pos.x == tail[i].pos.x && this.pos.y == tail[i].pos.y){
            speed = 0
            return
          }
          tail[i].pos = tail[i-1].pos.clone()
        }
      }
    }
    var dis = this.pos.distanceTo(food.pos)
    if(dis<grid){
      if(snd_eat.sound != undefined){
        snd_eat.sound.play();
      }
      food.pos = randomPos()
      points+=5
      score.txt = "Score: <b><c=gold>"+points+"</c></b>"
      tail.push(
        new pln2D({
          cvs:"m_cvs",
          prnt:game_stg,
          color:colors.active,
          pos: tail[tail.length-1].pos.clone(),
          pvt:[0,0],
          rds:5,
          w:grid,
          h:grid,
          rltv:false,
        })
      )
    }
    if(this.dir == 0)this.pos.y-=speed
    if(this.dir == 1)this.pos.x-=speed
    if(this.dir == 2)this.pos.x+=speed
    if(this.dir == 3)this.pos.y+=speed
    var max_w = Math.floor((stg_w+grid)/grid)*grid
    var max_h = Math.floor((stg_h+grid)/grid)*grid
    if(this.pos.x > max_w-(grid))this.pos.x = 0
    if(this.pos.x < 0)this.pos.x = max_w-(grid)
    if(this.pos.y > max_h-(grid))this.pos.y = 0
    if(this.pos.y < 0)this.pos.y = max_h-(grid)
    this.last_dir = this.dir
    // this.ticks = interval
    this.time = Date.now()
  })
})
tail.push(char)