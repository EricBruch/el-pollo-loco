import { Bottle } from './classes/bottle/bottle';
import { Chicken } from './classes/chicken/chicken';
import { Coin } from './classes/coin/coin';
import { scalingFactorAdjustment as scalingFactorAdjustmentType } from "src/app/canvas/types/scalingFactorAdjustment.type";

export let imgCache: HTMLImageElement[] = [];

export let coins: Coin[] = [];

export let chickens: Chicken[] = [];

export let bottles: Bottle[] = [];

export let scalingFactorAdjustment: scalingFactorAdjustmentType = {
  x_ScalingAdjustment: undefined,
  y_ScalingAdjustment: undefined,
};
