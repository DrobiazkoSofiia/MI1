
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
Tone.context = audioContext;


const reverb = new Tone.Reverb(3).toDestination();  // Set initial reverb decay to 3 seconds
let isReverbOn = false;


const audioPlayer = document.getElementById('audio-player');


const player = new Tone.Player().toDestination();
player.autostart = false;  


document.getElementById('audio-file').addEventListener('change', function(event) {
    const file = URL.createObjectURL(event.target.files[0]);

  
    audioPlayer.src = file;
    audioPlayer.load();


    player.load(file)
        .then(() => {
            console.log("Audio loaded into Tone.js Player");
        })
        .catch(err => {
            console.error("Error loading audio into Tone.js Player", err);
        });
});

audioPlayer.addEventListener('play', () => {
    if (player.loaded) {
        player.start();  
    }
});

audioPlayer.addEventListener('pause', () => {
    if (player.loaded) {
        player.stop(); 
    }
});

const reverbDecayControl = document.getElementById('reverb-decay');
const reverbValueDisplay = document.getElementById('reverb-value');
reverbDecayControl.value = 3;  
reverbValueDisplay.textContent = "3";  

reverbDecayControl.addEventListener('input', () => {
    const decayTime = parseFloat(reverbDecayControl.value);
    

    if (isReverbOn) {
        reverb.decay = decayTime;
    }

    reverbValueDisplay.textContent = decayTime.toFixed(1);
    console.log(`Reverb decay set to: ${decayTime} seconds`);
});

document.getElementById('reverb-btn').addEventListener('click', () => {
    if (!isReverbOn) {
        player.connect(reverb); 
        isReverbOn = true;  
        console.log("Reverb effect enabled");
    } else {
        player.disconnect(reverb);  
        isReverbOn = false;  
        console.log("Reverb effect disabled");
    }
});

const synth = new Tone.MembraneSynth().toDestination();
const loop = new Tone.Loop(time => {
    synth.triggerAttackRelease("C2", "8n", time);  
}, "4n");

const bpmControl = document.getElementById('beat-speed');
const bpmValueDisplay = document.getElementById('bpm-value');
bpmControl.addEventListener('input', () => {
    const bpm = parseInt(bpmControl.value);
    Tone.Transport.bpm.value = bpm;
    bpmValueDisplay.textContent = bpm;
    console.log(`Beat speed set to: ${bpm} BPM`);
});

document.getElementById('loop-btn').addEventListener('click', () => {
    if (Tone.Transport.state === 'started') {
        Tone.Transport.stop();
    } else {
        Tone.Transport.start();
        loop.start(0);
    }
    console.log("Beat loop toggled");
});
