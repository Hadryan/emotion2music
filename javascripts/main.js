window.onload = function() {

  //var Tonal = require("tonal");
  //Tonal.transpose("C4", "2m");
  //let scale =  Tonal.Scale.notes("Bb minor");
  //console.log(scale);

  var playButton = document.getElementById("startBtn");
  var stopButton = document.getElementById("stopBtn");
  var submitButton = document.getElementById("submitBtn");

  var key = "neutral";

  //using I-IV-V-I, I-ii-V, I-Vi-ii-V, I-iii-vi-ii-V
  var happyChords = [];
  happyChords[0] = ['c3M', 'f3M', 'g3M', 'c3M'];
  happyChords[1] = ['c3M', 'd3m', 'g3M', 'c3M'];
  happyChords[2] = ['c3M', 'a3m', 'd3m', 'g3M'];
  happyChords[3] = ['c3M', 'e3m', 'a3m', 'd3m','g3M'];

  //using im-IVm-Vm(natural min), im-ii-V, im-VI-ii-V (melodic), im-bVI-IVm-V (harmonic)
  var sadChords = [];
  sadChords[0] = ['c3m', 'f3m7', 'g3m', 'c3m'];
  sadChords[1] = ['c3m', 'd3m7b5', 'g3M9', 'c3m'];
  sadChords[2] = ['c3m', 'a3m7b5', 'd3m7', 'g37'];
  sadChords[3] = ['c3m', 'ab3M7', 'f3m7','g37b9'];

  var timeSig = ['4/4','3/4','9/8','12/8','5/4','7/8','5/8','3/8','6/8'];

  let jsonData = {};

  Gibber.init();

  submitButton.addEventListener("mousedown", function() {

  let inputTextBox = document.getElementById("jsonInput");
  jsonData = inputTextBox.value;
  let emotions = JSON.parse(jsonData);
  let anger = emotions.anger,
      anticipation = emotions.anticipation,
      disgust = emotions.disgust,
      fear = emotions.fear,
      joy = emotions.joy,
      negativepositive = emotions["negative-positive"],
      sadness = emotions.sadness,
      surprise = emotions.surprise,
      trust = emotions.trust;

  let avgPositivity = (joy + negativepositive + trust)/3;
  let avgNegativity = (disgust + fear + anger + sadness)/4;

  if(avgPositivity > avgNegativity){
    key = "majorKey";
  } else if (avgNegativity > avgPositivity) {
    key = "minorKey";
  } else {
    key = "neutral";
  };

  }, false);

  playButton.addEventListener("mousedown", function() {

    var c = FM({ maxVoices:10 })
    let E = Euclid;

    let randomNum = getRandomInt(4);

    if(key == "majorKey"){
    Clock.rate = 1;
    Clock.timeSignature = timeSig[getRandomInt(8)];
    c.chord.seq(happyChords[randomNum], 1/2 );
    var h = Drums('x...x..xx..xx... | *.*.*-***.*-*.** | .o,1/4').pitch.seq( Rndf(.9,1.1), 1/16);
    //let b = Synth({ maxVoices:10, attack:44, decay:ms(1000) });
    //let s = Schizo({ chance:.5, rate:ms(250), length:ms(1000) });
    //h.fx.add( s );
    let drumR = Reverb({ roomSize: Add( .100, Sine( .05, .245 )._ ) });
    h.fx.add( drumR );
    var b = Synth2({ maxVoices:4, waveform:'PWM', filterMult:1, resonance:4 });
    let d = Arp( 'c4maj7', 1/4, 'updown', 4 );
    d.target = b;
    d.chord.seq(happyChords[randomNum], 1)
    //b.fx.add( r );

    console.log("majorKey");

  } else if (key == "minorKey") {

    Clock.rate = 0.5;
    Clock.timeSignature = timeSig[getRandomInt(8)];
    c.chord.seq(sadChords[getRandomInt(4)], 1 );
    let s = Drums('x.xxx..xx..xx.x. | *.-.*-*-*.***.-* | .o,1/3').pitch.seq( Rndf(.8,2.1), 1/8);
    let ss = Schizo({ chance:.9, rate:ms(getRandomInt(250)), length:ms(1000) });
    s.fx.add( ss );
    console.log("minorKey");

    } else {

    console.log("neutral");

    }

    //var a = Snare().play( 440, 18/32 );
    //a.decay = 22050;

    //var b = Drums( 'xo.xo*.*oo--' );
    //b.fx.add( Delay( 5/7 ));

    //var c = Mono('easyfx').note.seq( Rndi( 0, 22 ), [1/8,1/8,1,2].rnd( 1/8, 4 ));

    //c.chord( 'c4dim7' );
    //c.chord.seq( ['c3M', 'f3M', 'g3M', 'c3M'], 1/2 )
    // change global scale
    //Gibber.scale.mode = 'Lydian'
    //c.play( ['c2', 'c5', 'c4'], [1/2, 1/2, 1] );

    //var d = Cowbell().play( Rndf( 750, 3200 ), 1/4 );
    //d.fx.add( Schizo());

    stopButton.addEventListener("mousedown", function() {

    Gibber.clear();
    c.stop();
    s.stop();
    h.stop();
    b.stop();
    console.log("Clear!");

    }, false);

  }, false);

  //UTILITIES
  function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
  };

};
