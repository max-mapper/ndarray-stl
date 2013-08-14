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
  
  stl = []
  stl.push("solid pixel")
  faces.map(function(face) {
    if (!face) return
    var normal = surfaceNormal(face)
    // normal = normal.map(function(n) { return n * - 1 })
    stl.push("facet normal " + stringifyVector(normal))
    stl.push("outer loop")
    stl.push(stringifyVertex(face[0]))
    stl.push(stringifyVertex(face[1]))
    stl.push(stringifyVertex(face[2]))
    stl.push("endloop")
    stl.push("endfacet")
  })
  stl.push("endsolid")
  return stl.join('\n')
}

function stringifyVector(vec){
  return ""+vec[0]+" "+vec[1]+" "+vec[2];
}

function stringifyVertex(vec){
  return "vertex "+stringifyVector(vec);
}

// normal methods

function crossprod(a, b) {
  return [
    (a[1] * b[2]) - (a[2] * b[1]),
    (a[2] * b[0]) - (a[0] * b[2]),
    (a[0] * b[1]) - (a[1] * b[0])
  ]
}
 
function subvec(a, b) {
  return [
    b[0] - a[0],
    b[1] - a[1],
    b[2] - a[2],
  ]
}
 
function surfaceNormal(verts) {
  return normalize(crossprod(subvec(verts[2], verts[1]), subvec(verts[0], verts[1])))
}
 
function normalize(v) {
  var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
  if (len === 0) return [0, 0, 0]
  var i = 1 / len
  return [v[0] * i, v[1] * i, v[2] * i]
}