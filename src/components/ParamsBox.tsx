import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';
import Box from 'src/components/Box';
import TextParam from 'src/components/TextParam';
import AngleParam from 'src/components/AngleParam';
import StaticParam from 'src/components/StaticParam';
import HoppiParam from 'src/components/HoppiParam';
import RadiusParam from 'src/components/RadiusParam';
import ZOrderParam from 'src/components/ZOrderParam';
import BlockParam from 'src/components/BlockParam.tsx';
import DangerButton from 'src/components/DangerButton';
import Hoppi from 'src/models/Hoppi';
import Text from 'src/models/Text';
import Entity from 'src/models/Entity';
import Block from 'src/models/Block';

const ParamsBox: FunctionComponent = () => {
	const { editor: { selection } } = useStore();

	if (selection.size === 0) return null;

	if (selection.size > 1) {
		return (
			<Box title={`${selection.size} entities selected`}/>
		);
	}

	const selectedEntity = Array.from(selection.values())[0];

	function onDelete(): void {
		selectedEntity.remove();
	}

	return (
		<Box title={selectedEntity.displayName}>
			{Hoppi.is(selectedEntity) && (
				<HoppiParam hoppi={selectedEntity}/>
			)}
			{('params' in selectedEntity) && ('setAngle' in selectedEntity) && ('angle' in selectedEntity.params) && (
				<AngleParam angleEntity={selectedEntity}/>
			)}
			{('params' in selectedEntity) && ('setRadius' in selectedEntity) && ('radius' in selectedEntity.params) && (
				<RadiusParam radiusEntity={selectedEntity}/>
			)}
			{Text.is(selectedEntity) && (
				<TextParam text={selectedEntity}/>
			)}
			{('params' in selectedEntity) && ('setIsStatic' in selectedEntity) && ('isStatic' in selectedEntity.params) && (
				<StaticParam staticEntity={selectedEntity}/>
			)}
			{Entity.is(selectedEntity) && (
				<ZOrderParam entity={selectedEntity}/>
			)}
			{Block.is(selectedEntity) && (
				<BlockParam blockEntity={selectedEntity}/>
			)}
			<DangerButton onClick={onDelete}>
				<FontAwesomeIcon icon={faTrashAlt}/>
				&#32;
				Delete entity
			</DangerButton>
		</Box>
	);
};

export default observer(ParamsBox);
