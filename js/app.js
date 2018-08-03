var THREE = require('three')
var scene = new THREE.Scene()

const createClock = () => {
    var geometry = new THREE.CircleGeometry(5, 32)

    var material = new THREE.MeshPhongMaterial({
        color: 'lightgrey',
        specular: 0x555555,
        shininess: 100
    })

    var clock = new THREE.Mesh(geometry, material)

    scene.add(clock)

    return clock
}

const createHand = (length, color) => {
    var handGeometry = new THREE.Geometry()

    handGeometry.vertices.push(new THREE.Vector3(0, length, 0))
    handGeometry.vertices.push(new THREE.Vector3(0, 0, 0))
    
    var handMaterial = new THREE.LineBasicMaterial({
        color: color
    })
    
    var hand = new THREE.Line(handGeometry, handMaterial)
    
    scene.add(hand)

    return hand
}

const createHourMarkers = () => {
    var geometry = new THREE.CircleGeometry(0.05, 32)

    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    })
    
    var marker = new THREE.Mesh(geometry, material)

    scene.add(marker)
}

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.z = 10

var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
scene.add(light)

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

createClock()

var hoursHand = createHand(3, 0xff0000)
var minutesHand = createHand(4.3, 0x00ff00)
var secondsHand = createHand(5, 0x0000ff)

createHourMarkers() //TODO add hours markers every 6° of the clock. Same for minutes (= seconds) and milliseconds

const animate = function () {
    requestAnimationFrame(animate)

    setHandsRotationAngleFromTime()

    renderer.render(scene, camera)
}

const setHandsRotationAngleFromTime = () => {
    const currentDate = new Date(),
        hours = currentDate.getHours(),
        hours12Format = hours > 12 ? hours - 12 : hours,
        minutes = currentDate.getMinutes(),
        seconds = currentDate.getSeconds(),
        milliSeconds = currentDate.getMilliseconds(),
        hoursAngleMultiplier = 30,
        minutesAngleMultiplier = 6,
        secondsAngleMultiplier = 6

    hoursHand.rotation.z = -THREE.Math.degToRad(hours12Format * hoursAngleMultiplier + minutes / 2)
    minutesHand.rotation.z = -THREE.Math.degToRad(minutes * minutesAngleMultiplier + seconds * 0.1)
    secondsHand.rotation.z = -THREE.Math.degToRad(seconds * secondsAngleMultiplier + milliSeconds * 0.006)
}

animate()
