var critter = require('voxel-critter')
var ndarray = require('ndarray')
var fill = require("ndarray-fill")
var url = require('url')
var toSTL = require('./')

var mario = "http://i.imgur.com/ccBkMVY.png"

var png
var parsed = url.parse(window.location.href, true)
if (parsed.query && parsed.query.png) png = parsed.query.png
else window.location.href = "?png=" + mario

getProxyImage(png, function(image) {
  var hash = critter.load(image)
  var data = critter.convertToVoxels(hash)
  var l = data.bounds[0]
  var h = data.bounds[1]
  var d = [ h[0]-l[0], h[1]-l[1], h[2]-l[2] ]
  var len = (d[0] + 4) * (d[1] + 4) * (d[2] + 4)
  var voxels = ndarray(new Int32Array(len), [d[0] + 4, d[1] + 4, d[2] + 4])
  
  function generateVoxels(x, y, z) {
    var offset = [x + l[0], y + l[1], z + l[2]]
    var val = data.voxelData[offset.join('|')]
    return val || 0
  }
  
  var interior = voxels.lo(2, 2, 2).hi(d[0], d[1], d[2])
  fill(interior, generateVoxels)
  var stl = toSTL(voxels)
  var smooth = toSTL(voxels, true)
  document.body.appendChild(image)
  image.style.width = '400px'
  display(stl)
  
  var buttons = document.querySelector('.buttons')
  var loading = document.querySelector('.loading')
  var voxelButton = document.querySelector('.voxel')
  var smoothButton = document.querySelector('.smooth')
  var viewVoxel = document.querySelector('.view-voxel')
  var viewSmooth = document.querySelector('.view-smooth')
  buttons.style.display = "inherit"
  loading.style.display = "none"
  
  voxelButton.addEventListener('click', function(e) {
    download(stl)
    e.preventDefault()
    return false
  })
  smoothButton.addEventListener('click', function(e) {
    download(smooth)
    e.preventDefault()
    return false
  })
  viewVoxel.addEventListener('click', function(e) {
    thingiview.loadSTLString(stl)
    setTimeout(function() {
      thingiview.setRotation(false)
    }, 1000)
    e.preventDefault()
    return false
  })
  viewSmooth.addEventListener('click', function(e) {
    thingiview.loadSTLString(smooth)
    setTimeout(function() {
      thingiview.setRotation(false)
    }, 1000)
    e.preventDefault()
    return false
  })
})

function download(stl) {
  var blob = new Blob([stl], { type: 'text/plain' })
  saveAs(blob, 'voxel-object.stl')
}

function display(stl) {
  thingiurlbase = "js"
  window.thingiview = new Thingiview('object')
  thingiview.setObjectColor('#C0D8F0')
  thingiview.initScene()
  thingiview.loadSTLString(stl)
  setTimeout(function() {
    thingiview.setRotation(false)
  }, 1000)
}

function getProxyImage(imgURL, cb) {
  var proxyURL = 'http://maxcors.jit.su/' + imgURL // until imgur gets CORS on GETs
  var img = new Image()
  img.crossOrigin = ''
  img.src = proxyURL
  img.onload = function() {
    cb(img)
  }
}