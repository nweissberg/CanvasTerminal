MOM.get('obj2D_1').del()
var app_name = "Flappy"
var game_stg = new stg2D({
  color:colors.stage
})

const size = 50;
const gravity = 0.098;
var speed = gravity
const jump = 5

var char = new pln2D({
  cvs:"m_cvs",
  prnt:game_stg,
  color:colors.active,
  rds:size*0.5,
  w:size,
  h:size,
  pvt:[0.5,0],
  rltv:false,
  auto:true,
  onLoad:(function(){
    this.score = 0
    this.colide = false
    this.score_lbl = new txt2D({
       txt:"0",
       size:30,
       pos: new vec3D(0,10,0),
       pvt:[0.5,0],
       prnt:game_stg,
       onLoad:(function(){
         this.score_lbl = `High Score:\n<c=gold></c>`
       })
    })
    this.gates = [addGate(1),addGate(2)]
  }),
  loop:(function(){
    if(this.colide == true) return
    if(this.pos.y + speed + size < stg_h){
      if(this.pos.y >= 0){
        this.pos.y += speed
      }else{
        this.pos.y = 0
        speed = 0
      }
      speed += gravity
    }
    if(cursor.state && !this.last){
      speed = -jump
    }
    const gate_speed = 3
    this.last = cursor.state
    for(var i = 0; i < 2; i++){
      const gate = this.gates[i]
      this.colide = (this.inObj(gate.wall_top) || this.inObj(gate.wall_bottom))
      if(this.colide) return
      gate.pos.x -= 3
      if(gate.pos.x < -stg_w){
        gate.random()
      }
      if(this.current_gate != gate){
        if(this.inObj(gate)){
          this.current_gate = gate
        }
      }else{
        if(!this.inObj(gate)){
          this.score += 1
          this.score_lbl.txt = `${this.score}`
          this.current_gate = null
        }
      }
    }
  })
})

function addGate(n){
  const mainGate = new pln2D({
    color:colors.alpha,
    prnt:game_stg,
    rltv:false,
    w:size*2,
    h:stg_h,
    pos:new vec3D(stg_w*n,0,0),
  })
  mainGate.wall_top = new pln2D({
    prnt:mainGate,
    rltv:false,
    h:stg_h*0.3,
    pvt:[0.5,0]
  })
  mainGate.wall_bottom = new pln2D({
    prnt:mainGate,
    rltv:false,
    h:stg_h*0.3,
    pvt:[0.5,1]
  })
  mainGate.random = (function(){
    const h = stg_h*0.3
    const new_h = (0.8*((Math.random()*2)-1))*h
    this.wall_top._h = h - new_h
    this.wall_bottom._h = h + new_h
    this.pos.x = stg_w
  })
  return mainGate
}
