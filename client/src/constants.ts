export const PROD_SERVER_URI = 'https://www.jamn.pub';
export const PROD_WS_SERVER_URI = 'ws://www.jamn.pub';

export const DEV_SERVER_URI = 'http://localhost:9000';
export const DEV_WS_SERVER_URI = 'ws://localhost:9000';

export const REFRESH_ACCESS_TOKEN_TIME = 8 * 60 * 1000;

export const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
export const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

export const OFF_WHITE = '#ededed';


export const VIEW_RADIUS = 10000;

export const SCROLL_SENSITIVITY = 0.1;


export const TAB_HEIGHT = 42;

export const COMMENT_WIDTH = 220;

export const APP_BAR_X = 50;
export const APP_BAR_Y = 50;

export const DEFAULT_MENU_X = 420;

export const CHAR_LIMIT = 280;


export const GOOGLE_CLIENT_ID = '336913970478-lpmpm95r4v7l24u5mhhh9ei77i21ouhl.apps.googleusercontent.com';

export const ALGOLIA_APP_ID = 'YA409EKGDX';

export const ALGOLIA_API_KEY = '5bf84f04ac56a06944dceb0d48b18af1';

export const ALGOLIA_INDEX = process.env.NODE_ENV === 'development'
  ? 'dev_jamn'
  : 'prod_jamn';

export const ORANGE = '#f4900c';

export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoid2VpaHoiLCJhIjoiY2xlNjVuaWI1MDJjcjNybXJsbGo4bXgyMiJ9.w_9vD530_V81gcdS-yZOLw';