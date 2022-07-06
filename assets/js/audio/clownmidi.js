class ClownMidi {

    constructor() {
        this.clownMIDI = undefined
    }

    setup() {
        try {
            navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this))            
        } catch (error) {
            console.log("MIDI not supported")
        }
    }

    onMIDISuccess(midiAccess) {
        console.log("MIDI Ready")
        this.clownMIDI = midiAccess
        this.listInputsAndOutputs(midiAccess)
        this.startLoggingMIDIInput(midiAccess)
    }

    onMIDIFailure(msg) {
        console.log("MIDI failed")
    }

    listInputsAndOutputs(midiAccess) {
        for (var entry of midiAccess.inputs) {
            var input = entry[1];
            console.log("Input port [type:'" + input.type + "'] id:'" + input.id +
                "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
                "' version:'" + input.version + "'");
        }

        for (var entry of midiAccess.outputs) {
            var output = entry[1];
            console.log("Output port [type:'" + output.type + "'] id:'" + output.id +
                "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
                "' version:'" + output.version + "'");
        }
    }

    onMIDIMessage(event) {
        // var str = "MIDI message received at timestamp " + event.timeStamp + "[" + event.data.length + " bytes]: "
        // for (var i = 0; i < event.data.length; i++) {
        //     str += "0x" + event.data[i].toString(16) + " "
        // }
        // console.log(str)
        //  console.log(`${event.data[0]} ${event.data[1]} ${event.data[2]}`)
        dispatchEvent(new CustomEvent('midikeys', {detail: event.data}))
    }

    startLoggingMIDIInput(midiAccess, indexOfPort) {
        midiAccess.inputs.forEach((entry) => { entry.onmidimessage = this.onMIDIMessage });
    }
}

export default ClownMidi