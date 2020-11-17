window.onload = function() {

  Gibber.init();
  //var Tonal = require("tonal");
  //Tonal.transpose("C4", "2m");
  //let scale =  Tonal.Scale.notes("Bb minor");
  //console.log(scale);

  var playButton = document.getElementById("startBtn");
  var stopButton = document.getElementById("stopBtn");
  var submitButton = document.getElementById("submitBtn");
  var inputTextBox = document.getElementById("jsonInput");

  var key = "neutral";

  //using I-IV-V-I, I-ii-V, I-Vi-ii-V, I-iii-vi-ii-V
  var happyChords = [];
  happyChords[0] = ['c3M', 'f3M', 'g3M', 'c3M'];
  happyChords[1] = ['c3M', 'd3m', 'g3M', 'c3M'];
  happyChords[2] = ['c3M', 'a3m', 'd3m', 'g3M'];
  happyChords[3] = ['c3M', 'e3m', 'a3m', 'd3m', 'g3M'];

  //using im-IVm-Vm(natural min), im-ii-V, im-VI-ii-V (melodic), im-bVI-IVm-V (harmonic)
  var sadChords = [];
  sadChords[0] = ['c3m', 'f3m7', 'g3m', 'c3m'];
  sadChords[1] = ['c3m', 'd3m7b5', 'g3M9', 'c3m'];
  sadChords[2] = ['c3m', 'a3m7b5', 'd3m7', 'g37'];
  sadChords[3] = ['c3m', 'ab3M7', 'f3m7', 'g37b9'];

  var bassNotes = [];
  bassNotes[0] = [65.41, 87.31, 98.00, 65.41];
  bassNotes[1] = [65.41, 73.42, 98.00, 65.41];
  bassNotes[2] = [65.41, 110.00, 73.42, 98.00];
  bassNotes[3] = [65.41, 110.00, 87.31, 98.00];

  var timeSig = ['4/4', '3/4', '9/8', '12/8', '5/4', '7/8', '5/8', '3/8', '6/8'];

  let jsonData = {};

  submitButton.addEventListener("mousedown", function() {

    jsonData = inputTextBox.value;
    var emotions = JSON.parse(jsonData);
    var anger = emotions.anger,
      anticipation = emotions.anticipation,
      disgust = emotions.disgust,
      fear = emotions.fear,
      joy = emotions.joy,
      negativepositive = emotions["negative-positive"],
      sadness = emotions.sadness,
      surprise = emotions.surprise,
      trust = emotions.trust;

    var avgPositivity = (joy + negativepositive + trust) / 3;
    var avgNegativity = (disgust + fear + anger + sadness) / 4;

    if (avgPositivity > avgNegativity) {
      key = "majorKey";
    } else if (avgNegativity > avgPositivity) {
      key = "minorKey";
    } else {
      key = "neutral";
    };

  }, false);

  playButton.addEventListener("mousedown", function() {

    let c = FM({
      maxVoices: 10
    });
    let E = Euclid;

    let randomNum = getRandomInt(4);
    let rdmTimeSig = getRandomInt(8);

    if (key == "majorKey") {
      Clock.rate = 1;
      Clock.timeSignature = timeSig[rdmTimeSig];
      c.chord.seq(happyChords[randomNum], 1 / 2);
      let chorus = Chorus({
        rate: getRandomInt(4),
        feedback: 0.5
      });
      c.fx.add(chorus);

      let synthDelay = Delay();

      let u = Seq({
        time: Rndi( ms(2), ms(500) ),
        durations:1/2,
        target: synthDelay
      });

      c.fx.add( synthDelay );

      var h = Drums('x...x..xx..xx... | *.*.*-***.*-*.** | .o,1/4').pitch.seq(Rndf(.9, 1.1), 1 / 16);
      let ssDrum = Schizo({
        chance: 1,
        rate: ms(getRandomInt(250)),
        length: ms(1000)
      });
      h.fx.add(ssDrum);
      let drumVerb = Reverb({ roomSize: 0.755 });
      h.fx.add(drumVerb);

      var b = Synth2({
        maxVoices: 4,
        waveform: 'PWM',
        filterMult: 1,
        resonance: 4
      });
      let d = Arp('c4maj7', 1 / 4, 'updown', 4);
      d.target = b;
      d.chord.seq(happyChords[randomNum], 1)
      let bass = Mono({
        waveform: 'Sine',
        filterMult: 0,
        resonance: 0
      });
      bass.play(bassNotes[randomNum], 1 / 2);
      let delay = Delay();

      let seqDelay = Seq({
        time: Rndi(ms(2), ms(500)),
        durations: 1 / 2,
        target: delay
      });

      b.fx.add(delay);

      console.log("majorKey");

    } else if (key == "minorKey") {

      Clock.rate = 0.5;
      Clock.timeSignature = timeSig[getRandomInt(8)];
      c.chord.seq(sadChords[randomNum], 1);
      let s = Drums('x.xxx..xx..xx.x. | *.-.*-*-*.***.-* | .o,1/3').pitch.seq(Rndf(.8, 2.1), 1 / 8);
      let ss = Schizo({
        chance: .9,
        rate: ms(getRandomInt(250)),
        length: ms(1000)
      });
      s.fx.add(ss);
      let drumVerbb = Reverb({ roomSize: 0.995 });
      s.fx.add(drumVerbb);

      let delay = Delay();

      let q = Seq({
        time: Rndi( ms(2), ms(500) ),
        durations:1/2,
        target: delay
      });

      c.fx.add( delay );

      let bass = Mono({
        waveform: 'Sine',
        filterMult: 0,
        resonance: 0
      });
      bass.play(bassNotes[randomNum], 1 / 2);
      console.log("minorKey");

    } else {

      console.log("neutral");

    }

    stopButton.addEventListener("mousedown", function() {
    
      Gibber.clear();
      c.stop();
      s.stop();
      h.stop();
      b.stop();
      bass.stop();
      console.log("Clear!");

    }, false);

  }, false);

  //UTILITIES
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

};
