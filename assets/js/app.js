// We import the CSS which is extracted to its own file by esbuild.
// Remove this line if you add a your own CSS build pipeline (e.g postcss).
//  import "../css/app.css" <-- b/c Tailwind is installed

// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
import "./user_socket.js"


// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"

//  import topbar from "../vendor/topbar"
import socket from "./user_socket.js"

// Our sound/interaction manager
import SynthManager from './audio/synthmanager'

// MIDI
import ClownMidi from "./audio/clownmidi"

// particle
import Particle from './fx/particle'

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
// topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
// window.addEventListener("phx:page-loading-start", info => topbar.show())
// window.addEventListener("phx:page-loading-stop", info => topbar.hide())


// our synth instances
let synthManager = new SynthManager(socket)
synthManager.setup()

// for MIDI keyboards, MPE doesn't work
let clownMIDI = new ClownMidi()
clownMIDI.setup()

// polka dots in canvas
let dots = new Particle()
dots.setup()

// MIDI
window.addEventListener('midikeys', (e) => {  // midikeys is a custom event
    let code = e.detail[0]  // 144 key press, 128 key release
    switch (code) {
        case 144:
            // note ON
            synthManager.keyboardDown(`${e.detail[1]}`)
            break
        case 128:
            // note OFF
            synthManager.keyboardUp(`${e.detail[1]}`)
            break
        default:
            console.log(`default -- code: ${code}`)
    }
})

// our message receiveers
socket.channels[0].on("clowndown", payload => {
    //  console.log(payload)
    synthManager.playNote(payload.body, payload.synth)
    dots.createOne()
})
socket.channels[0].on("clownup", payload => {
    //  console.log(payload)
    synthManager.stopNote(payload.body, payload.synth)
})


// connect if there are any LiveViews on the page
//  liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
//  window.liveSocket = liveSocket

function startup() {
    document.querySelector('#helloinit').addEventListener('click', (ele) => {
        document.querySelectorAll('.hidden').forEach( (ele) => {
            ele.classList.remove('hidden')
        })
        ele.currentTarget.classList.add('hidden')

        // Tone start - esp. mobile click initiated
        synthManager.toneMe()
    })
}

document.addEventListener("DOMContentLoaded", startup);