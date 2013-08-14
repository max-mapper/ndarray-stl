var critter = require('voxel-critter')
var ndarray = require('ndarray')
var aomesher = require('ao-mesher')
var ops = require('ndarray-ops')
var toSTL = require('./')

var sword = "http://i.imgur.com/pwXXF1Q.png"
var mario = "http://i.imgur.com/ccBkMVY.png"
var car = "http://i.imgur.com/ZcSVaqy.png"

var fill = require("ndarray-fill")

getProxyImage(car, function(image) {
  var hash = critter.load(image)
  var data = critter.convertToVoxels(hash)
  var l = data.bounds[0]
  var h = data.bounds[1]
  var d = [ h[0]-l[0], h[1]-l[1], h[2]-l[2] ]
  var len = (d[0] + 2) * (d[1] + 2) * (d[2] + 2)
  var voxels = ndarray(new Int32Array(len), [d[0] + 2, d[1] + 2, d[2] + 2])
  
  function generateVoxels(x, y, z) {
    var offset = [x + l[0], y + l[1], z + l[2]]
    var val = data.voxelData[offset.join('|')]
    return val || 0
  }
  
  var interior = voxels.lo(1, 1, 1).hi(d[0], d[1], d[2])
  fill(interior, generateVoxels)
  var meshed = aomesher(voxels)
  var stl = toSTL(meshed)
  console.log(stl)
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