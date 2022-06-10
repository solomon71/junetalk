import { Piano } from '@tonejs/piano'
import * as Tone from 'tone'

class SynthManager {
    constructor(socket) {

        this.socket = socket

        this.piano = new Piano({
            velocities: 5
        })

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
        //connect it to the speaker output
        this.piano.toDestination()

        this.piano.load().then(() => {
            this.transportCheck()
        })

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

    }

    pressDown(e) {
        // invoke on mousedown if we have to
        this.transportCheck()

        // get a note and assign that value to a data attr for ephemeral state
        let note = this.getRandomNote()
        e.target.textContent = "🫥"
        e.currentTarget.dataset.note = note

        this.socket.channels[0].push("clowndown", { body: note })  // old -> this.playRandomNote(note)
    }

    pressUp(e) {
        e.target.textContent = "🤡"
        this.socket.channels[0].push("clownup", { body: e.currentTarget.dataset.note })  // old -> this.stopRandomNote(e.currentTarget.dataset.note)
    }

    getRandomNote() {
        let note = this.notes[Math.floor(Math.random() * this.notesLength)];
        return note
    }

    playRandomNote(note) {
        this.piano.keyDown({ note: note, velocity: 0.5 })
    }

    stopRandomNote(note) {
        this.piano.keyUp({ note: note })
    }

    transportCheck() {
        if (Tone.Transport.state == "stopped") {
            Tone.Transport.toggle()
        }
    }

    yo() {
        return "Yo!"
    }

}

export default SynthManager