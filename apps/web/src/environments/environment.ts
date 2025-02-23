import { appVersion } from './version';

// eslint-disable-next-line @typescript-eslint/typedef
export const ENVIRONMENT = {
	PRODUCTION						: false,
	SERVER_API_URL					: '',
	SERVER_WEBSOCKET_URL			: '',
	FILE_SYSTEM_API_URL				: '',
	APP_URL							: '',
	APP_NAME						: 'Viebal',
	APP_TITLE						: 'Viebal',
	APP_LOGO						: 'assets/images/logos/logo.png',
	APP_LOGO_VERTICAL				: 'assets/images/logos/logo-vertical.png',
	APP_VERSION						: appVersion,
	GOOGLE_CLIENT_ID				: '',
} as const;
