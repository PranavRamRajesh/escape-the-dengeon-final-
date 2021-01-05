var player;
var ground;
var lawnImg;
var lawn;
var dragonWalkingImg;
var hunterImg;
var arrowImg;
var bombImg;
var startButton, startButtonImg;
var gameOver, gameOverImg;
var restart, restartImg;
var deathImg;
var birdAnimation;

var PLAY = 1;
var END = 0;
var START = 2;
var gameState = START;

var jumpSound,dieSound,scoreSound;

var score = 0;

function preload(){
   lawnImg = loadImage("lawn.jpg");
   dragonWalkingImg = loadAnimation("dragon/Walk1.png","dragon/Walk2.png","dragon/Walk3.png","dragon/Walk4.png","dragon/Walk5.png");
   hunterImg = loadAnimation("hunter/attack0.png","hunter/attack1.png","hunter/attack2.png","hunter/attack3.png","hunter/attack4.png");
   arrowImg = loadImage("hunter/arrow.png");
   bombImg = loadImage("hunter/bomb.png");
   gameOverImg = loadImage("hunter/Game_Over.png");
   startButtonImg = loadImage("hunter/start_button.png");
   deathImg = loadImage("dragon/Death5.png"); 
   restartImg = loadImage("hunter/restart.png");
   birdAnimation = loadAnimation("hunter/birds_1.png","hunter/birds_2.png","hunter/birds_3.png");
   

   jumpSound = loadSound("sounds/jump.mp3");
   dieSound = loadSound("sounds/you_lose.mp3");
   scoreSound = loadSound("sounds/200_score.mp3");

   
}

function setup() {
  createCanvas(windowWidth,windowHeight);
 
  lawn = createSprite(windowWidth/2,height-450,windowWidth,20);
  lawn.addImage(lawnImg);
  lawn.scale = 2.5;
  player = createSprite(200,300,20,20);
  player.addAnimation("run",dragonWalkingImg);
  player.addAnimation("death",deathImg);
  player.scale = 1.8;

  hunterGroup = new Group();
  birdsGroup = new Group();

  gameOver = createSprite(width/2,height/3,20,20);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;
  
  player.setCollider("rectangle",0,0,player.width-100,player.height-150);
  ground = createSprite(windowWidth/2,height-20,windowWidth,20);
  ground.visible = false;
  lawn.x= lawn.width/2;

  startButton = createSprite(width/2,height/2-100,20,20);
  startButton.addImage(startButtonImg);
  startButton.scale = 0.5

  restart = createSprite(width/2,height/2+50,20,20);
  restart.addImage(restartImg);
  restart.scale = 0.3;
  restart.visible = false;
  
  
  
}

function draw() {
  background(255,255,255);

  drawSprites();
  
  if(gameState===START){
    textSize(40);
    textStyle(ITALIC);
    fill("blue");
    text ("Escape the Dungeon",width/2-150,height/2-200);

    if(mousePressedOver(startButton)|| touches.length>0){
      gameState = PLAY;
      touches = [];
    }

    textSize(20);
    text("Our friend Oscar the dragon was captured and kept in captive by the selfish humans. help Oscar escape the humans and be free",width/2-540,height/2);
    text("Press the Space bar or tap the screen to start the course to set Oscar free!!",width/2-180,height/2+50);
    text("Coding done by Pranav Ram Rajesh",width/2-120,height/2+100)
    player.visible = false;
    
  }

  if(gameState===PLAY){
    if(lawn.x<0){
      lawn.x = lawn.width/2;
    }

    score = score + Math.round(getFrameRate()/60);

    lawn.velocityX =-4;

    spawnBird();
  
    if(keyDown("space")|| touches.lenght>0){
      player.velocityY = -25;
      jumpSound.play();
      touches = [];
      
      }

      fill("orange") 
      textSize(30)
      textStyle(BOLD)
      text ("SCORE : "+score,width-200,100);

      if(score>0 && score%100===0){
        scoreSound.play();
      }


    player.velocityY = player.velocityY +0.8;
    player.collide(ground);
    player.visible = true;
    startButton.visible = false;
  
    spawnHunters();

    if(player.isTouching(hunterGroup)){
      gameState = END;
      dieSound.play();
    }
  }

  if (gameState=== END){
    lawn.velocityX = 0;
    hunterGroup.destroyEach();
    gameOver.visible = true;
    restart.visible = true;
   
    player.velocityX = 0;
    player.collide(ground);
    player.changeAnimation("death",deathImg);

    fill("orange") 
    textSize(30)
    textStyle(BOLD)
    text ("SCORE : "+score,width-200,100);

    if(mousePressedOver(restart)||touches.length>0) {
      gameState=PLAY;
      restart.visible = false;
      gameOver.visible = false;
      score = 0;
      player.changeAnimation("run",dragonWalkingImg);
      touches = [];
  }

}
  
 

 
}

function spawnHunters() {
  
  if (frameCount % 200 === 0) {
    var hunter = createSprite(width,height-100,40,10);
    var rand = Math.round(random(1,3));
    switch(rand){
      case 1:hunter.addAnimation("hunter",hunterImg);
      hunter.setCollider("rectangle",0,0,hunter.width-50,hunter.height-100);
      hunter.scale = 2;
      break;

      case 2:hunter.addImage("arrow",arrowImg);
      hunter.setCollider("rectangle",0,0,hunter.width-180,hunter.height);
      hunter.scale = 0.3;
      break;

      case 3:hunter.addImage("bomb",bombImg);
      hunter.scale = 0.2
      hunter.y = height-50;
      break;

      
      default:break;
    }
    
    hunter.velocityX = -(9+score/300)
    
  
    hunter.lifetime = Math.round(width/9);
    
    
    hunterGroup.add(hunter);
  }
  
}

function spawnBird() {
  
  if (frameCount % 100 === 0) {
    var bird = createSprite(width,200,40,10);
    bird.y = Math.round(random(50,450));
    bird.addAnimation("bird",birdAnimation);
    bird.scale = 0.5;
    bird.velocityX = -5;
    
   
    bird.lifetime = Math.round(width/5);
    
    bird.depth = player.depth;
    player.depth = player.depth + 1;
    
    birdsGroup.add(bird);
  }
  
}