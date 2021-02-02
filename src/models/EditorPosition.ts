import { types } from 'mobx-state-tree';
import { Point as PixiPoint } from 'pixi.js';

import Point from 'src/models/Point';
import GenericPoint from 'src/types/point';
import { EditorMode } from 'src/types/editor';

const EditorPosition = types.model({
	position: types.optional(Point, {
		x: 400,
		y: 600,
	}),
	scale: 1,
	mode: types.optional(
		types.enumeration(Object.values(EditorMode)),
		EditorMode.select,
	),
	panning: false,
	screen: types.optional(
		types.model({
			width: types.number,
			height: types.number,
		}),
		{
			width: window.innerWidth,
			height: window.innerHeight,
		}
	),
}).actions((self) => ({
	setScale(scale: number): void {
		self.scale = scale;
	},
	setMode(mode: EditorMode): void {
		self.mode = mode;
	},
	setPanning(panning: boolean): void {
		self.panning = panning;
	},
	setScreenSize(width: number, height: number): void {
		self.screen.width = width;
		self.screen.height = height;
	},
})).views((self) => ({
	get cameraPos(): GenericPoint {
		return {
			x: Math.round(self.screen.width/2),
			y: Math.round(self.screen.height/2),
		};
	},
	get globalCursor(): string {
		if (self.panning) return 'all-scroll';

		switch(self.mode) {
			case EditorMode.addBlock:
			case EditorMode.addVertex:
				return 'crosshair';
				break;
		}

		return 'auto';
	},
	get scaleAsPixiPoint(): PixiPoint {
		return new PixiPoint(self.scale, self.scale);
	},
})).views((self) => ({
	screenToWorld(screenPos: GenericPoint): GenericPoint {
		return {
			x: self.position.x + (screenPos.x - self.cameraPos.x) * (1/self.scale),
			y: self.position.y + (screenPos.y - self.cameraPos.y) * (1/self.scale),
		};
	},
}));

export default EditorPosition;