import * as Tone from 'tone'

class SynthManager {
    constructor(socket) {

        this.socket = socket

        this.filter = new Tone.AutoPanner("6s").start()
        this.reverb = new Tone.Reverb(4)
        this.feedbackDelay = new Tone.FeedbackDelay("4n", 0.75)

        this.amSynth = new Tone.PolySynth(Tone.AMSynth)
        this.duoSynth = new Tone.PolySynth(Tone.DuoSynth)
        this.fmSynth = new Tone.PolySynth(Tone.FMSynth)
        this.membraneSynth = new Tone.PolySynth(Tone.MembraneSynth, {octaves: 4, pitchDecay: 0.1})
        this.metalSynth = new Tone.PolySynth(Tone.MetalSynth)
        this.monoSynth = new Tone.PolySynth(Tone.MonoSynth)
        this.synth = new Tone.PolySynth(Tone.Synth)

        this.amSynth.chain(this.filter, this.reverb, Tone.Destination)
        this.duoSynth.chain(this.filter, this.reverb, Tone.Destination)
        this.membraneSynth.chain(this.reverb, Tone.Destination)
        this.metalSynth.chain(this.reverb, Tone.Destination)
        this.monoSynth.chain(this.filter, this.reverb, Tone.Destination)
        this.synth.chain(this.filter, this.reverb, Tone.Destination)
        this.fmSynth.chain(this.filter, this.feedbackDelay, this.reverb, Tone.Destination)

        this.synths = [this.amSynth,
                       this.duoSynth,
                       this.fmSynth,
                       this.membraneSynth,
                       this.metalSynth,
                       this.monoSynth,
                       this.synth]

        this.synthInt = Math.floor(Math.random() * this.synths.length)
        this.sessionSynth = this.synths[this.synthInt]

        this.socket.channels[0].push("synth_assign", { body: this.synthInt })

        console.log(this.sessionSynth.voice.name)

        this.notes = [
            'c1',
            'd#1',
            'f1',
            'g1',
            'a#1',
            'c2',
            'd#2',
            'f2',
            'g2',
            'a#2',
            'c3',
            'd#3',
            'f3',
            'g3',
            'a#3',
            'c4',
            'd#4',
            'f4',
            'g4',
            'a#4',
            'c5',
            'd#5',
            'f5',
            'g5',
            'a#5',
        ]
        this.notesLength = this.notes.length

    }

    setup() {
        document.querySelector('span').addEventListener('touchstart', (e) => {
            this.pressDown(e)
        })

        document.querySelector('span').addEventListener('mousedown', (e) => {
            this.pressDown(e)
        })

        document.querySelector('span').addEventListener('touchend', (e) => {
            this.pressUp(e)
        })

        document.querySelector('span').addEventListener('mouseup', (e) => {
            this.pressUp(e)
        })
        document.querySelector('span').addEventListener('mouseout', (e) => {
            this.pressUp(e)
        })

    }

    async toneMe() {
        await Tone.start()
        console.log('audio is ready')
    }

    pressDown(e) {
        // get a note and assign that value to a data attr for ephemeral state
        let note = this.getRandomNote()
        e.target.textContent = "🫥"
        e.currentTarget.dataset.note = note

        this.socket.channels[0].push("clowndown", { body: note })  // old -> this.playRandomNote(note)
    }

    pressUp(e) {
        e.target.textContent = "🤡"
        if(e.currentTarget.dataset.note) {
            this.socket.channels[0].push("clownup", { body: e.currentTarget.dataset.note })  // old -> this.stopRandomNote(e.currentTarget.dataset.note)
            e.currentTarget.dataset.note = ""
        }
    }

    keyboardDown(note) {
        this.socket.channels[0].push("clowndown", { body: note })
    }

    keyboardUp(note) {
        this.socket.channels[0].push("clownup", { body: note })
    }

    getRandomNote() {
        let note = this.notes[Math.floor(Math.random() * this.notesLength)];
        return note
    }

    playNote(note, synth) {
        // this.synths[synth].triggerAttack(note, Tone.now(), 0.5 + Math.floor(Math.random() * 0.25))
        this.synths[synth].triggerAttack(note, Tone.now())
    }

    stopNote(note, synth) {
        this.synths[synth].triggerRelease(note, Tone.now() + 0.125)
    }

    yo() {
        return "Yo!"
    }

}

export default SynthManager