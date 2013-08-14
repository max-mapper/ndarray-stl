# ndarray-stl

Converts an [ndarray](https://github.com/mikolalysenko/ndarray) of voxels into an ascii [STL](https://en.wikipedia.org/wiki/STL_(file_format)) file suitable for 3D printing or other 3D applications.

You can also smooth the voxel volumes using various [isosurface smoothing algorithms](http://0fps.wordpress.com/2012/07/12/smooth-voxel-terrain-part-2/) such as marching cubes or surface nets.

STL files don't support color data, sorry.

[![NPM](https://nodei.co/npm/ndarray-stl.png)](https://npmjs.org/ndarray-stl)

```
npm install ndarray-stl
```

## How it works

This will work with any voxel data, but I built it to work with another app I made called [Voxel Builder](http://voxelbuilder.com). One of the users of DIY.org named burgzt made a [sweet mario](https://diy.org/burgzt/001em5) using it:

(![mario](img/mario-builder.png))[http://voxelbuilder.com/#A/XiklSfSfSfYfShShShYaSfSfSfYhShShShahdShShShajdShShShcbhYhYhYhYhYhYhYhaZfYhYhYhYhYhYhYhaffYhYdYhYeYfYfYfSfYhYhYhYhYhYhYhSkYfYfYfYfYfYfYfShYhYhYhYhYhYhYhSaYfYfYfYfYfYfYffnhhhShShYhSfSfWhiSfSfWeiSfSfehiiUfUfWifUfUfWifUfUfcXhShShafeShShWheShShWeeShShefieShShWfeUfWhhShWffShXjebShShYhSeShfiehkYhYhYhYhYhSfYeYhYdYfYiaefYhYhYhYhYhabjShShYhSeShahfShShaheShShYhSeahiaffahfShSbYfYfYfYfYfalfYfYfYfYfYffhhnhYjZcfYiYhYiabfYhYhYhYhYhSfYfYfYfYfYfSfSfSfSfSfYhSiSfSjSfahhYhaffSfSfSfYhSiSfSiahhSfSfSfSfahkSfSfSfSfefhnSfSfSfadjSfSfSfSfSfSfSfahnSfSfSfSfSfSfSfahnSfSfSfSfSfSfSfahjSfSfSffbficShShaneShShehheYhafhYhafhYhYXSfSfYhShShaleShShaheShShfbhckShShShShShShajaShShShShShShedhfSeShSdShajfShShShShfefccYhaffYhafiYhafhYhafhYhafhYhafhYhefhbYhafhYhafhYhafhYhafhYhedfdYfYfShYiYfahhYfYfeiheYfShYhShYfemfeShShaheShShYhSeSheehfYhafhYhafhYhfchhlYhYeYjYhYbalhYfYfYfYfYfakeYhYdSfahhYdYhaffYhYiYhYhSfYfYeYhYdYhaffYhYhYhYhYhfahlhYhYhYhYhYhYhYhaahYhYhYhYhYhaaeSfanhSfTffSfSfaZiSfSfamkSfSfSfSfafkSfSfSfSfafkSfSfSfSfafkSfSfSfSfafkSfSfSfSfafkSfSfSfSfblfhYfYfYfYfYfakfYfYfYfYfYledhmYhbfhfShShaheShShefhdShShaheShShecfdSfSfYnYfYfYfYfYfYfamhYfYfYfYfYfYfalhYfYfYfYfYfYmTdhSfSfaZiSfSfamiSfSfafiSfSfafiSfSfafiSfSfafiSfSfafiSfSfalfYfYfYfYfYfXhmaUhclfUhdfflYfYfYfcjhYfYfYfaihYfedfeYnSfSfYfSiSfafhSfSfafiSfSfafiSfSfafiSfSfafiSfSfafhSfbnehShafeShShYfSfSfafiSfSfYfShShYfSfSfafiSfSfafiSfenhiSfSfafiSfSfafiSfSfafiSfSfafiSfSfafiSfSfafiSfSfafiSfSfbnjfShYfSfYfShaffShaffShYfSfYfShYfSfXhefShShShShShahaShShShShShShShahZShShShShShShShahZShShShShShShShahZShShShShShShShahZShShShShShShShahZShShShShShShShahaShShShShShaaiYlYfYfYfYfaefYneahaShShShShShahbShShShShShahbShShShShShahbShShShShShahbShShShShShahbShShShShShfidahUfcXhUfehfhYnfhWmhYfYfYjadfSfSeShahiSfSfSfahjSfSfSfahjSfSfSfedhjYhYhaefYhYhaefYhYhaefYhYheXfkYfYiYhSfSfSfSfafjSfSfSfafjSfSfSfafjSfSfSfcjhYfYfaihYfYfaihYfYfaihYfYf:C/2ecc713498db34495ee67e22ecf0f1ff0202f9efa674420b]

When you export your creation from Voxel Builder you get a PNG file with the voxel data magically encoded inside. That means you can upload the PNG photo of your creation into any app that knows how to extract it and you can then fully view edit your 3D in that app.

For example, this image has encoded voxel data hidden inside:

![mario-encoded](http://i.imgur.com/ccBkMVY.png)

In the [ndarray-stl] demo I load the mario image (or any PNG url, you can specify one in the address bar), read the voxel data from the PNG and then generate an STL file from the voxels using ndarray-stl. You can also generate a smoothed voxel model. STL files can then be loaded into programs like MakerWare and 3D printed!


![mario-makerware](img/mario-makerware.png)


## api

see `demo.js` for example usage

### var stlify = require('ndarray-stl')

require the module

### stlify(voxels, options)

`voxels` has to be a 3d ndarray. returns an ascii stl string.

`options` an object with these defaults:

```js
{
  "smooth": false,
  "method": "surfaceNets",
  "faceFormat": false
}
```

You can set `smooth` to true and pick a smoothing `method`, available methods are `surfaceNets`, `marchingCubes` or `marchingTetrahedra`.

To change the face format that gets serialized into the STL you can specify a `faceFormat`, e.g.:

```js
function (f) {
  var backwardsWindedFaceVertices = [f[2], f[1], f[0]]
  return backwardsWindedFaceVertices.map(function rotateVertices(v) {
    return [v[0], -v[2], v[1]]
  })
}
```

## license

BSD
