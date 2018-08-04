var THREE = require('three')
var OrbitControls = require('three-orbit-controls')(THREE)

var scene = new THREE.Scene(0x2a2a2a)

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.z = 10

var renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

//TODO refacto
const createLights = () => {
    var ambientLight = new THREE.AmbientLight(0x0)
    scene.add(ambientLight)

    var pointLightFront = new THREE.PointLight(0xffffff, 1, 0),
        pointLightBack = new THREE.PointLight(0xffffff, 1, 0)

    pointLightFront.position.set(0, 0, 7)
    pointLightBack.position.set(0, 0, -pointLightFront.position.z)

    scene.add(pointLightFront)
    scene.add(pointLightBack)

    // scene.add(new THREE.PointLightHelper(pointLightFront, 1))
    // scene.add(new THREE.PointLightHelper(pointLightBack, 1))
}

const createClock = () => {
    var geometry = new THREE.CircleGeometry(5, 128)

    var material = new THREE.MeshPhongMaterial({
        color: 0x222222,
        emissive: 0x0,
        specular: 0xd101e,
        shininess: 60,
        side: THREE.DoubleSide
    })

    var clock = new THREE.Mesh(geometry, material)

    scene.add(clock)
}

const createHand = (length, color) => {
    var handGeometry = new THREE.ConeBufferGeometry(0.1, length, 32)

    var handMaterial = new THREE.MeshPhongMaterial({
        color: color
    })

    var hand = new THREE.Mesh(handGeometry, handMaterial)

    hand.position.y = length / 2    //put hand's bottom at clock's center
    hand.position.z += 0.1  //avoid hands collision with the clock

    scene.add(hand)

    //create a pivot to make the hand rotate from the scene's origin (clock's center), and not from its own center.
    var handPivot = new THREE.Group()

    handPivot.add(hand)

    scene.add(handPivot)

    hand.pivot = handPivot

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

createLights()

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

    hoursHand.pivot.rotation.z = -THREE.Math.degToRad(hours12Format * hoursAngleMultiplier + minutes / 2)
    secondsHand.pivot.rotation.z = -THREE.Math.degToRad(seconds * secondsAngleMultiplier + milliSeconds * 0.006)
    minutesHand.pivot.rotation.z = -THREE.Math.degToRad(minutes * minutesAngleMultiplier + seconds * 0.1)
}

animate()
