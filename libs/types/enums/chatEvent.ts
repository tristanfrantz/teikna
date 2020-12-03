export enum RoomEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CREATEROOM = 'createroom',
  UPDATEROOM = 'updateroom',
  JOINROOM = 'joinroom',
  LEAVEROOM = 'leave',
  SELECTWORD = 'selectword',
  ROUNDEND = 'roundend',
  ROUNDSTART = 'roundstart',
  WORDLIST = 'wordlist',
  ROOMINFO = 'roominfo',
  STARTGAME = 'startgame',
  TURNEND = 'turnend',
}

export enum MessageEvent {
  MESSAGE = 'message',
  DRAW = 'draw',
  CLEAR = 'clear',
  ERASE = 'erase',
  FILL = 'fill',
}
