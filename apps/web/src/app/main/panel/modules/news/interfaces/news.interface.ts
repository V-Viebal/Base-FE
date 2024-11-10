import {
	ULID
} from "ulidx"

import {
	CUBFile,
	CUBParagraphEditorParseOutput
} from "@cub/material";
import {
	Moment
} from 'moment';

export type News = {
	id: ULID;
	topic: string;
	thumbnail?: CUBFile;
	thumbnailId?: ULID;
	description?: string;
	content?: CUBParagraphEditorParseOutput;
	createdAt?: Moment;
	updatedAt?: Moment;
}

export enum NewsType {
}
