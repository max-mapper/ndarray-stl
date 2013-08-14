var critter = require('voxel-critter')
var ndarray = require('ndarray')
var toSTL = require('./')

var sword = "http://i.imgur.com/pwXXF1Q.png"
var mario = "http://i.imgur.com/ccBkMVY.png"
var car = "http://i.imgur.com/ZcSVaqy.png"

var fill = require("ndarray-fill")

getProxyImage(mario, function(image) {
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
  var smooth = true
  var stl = toSTL(voxels, smooth)
  var blob = new Blob([stl], { type: 'text/plain' })
  saveAs(blob, smooth ? 'smooth.stl' : 'object.stl')
})

function getProxyImage(imgURL, cb) {
  var proxyURL = 'http://maxcors.jit.su/' + imgURL // until imgur gets CORS on GETs
  var img = new Image()
  img.crossOrigin = ''
  img.src = proxyURL
  img.onload = function() {
    cb(img)
  }
}