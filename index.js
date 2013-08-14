var isosurface = require('isosurface')
var aomesher = require('ao-mesher')
var normals = require('normals')

module.exports = function(voxels, options) {
  if (!options) options = {}
  if (options.smooth) return smoothSTL(voxels, options)
  else return normalSTL(voxels, options)
}

module.exports.buildSTL = buildSTL

function normalSTL(voxels, options) {
  var m = aomesher(voxels)
  
  // ao-mesher sequence
  // 0  1  2   3   4   5   6    7
  // x, y, z, ao, nx, ny, nz, tid

  var faces = []
  var normals = []
  for (var i = 0; i < m.length; i += 24) {
    var face = [
      [m[i + 0], m[i + 1], m[i + 2]],
      [m[i + 8], m[i + 9], m[i + 10]],
      [m[i + 16], m[i + 17], m[i + 18]]
    ]
    var normal = [128 - m[i + 4], 128 - m[i + 5], 128 - m[i + 6]]
    faces.push(face)
    normals.push(normal)
  }
  return buildSTL(faces, normals, options)
}

function smoothSTL(voxels, options) {
  var net = isosurface[options.method || 'surfaceNets'](voxels.shape, function(x, y, z) {
    return voxels.get(x, y, z) - 1
  })
  var faces = []
  for (var i = 0; i < net.cells.length; ++i) {
    var cell = net.cells[i]
    var face = [
      net.positions[cell[0]],
      net.positions[cell[1]],
      net.positions[cell[2]]
    ]
    faces.push(face)
  }
  var faceNormals = normals.faceNormals(net.cells, net.positions)
  return buildSTL(faces, faceNormals, options)
}

function buildSTL(faces, normals, options) {
  var stl = []
  stl.push("solid snake")
  for (var i = 0; i < faces.length; ++i) {
    var face = faces[i]
    var normal = normals[i]
    stl.push("facet normal " + normal.join(' '))
    stl.push("outer loop")
    if (options.faceFormat) face = options.faceFormat(face)
    stl = stl.concat(face.map(stringifyVertex))
    stl.push("endloop")
    stl.push("endfacet")
  }
  stl.push("endsolid")
  return stl.join('\n')
}

function stringifyVertex(vec) {
  return "vertex " + vec.join(' ')
}
