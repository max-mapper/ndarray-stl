var isosurface = require('isosurface')
var aomesher = require('ao-mesher')
var normals = require('normals')

module.exports = function(voxels, smooth) {
  if (smooth) return smoothSTL(voxels)
  else return normalSTL(voxels)
}

function normalSTL(voxels) {
  var m = aomesher(voxels)
  // ao-mesher sequence
  // 0  1  2   3   4   5   6    7
  // x, y, z, ao, nx, ny, nz, tid

  stl = []
  stl.push("solid pixel")
  for (var i = 0; i < m.length; i += 24) {
    var face = [
      [m[i + 0], m[i + 1], m[i + 2]],
      [m[i + 8], m[i + 9], m[i + 10]],
      [m[i + 16], m[i + 17], m[i + 18]]
    ]
    var normal = [128 - m[i + 4], 128 - m[i + 5], 128 - m[i + 6]]
    stl.push("facet normal "+stringifyVector( normal ))
    stl.push("outer loop")
    stl.push(stringifyVertex(face[0]))
    stl.push(stringifyVertex(face[1]))
    stl.push(stringifyVertex(face[2]))
    stl.push("endloop")
    stl.push("endfacet")
  }
  stl.push("endsolid")
  return stl.join('\n')
}

function smoothSTL(voxels) {
  var net = isosurface.surfaceNets(voxels.shape, function(x, y, z) {
    return voxels.get(x, y, z) - 1
  })
  
  net.normals = normals.faceNormals(net.cells, net.positions)
  
  stl = []
  stl.push("solid pixel")
  for (var i = 0; i < net.cells.length; ++i) {
    var cell = net.cells[i]
    var face = [
      net.positions[cell[0]],
      net.positions[cell[1]],
      net.positions[cell[2]]
    ]
    var normal = net.normals[i]
    stl.push("facet normal " + stringifyVector(normal))
    stl.push("outer loop")
    stl.push(stringifyVertex(face[2]))
    stl.push(stringifyVertex(face[1]))
    stl.push(stringifyVertex(face[0]))
    stl.push("endloop")
    stl.push("endfacet")
  }
  stl.push("endsolid")
  return stl.join('\n')
}

function stringifyVector(vec) {
  return "" + vec[0] + " " + -vec[2] + " " + vec[1]
}

function stringifyVertex(vec) {
  return "vertex " + stringifyVector(vec)
}
