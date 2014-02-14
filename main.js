WebFontConfig = {
    google: { families: [ 'Coming+Soon::latin', 'Pacifico::latin' ] },
    active: main
};
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})(); 


function main() {

if (location.hash.length < 1) {
    var form = document.getElementById('form');
    form.style.display = 'block';
    form.querySelector('button').addEventListener('click', function() {
        var url = form.querySelector('.url');
        url.innerText = location.href + '#' + btoa(JSON.stringify({
            imageURL: form.querySelector('input').value,
            message: form.querySelector('textarea').value
        }));
        url.style.display = 'block';
    });
    return;
} else {
    var input = JSON.parse(atob(location.hash.substring(1)));
}

var state = {
    preload: preload,
    create: create,
    update: update
};

var parent = document.querySelector('#screen');

var game = new Phaser.Game(
    window.innerWidth,
    window.innerHeight,
    Phaser.AUTO,
    parent,
    state
);

function preload() {
    var assets = {
        image: {
            smallHeart: ['assets/small-heart.png'],
            bigHeart: ['assets/big-heart.png'],
            portraitFrame: ['assets/portrait-frame.png'],
            portraitImage: [input.imageURL]
        }
    };
    Object.keys(assets).forEach(function(type) {
        Object.keys(assets[type]).forEach(function(id) {
            game.load[type].apply(game.load, [id].concat(assets[type][id]));
        });
    });
}

var sprites = {};
var groups = {};
var timers = {};

function create() {
    // Draw bg
    var bg = game.add.graphics(0, 0);
    bg.beginFill(0xFFEEEE, 1);
    bg.drawRect(0, 0, game.world.width, game.world.height);
    bg.endFill();
    // Small hearts
    groups.hearts = game.add.group();
    for (var i = 0; i < 128; i++) {
        var heart = groups.hearts.create(0, 0, 'smallHeart');
        heart.alpha = 0;
        heart.anchor.setTo(0.5, 0.5);
    }
    timers.hearts = new Phaser.Timer(game);
    timers.hearts.onEvent.add(tweenHeart);
    timers.hearts.start();
    timers.hearts.add(Math.random());
    // Big heart
    sprites.bigHeart = game.add.sprite(
        game.world.width / 2,
        game.world.height / 3,
        'bigHeart'
    );
    sprites.bigHeart.anchor.setTo(0.5, 0.5);
    // Portrait
    groups.portrait = game.add.group();
    var portraitImage = groups.portrait.create(
        game.world.width / 2,
        0,
        'portraitImage'        
    )
    portraitImage.anchor.setTo(0.5, 0.5);
    portraitImage.width = 128;
    portraitImage.height = 128;
    var portraitFrame = groups.portrait.create(
        game.world.width / 2,
        0,
        'portraitFrame'        
    )
    portraitFrame.anchor.setTo(0.5, 0.5);
    portraitFrame.width = 128;
    portraitFrame.height = 128;
    // Draw message
    sprites.message = game.add.text(
        game.world.width / 2,
        game.world.height * 2 / 3,
        input.message,
        {
            font: '60px "Pacifico"',
            fill: '#f43',
            align: 'center'
        }
    );
    sprites.message.anchor.setTo(0.5, 0.5);
}

var heartIndex = 0;
function tweenHeart() {
    timers.hearts.stop();
    var heart = groups.hearts.getAt(++heartIndex % groups.hearts.countLiving());
    heart.x = Math.random() * window.innerWidth;
    heart.y = Math.random() * window.innerHeight;
    var s = 0.6 + 0.4 * Math.random();
    heart.scale.setTo(s, s);
    var dir = Math.random() > 0.5 ? 1 : -1;
    heart.angle = dir * 45 * Math.random();
    game.add.tween(heart)
        .to({alpha: 0.5}, 1000, Phaser.Easing.Cubic.Out)
        .to({alpha: 0}, 800, Phaser.Easing.Cubic.Out)
        .start();
    game.add.tween(heart).to({
        y: heart.y - game.world.height / 50,
        angle: heart.angle + dir * Math.random() * 15
    }, 2000, Phaser.Easing.Cubic.Out, true)
    timers.hearts.start();
    timers.hearts.add(0.1 * Math.random());
}

function update() {
    var sx = 1 + 0.05 * Math.cos(game.time.now / 200);
    var sy = 1 + 0.05 * Math.sin(game.time.now / 200);
    sprites.bigHeart.scale.setTo(sx, sy);
    sprites.message.scale.setTo(sx, sy);
    groups.portrait.y = game.world.height / 3 + (game.world.height / 100 * Math.cos(game.time.now / 200));
    timers.hearts.update();
}

};
