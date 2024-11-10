import {
	ULID
} from "ulidx"
import {
	Moment
} from 'moment';

import {
	CUBParagraphEditorParseOutput
} from "@cub/material";

export type Operation = {
	id: OperationType;
	types: OperationDetailType[];
}

export enum OperationType {
	OVERSEA = 1,
	TOURISM,
	EMPLOYMENT,
	IMMIGRATION,
	SPONSORSHIP,
	VISIT,
}

export type OperationDetailType = {
	id: ULID;
	name: string;
}

export type OperationDetail = {
	id: ULID;
	name: string;
	type: OperationType;
	createdAt?: Moment;
	updatedAt?: Moment;
	description?: CUBParagraphEditorParseOutput;
}

export type OperationDetailCreate
	= Partial<Pick<OperationDetail, 'name' | 'description'>>;

export type OperationDetailUpdate
	= Partial<Pick<OperationDetail, 'name' | 'description'>>;
