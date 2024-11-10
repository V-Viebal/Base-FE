import {
	ULID
} from "ulidx"

import {
	CUBFile,
	CUBParagraphEditorParseOutput
} from "@cub/material";
import { Moment } from 'moment';

export type Client = {
	id: ULID;
	name: string;
	thumbnail?: CUBFile;
	thumbnailId?: ULID;
	story?: string;
	content?: CUBParagraphEditorParseOutput;
	createdAt?: Moment;
	updatedAt?: Moment;
}

export enum ClientType {
}
