const container = document.body
const tooltip = document.querySelector('.tooltip')
let tooltipActive = false

// Scene & Controls
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const geometry = new THREE.SphereGeometry( 50, 32, 32 );
var loader = new THREE.TextureLoader();
const texture = loader.load('https://i.imgur.com/lc3FS2T.jpg')
texture.wrapS = THREE.RepeatWrapping
texture.repeat.x = -1
const material = new THREE.MeshBasicMaterial( { 
    map: texture, 
    side: THREE.DoubleSide 
} );
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

// Add Tooltip
function addTooltip(position, id, name, imageURL, price){
    const map = new THREE.TextureLoader().load( 'https://i.imgur.com/FuTJxLz.png' );
    const spriteMaterial = new THREE.SpriteMaterial( { 
        map: map } );

    const sprite = new THREE.Sprite( spriteMaterial );
    sprite.idd = id
    sprite.name = name
    sprite.imageURL = imageURL
    sprite.price = price
    sprite.position.copy(position.clone().normalize().multiplyScalar(20))
    // sprite.scale.multiplyScalar(2)
    scene.add( sprite );
}

// Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.rotateSpeed = 0.2
controls.enableZoom = false
camera.position.set( -1, 0, 0);
controls.update();

function animate() {
    requestAnimationFrame( animate );
    // controls.update();
    renderer.render( scene, camera );
}
animate()

function onResize(){
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / innerHeight;
    camera.updateProjectionMatrix()
}

const rayCaster = new THREE.Raycaster()

function onclick(e){
    let mouse = new THREE.Vector2(
        ( e.clientX / window.innerWidth ) * 2 - 1,
        - (e.clientY / window.innerHeight ) * 2 + 1
    )
    rayCaster.setFromCamera(mouse, camera)
    let intersects = rayCaster.intersectObjects(scene.children)
    intersects.forEach(function (intersect){
        if(intersect.object.type == 'Sprite'){
            console.log(intersect.object.name)
        }
    })
    let intersects2 = rayCaster.intersectObject(sphere)
    if(intersects2.length > 0){
        console.log(intersects2[0].point)
        // addTooltip(intersects[0].point)
    } 
    // debugger
    tooltip.style.display = "none"
}

function onMouseMove(e){
    let mouse = new THREE.Vector2(
        ( e.clientX / window.innerWidth ) * 2 - 1,
        - (e.clientY / window.innerHeight ) * 2 + 1
    )
    rayCaster.setFromCamera(mouse, camera)
    let foundSprite = false
    let intersects = rayCaster.intersectObjects(scene.children)
    intersects.forEach(function (intersect){
        if(intersect.object.type == 'Sprite'){
            let p = intersect.object.position.clone().project(camera)
            tooltip.style.top = ((-1 * p.y + 1.1) * window.innerHeight / 2) + 'px'
            tooltip.style.left = ((p.x + 1) * window.innerWidth / 2) + 'px'
            tooltip.style.display = "block";
            tooltip.classList.add('is-active')
            // tooltip.innerHTML = intersect.object.name
            tooltip.innerHTML = '<img class="thumbnail" src="'+ intersect.object.imageURL +'">'+
                                '<div class="box-element product">'+
                                    '<h6><strong>'+ intersect.object.name +'</strong></h6>'+
                                    '<hr>'+
                                    '<button data-product="' + intersect.object.idd + '" data-action="add" class="btn btn-outline-success add-btn update-cart">Add to Cart</button>'+                                         
                                    '<h4 style="display: inline-block; float: right"><strong>' + intersect.object.price + ' DA</strong></h4>'+
                                '</div>'

            var updateBtns = document.getElementsByClassName('update-cart')

            for (i = 0; i < updateBtns.length; i++) { 
                updateBtns[i].addEventListener('click', function(){
                    var productId = this.dataset.product
                    var action = this.dataset.action
                    console.log('productId:', productId, 'Action:', action)
                    console.log('USER:', user)

                    if (user == 'AnonymousUser'){
                        addCookieItem(productId, action)
                    }else{
                        updateUserOrder(productId, action)
                    }
                })
            }
            tooltipActive = true
            foundSprite = true
        }
    })
    if(foundSprite === false && tooltipActive){
        // tooltip.classList.remove('is-active')
    }

}

addTooltip(new THREE.Vector3(42.61725286117787, -20.325737305162622, -15.944751319588736), '14', 'Volvic EAU MINERALE 1,5 L', 'http://127.0.0.1:8000/images/1.jpg', '30')
addTooltip(new THREE.Vector3(16.154638425316858, 0.2614299157042138, -47.0844523423827), '15', 'Lalla Khedidja Eau Minérale 1.5L', 'http://127.0.0.1:8000/images/2.jpg', '30')
addTooltip(new THREE.Vector3(39.42858611448303, -13.929183922960299, -27.244539401857963), '15', 'Lalla Khedidja Eau Minérale 1.5L', 'http://127.0.0.1:8000/images/2.jpg', '30')
addTooltip(new THREE.Vector3(35.82818443169794, -8.381133583867086, -33.59163142644226), '16', 'Ifri EAU MINERALE 1,5 L', 'http://127.0.0.1:8000/images/3.jpg', '30')
addTooltip(new THREE.Vector3(43.20568236698832, -10.790448308010813, -22.1488149480222), '15', 'Lalla Khedidja Eau Minérale 1.5L', 'http://127.0.0.1:8000/images/2.jpg', '30')
addTooltip(new THREE.Vector3(35.51364270817371, 0.44990613124278933, -35.12777291724859), '16', 'Ifri EAU MINERALE 1,5 L', 'http://127.0.0.1:8000/images/3.jpg', '30')
addTooltip(new THREE.Vector3(12.802179795595924, -24.42062494083678, -41.44455212987827), '17', 'Pepsi 2L Boisson Gazeuse', 'http://127.0.0.1:8000/images/4.jpg', '120')
addTooltip(new THREE.Vector3(-0.3313869259206278, -25.8542994630714, -42.69417053116705), '18', '7up 2L Boisson Gazeuse', 'http://127.0.0.1:8000/images/5.jpg', '120')
addTooltip(new THREE.Vector3(-8.238891526536532, -13.614889082733395, -47.26083150914458), '20', 'Selecto Boisson Gazeuse 2L', 'http://127.0.0.1:8000/images/6.jpg', '120')
addTooltip(new THREE.Vector3(24.016581073609686, 0.1567638907499362, -43.57558543014713), '20', 'Selecto Boisson Gazeuse 2L', 'http://127.0.0.1:8000/images/6.jpg', '120')
addTooltip(new THREE.Vector3(24.81764345933359, -10.744742394553793, -41.79208233790545), '21', 'Hamoud Boualem 2L', 'http://127.0.0.1:8000/images/7.jpg', '120')
addTooltip(new THREE.Vector3(5.267941241340533, -37.02673194318274, -32.99239437650899), '21', 'Hamoud Boualem 2L', 'http://127.0.0.1:8000/images/7.jpg', '120')
addTooltip(new THREE.Vector3(9.868332060351147, 3.2934068595027757, 48.836478085044305), '22', 'Venus Shampoing 2En1 250 Ml', 'http://127.0.0.1:8000/images/8.jpg', '100')
addTooltip(new THREE.Vector3(-20.608237541130116, -13.410775858038388, 43.288485027038554), '23', 'Indomie Cup Curry 60 gr', 'http://127.0.0.1:8000/images/9.jpg', '80')
addTooltip(new THREE.Vector3(-28.504592684447672, 8.176041876649121, 40.042177253728376), '23', 'Indomie Cup Curry 60 gr', 'http://127.0.0.1:8000/images/9.jpg', '80')
addTooltip(new THREE.Vector3(48.59410845731157, -10.263968195011406, 3.2240854475621745), '24', 'Halabi Mix Regular 35g', 'http://127.0.0.1:8000/images/10.jpg', '45')
addTooltip(new THREE.Vector3(46.76783862539711, -10.99048659320264, -12.887321842790918), '25', 'Mahboul – SNAX | Chips', 'http://127.0.0.1:8000/images/11.jpg', '50')
addTooltip(new THREE.Vector3(17.639126688313446, -17.935262027032373, 43.1354825426066), '26', 'Wisso LINGETTE 72 LAVANDE', 'http://127.0.0.1:8000/images/12.jpg', '120')
addTooltip(new THREE.Vector3(-39.33213321697066, -17.861630228157114, 24.89797509993557), '27', 'Pepsi 33CL Boisson Gazeuse', 'http://127.0.0.1:8000/images/13.jpg', '40')
addTooltip(new THREE.Vector3(27.410560910832665, -8.661266435157124, 40.84736275550131), '28', 'Brosse A dents Medium', 'http://127.0.0.1:8000/images/14.jpg', '370')
addTooltip(new THREE.Vector3(20.862789037745628, 3.7795898435747746, 45.06048509552148), '29', 'Sunsilk Shampoing Brillance 180Ml', 'http://127.0.0.1:8000/images/15.jpg', '205')
addTooltip(new THREE.Vector3(-44.415043460827334, -13.62586205213418, -18.38032994046168), '30', 'Coca Cola (1L)', 'http://127.0.0.1:8000/images/16.jpg', '100')
addTooltip(new THREE.Vector3(-42.67870182090411, -20.35075885760373, -15.7016088564849178), '30', 'Coca Cola (1L)', 'http://127.0.0.1:8000/images/16.jpg', '100')
addTooltip(new THREE.Vector3(-40.45026554539702, -26.75405677482395, 11.285056200293303), '15', 'Lalla Khedidja Eau Minérale 1.5L', 'http://127.0.0.1:8000/images/2.jpg', '30')
addTooltip(new THREE.Vector3(-43.43721344402764, -20.493674907707497, 12.969399406989634), '16', 'ifruit Boisson Orange 0.33 L', 'http://127.0.0.1:8000/images/17.jpg', '50')

window.addEventListener('resize', onResize)
container.addEventListener('click', onclick)
container.addEventListener('mousemove', onMouseMove)