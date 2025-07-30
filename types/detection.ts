export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  id: string;
  class: string;
  confidence: number;
  bbox: BoundingBox;
  color: string;
}