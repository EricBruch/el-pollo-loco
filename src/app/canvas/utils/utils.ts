import { Bottle } from '../classes/bottle/bottle';
import { scalingFactorAdjustment } from '../objects';
import { canvasBaseSizes } from '../types/canvasBaseSizes.type';
import { scalingFactorAdjustmentType } from '../types/scalingFactorAdjustment.type';

/**
 * Sets the Adjustment factor for the scaling of pictures for Scaling on
 * x-axis and y-axis
 * @param canvasWidth the width of the browser window
 * @param canvasHeight the height of the brwoser windpw
 * @param canvasBaseSizes the basic sizes it is compared to
 * @param scalingFactorAdjustment saves the adjustment factor
 */
export function setScalingAdjustment(
  canvasWidth: number,
  canvasHeight: number,
  canvasBaseSizes: canvasBaseSizes,
  scalingFactorAdjustment: scalingFactorAdjustmentType
) {
  scalingFactorAdjustment.x_ScalingAdjustment =
    canvasWidth / canvasBaseSizes.width;
  scalingFactorAdjustment.y_ScalingAdjustment =
    canvasHeight / canvasBaseSizes.height;
}

/**
 * Adds a picture to draw to the canvas
 * @param img -The image to add to the canvas
 * @param offset_x -Starting x-coordinate
 * @param offset_y -Starting y-coordinate
 * @param width -Width of the img
 * @param height -Height of the img
 * @param scaleX  -Scaling factor for x-axis
 * @param scaleY  -Scaling factor for y-axis
 * @param opacity -Opactiy level of the img
 * @param context -The context to draw the img
 * @param bg_elements -The position of BG elements
 */
export function addBGObject(
  img: HTMLImageElement,
  offset_x: number,
  offset_y: number,
  width: number,
  height: number,
  scaleX: number,
  scaleY: number,
  opacity: number,
  context: CanvasRenderingContext2D,
  bg_elements: number
) {
  if (opacity != undefined) {
    context.globalAlpha = opacity;
  }
  context.drawImage(
    img,
    offset_x + bg_elements,
    offset_y,
    width * scaleX,
    height * scaleY
  );
  context.globalAlpha = 1;
}

/**
 * returns the adjusted scaling Factor
 * @param scalingFactor scaling factor of the object
 * @param scalingFactorAdjustment adjustment factor for scaling
 */
export function getAdjustedScalingFactor(
  scalingFactor: number,
  scalingFactorAdjustment: number
): number {
  return scalingFactor * scalingFactorAdjustment;
}

/**
 * Draws all background Images to the background
 * @param img Img to be drawn continously
 * @param canvasWidth Width of the screen
 * @param canvasHeight Height of the screen
 * @param context The Context to draw the background
 * @param bg_elements Position of background elements
 */
export function drawBackgroundPictures(
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  context: CanvasRenderingContext2D,
  bg_elements: number
) {
  for (let i = -3; i < 15; i += 3) {
    addBGObject(
      img,
      canvasWidth * i,
      0,
      canvasWidth * 3,
      canvasHeight,
      1,
      1,
      1,
      context,
      bg_elements
    );
  }
}

export function drawObjects(
  objects: any[],
  scalingFactorAdjustment: scalingFactorAdjustmentType,
  context: CanvasRenderingContext2D,
  bg_elements: number
) {
  objects.forEach((object) => {
    let scaleX = getAdjustedScalingFactor(
      object.getScale(),
      scalingFactorAdjustment.x_ScalingAdjustment
    );
    let scaleY = getAdjustedScalingFactor(
      object.getScale(),
      scalingFactorAdjustment.y_ScalingAdjustment
    );
    let img = object.getImg();
    addBGObject(
      img,
      object.getLeftImgBorder(),
      object.getUpperImgBorder(),
      img.width,
      img.height,
      scaleX,
      scaleY,
      1,
      context,
      bg_elements
    );
  });
}
