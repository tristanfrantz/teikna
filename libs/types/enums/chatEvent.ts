export enum RoomEvent {
  CONNECT = 'connect',
  JOINROOM = 'join',
  CREATEROOM = 'createroom',
  LEAVEROOM = 'leave',
  DISCONNECT = 'disconnect',
  SELECTWORD = 'selectword',
  ROUNDEND = 'roundend',
  ROUNDSTART = 'roundstart',
}

export enum MessageEvent {
  MESSAGE = 'message',
  GUESS = 'guess',
  DRAW = 'draw',
  CLEAR = 'clear',
  ERASE = 'erase',
  FILL = 'fill',
  CORRECTGUESS = 'correctguess',
  CLOSEGUESS = 'closeguess',
  USERLIST = 'userlist',
  WORDLIST = 'wordlist',
}
