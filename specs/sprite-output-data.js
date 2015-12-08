/* Sprite data should be output in the following JSON format: */

var data = [
    {
        name: 'image-name', // The name of the css class
        x: -100, // the background position x component
        y: -100, // the background position y component
        w: 100, // the width of the image. Optional, leave undefined if the width should not be included in the css.
        h: 100, // the height of the image. Optional, leave undefined if the width should not be included in the css.
        src: 'base64 image data',
    }
]

data.w: 100, // The width of the sprite image
data.h: 100, // The height of the sprite image
data.cmw: 100, // common width. Optional. Set if a width should be set in the root class
data.cmh: 100, // common height. Optional. Set if a height should be set in the root class
data.src: 'data:xxx' // sprite image data



/* Properties used internally

dw: 100, // the width of the image when drawn into the sprite
dh: 100, // the height of the image when drawn into the sprite
cw: 100, // the container width of the image
ch: 100, // the container height of the image
cx: 100, // the container offset from sprite left.
cy: 100, // the container offset from sprite top
dx: 100, // the image offset from container left
dy: 100, // the image offset from container top

*/
