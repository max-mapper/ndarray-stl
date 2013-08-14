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
  var len = (d[0] + 8) * (d[1] + 8) * (d[2] + 8)
  var voxels = ndarray(new Int32Array(len), [d[0] + 4, d[1] + 4, d[2] + 4])
  
  function generateVoxels(x, y, z) {
    var offset = [x + l[0], y + l[1], z + l[2]]
    var val = data.voxelData[offset.join('|')]
    if (val === 0) val = 1 // green voxels are stored as zeroes by voxelbuilder
    return val || 0
  }
  
  var interior = voxels.lo(1, 1, 1).hi(d[0] + 4, d[1] + 4, d[2] + 4)
  fill(interior, generateVoxels)
  
  var normalOptions = {
    faceFormat: function(f) {
      return f.map(function(v) {
        return [v[0], -v[2], v[1]]
      })
    }
  }
  
  var smoothOptions = {
    faceFormat: function(f) {
      return [f[2], f[1], f[0]].map(function(v) {
        return [v[0], -v[2], v[1]]
      })
    },
    smooth: true,
    method: 'surfaceNets'
  }
  
  var stl = toSTL(voxels, normalOptions)
  var smooth = toSTL(voxels, smoothOptions)
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