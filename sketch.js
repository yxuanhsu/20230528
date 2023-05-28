let points = [[-6,6],[-6,-2],[-2,-2],[-8,-8],[-6,-8],[-6,-10],[0,-4],[6,-10],[6,-8],[8,-8],[2,-2],[6,-2],[6,6],[2,2],[2,-2],[-6,6]]
 var stroke_colors = "cdb4db-ffc8dd-ffafcc-bde0fe-a2d2ff".split("-").map(a=>"#"+a)
 var fill_colors = "ff99c8-fcf6bd-d0f4de-a9def9-e4c1f9".split("-").map(a=>"#"+a)
 var monster_colors = "cb997e-ddbea9-ffe8d6-b7b7a4-a5a58d-6b705c".split("-").map(a=>"#"+a)
 var bullet_colors = "0d1b2a-1b263b-415a77-778da9-e0e1dd".split("-").map(a=>"#"+a)
 function preload(){
 bingo_sound=loadSound("sound/bingo.mp3")
 tap_sound=loadSound("sound/tap.mp3")
 bring_sound=loadSound("sound/bring.mp3")
 }
 //粒子、類別
 class Obj{
  constructor(args){ //預設值，基本資料(包含有物件的顏色、位置、大小)
    //this.p=args.p||{x:random(width),y:random(height)}//物件一開始的位置
    this.p=args.p || createVector(random(width),random(height))
    //this.v={x:random(-1,1),y:random(-1,1)}//速度，xy移動的速度為亂數產生-1,1之間的速度
    this.v=args.p || createVector(random(-1,1),random(-1,1))
    this.size=random(2,8)
    this.color=random(fill_colors)
    this.stroke=random(stroke_colors)
  }
//把物件畫出來的函數  
draw()
{ 
push()
translate(this.p.x,this.p.y)
scale((this.v.x<0?1:-1),-1)//放大縮小的指令,1是1倍-1是放大縮小
fill(this.color)
stroke(this.stroke)
strokeWeight(3)
  beginShape()
for(var i=0;i<points.length-1;i=i+1){
  //line(points[i][0]*this.size,points[i][1]*this.size,points[i+1][0]*this.size,points[i+1][1]*this.size)
vertex(points[i][0]*this.size,points[i][1]*this.size)
}
  endShape()
pop()
}
update(){
  //this.p.x=this.p.x+this.v.x
  //this.p.y=this.p.y+this.v.y
  this.p.add(this.v)
  //算出滑鼠向量的位置
//let mouseV = createVector(mouseX,mouseY)
//let delta = mouseV.sub(this.p).limit(this.v.mag()*2)
//this.p.add(delta)

  if(this.p.x<=0||this.p.x>=width)//<0碰到左邊，>width為碰到右邊
  {
    this.v.x=-this.v.x
  }
  if(this.p.y<=0||this.p.y>=height)
  {
    this.v.y=-this.v.y
  }
}
isBallInRanger(x,y){//判斷有沒有被滑鼠按到
  let d =dist(x,y,this.p.x,this.p.y)//計算滑鼠按下的點與物件位置之間的距離
  if(d<this.size*4){
  return true
  }
  else{
    return false
  }
}
 }

 class Bullet{
  constructor(args){
    this.r=args.r || 10
    this.p=args.p || shipP.copy()//飛彈起始的位置(以向量方式表示該座標)，要以中間砲台發射，所以座標為(/width/2,height/2)
    this.v=args.v || createVector(mouseX-width/2,mouseY-height/2).limit(3)//飛彈速度
    this.color=args.color || "red"//飛彈顏色
  }
  draw(){//劃出飛彈
    push()
      translate(this.p.x,this.p.y)
      fill(this.color)
      noStroke()
      ellipse(0,0,this.r)
    pop()
  }
  update(){//計算移動後位置
    this.p.add(this.v)
  }
}

class Monster{
  constructor(args){
    this.r=args.r || 40
    this.p=args.p || createVector(random(width),random(height))//怪物起始的位置(以向量方式表示該座標)
    this.v=args.v || createVector(random(-1,1),random(-1,1))//怪物速度
    this.color=args.color || random(monster_colors)//怪物顏色
    this.IsDead=false
    this.timenum=0
  }
  draw(){//畫怪物
    if(this.IsDead==false){
    push()
    translate(this.p.x,this.p.y)
    fill(this.color)
    noStroke()
    ellipse(0,0,this.r)
    fill(255)
    ellipse(0,0,this.r/2)
    fill(0)
    ellipse(0,0,this.r/3)
    //產生腳
    stroke(this.color)
    strokeWeight(4)
    //line(this.r/2,0,this.r,0)
      noFill()
      for(var j=0;j<8;j++){
      rotate(PI/4)
      beginShape()
      for(var i=0;i<30;i++){
      vertex(this.r/2+i,sin(i/5+frameCount/5)*10)
      }
      endShape()
    }
    pop()
  }
 else{//死後悲傷的圖
 this.timenum=this.timenum+1
 push()
 translate(this.p.x,this.p.y)
 fill(this.color)
 noStroke()
 ellipse(0,0,this.r)
 fill(255)
 arc(0,0,this.r/2,this.r/2,0,PI)
 fill(0)
 arc(0,0,this.r/3,this.r/3,0,PI)
 //產生腳
 stroke(this.color)
 strokeWeight(4)
   noFill()
   for(var j=0;j<8;j++){
   rotate(PI/4)
   line(this.r/2,0,this.r,0)
 }
 pop()
 } 
}
  update(){
  this.p.add(this.v)
  if(this.p.x<=0||this.p.x>=width)//<0碰到左邊，>width為碰到右邊
    {
      this.v.x=-this.v.x
    }
    if(this.p.y<=0||this.p.y>=height)
    {
      this.v.y=-this.v.y
    }
  
  }
  isBallInRanger(x,y){//判斷有沒有被滑鼠按到
    let d =dist(x,y,this.p.x,this.p.y)//計算滑鼠按下的點與物件位置之間的距離
    if(d<this.r/2){
    return true
    }
    else{
      return false
    }
  }
  }

 var bowtie//代表單一個物件，利用這個變數來做正在處理的物件
 var bowties=[]//陣列，放所有的物件資料
 var bullet//飛彈物件
 var bullets=[]
 var score=0
 var monster//怪物物件
var monsters=[]
 var shipP

 function setup() {
  createCanvas(windowWidth, windowHeight);
  shipP=createVector(width/2,height/2)//預設砲台位置
  
  for(var j=0;j<50;j=j+1){
  bowtie=new Obj({})//產生一個物件，暫時放入到bowtie變數中
  bowties.push(bowtie)//把bowtie物件放入到bowties
}

  for(var j=0;j<20;j=j+1){
  monster=new Monster({})//產生一個物件，暫時放入到monster變數中
  monsters.push(monster)//把monster物件放入到monsters
}
 }

 function draw(){
  background(220)
  if(keyIsPressed){
    if(key==" "){
      bullet=new Bullet({
        r:random(10,30),
        color:random(bullet_colors)
      })
      bullets.push(bullet)
      tap_sound.play()
    }
   if(key=="ArrowLeft"|| key=="a"){//鍵盤左鍵
    shipP.x=shipP.x-5
  }
  if(key=="ArrowRight"|| key=="d"){//鍵盤右鍵
    shipP.x=shipP.x+5
  }
  if(key=="ArrowUp"|| key=="w"){//鍵盤上鍵
    shipP.y=shipP.y-5
  }
  if(key=="ArrowDown"|| key=="s"){//鍵盤下鍵
    shipP.y=shipP.y+5
  }
   }
  for(let bowtie of bowties){
    bowtie.draw()
    bowtie.update()
    //由此判斷蝴蝶結有沒有接觸飛彈
    for(let bullet of bullets){
    if(bowtie.isBallInRanger(bullet.p.x,bullet.p.y))
    {
      score = score+1
      bingo_sound.play()
      bowties.splice(bowties.indexOf(bowtie),1)//蝴蝶結消失
      bullets.splice(bullets.indexOf(bullet),1)//飛彈消失
    }
  }
  }
  for(let bullet of bullets){
    bullet.draw()
    bullet.update()
  }
  
  for(let monster of monsters){
    if(monster.IsDead && monster.timenum==3){
      monsters.splice(monsters.indexOf(monster),1)
    }
    monster.draw()
    monster.update()
  //判斷怪物有沒有接觸到飛彈
  for(let bullet of bullets){
    if(monster.isBallInRanger(bullet.p.x,bullet.p.y))
    {
      score = score+2
      bring_sound.play()
      //monsters.splice(monsters.indexOf(monster),1)//怪物消失
      monster.IsDead=true//已經被打到，準備執行爆炸後畫面
      bullets.splice(bullets.indexOf(bullet),1)//飛彈消失
    }
  }
  }
  
  textSize(50)
  text(score,50,50)
  push()
    let dx = mouseX-width/2//滑鼠座標到中心點座標的X軸距離
    let dy = mouseY-height/2
    let angle=atan2(dy,dx)//利用反tan算出角度
    translate(shipP.x,shipP.y)//砲台位置，使用shipP的向量值
    rotate(angle)
    fill("#2f3e46")
    noStroke()
    ellipse(0,0,65)
    triangle(50,0,-25,-25,-25,25)
  pop()
 }

 function mousePressed(){
  bullet=new Bullet({
    r:random(10,30),
    color:random(bullet_colors)
  })
  bullets.push(bullet)
  tap_sound.play()
}
