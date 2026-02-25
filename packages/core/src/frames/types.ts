export interface FrameManifest {
  version: number;
  frames: FrameDefinition[];
}

export interface FrameDefinition {
  id: string;
  name: string;
  manufacturer: string;
  year: number;
  platform: 'ios' | 'android';
  framePath: string;
  screenArea: ScreenArea;
  frameSize: FrameSize;
  frameBorderRadius?: number;
  screenResolution: ScreenResolution;
  tags: string[];
}

export interface ScreenArea {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
}

export interface FrameSize {
  width: number;
  height: number;
}

export interface ScreenResolution {
  width: number;
  height: number;
}
