#!/usr/bin/python
# -*- coding: UTF-8 -*-

from __future__ import print_function
import os
import traceback
import itertools
from struct import *
import asyncio
import websockets
import json
import datetime
import random


class PyServerAPI(object):
    def __init__(self):
        self.users = set()

    async def register(self, websocket):
        self.users.add(websocket)

    async def unregister(self, websocket):
        self.users.remove(websocket)

    async def handler(self, websocket, path):
        # register(websocket) sends user_event() to websocket
        await self.register(websocket)
        async for message in websocket:
            try:
                # print(message)
                # logger.debug(message)
                msg = json.loads(message)
                cmd = msg["cmd"]
                data = msg["data"]
                if cmd == 'inited':
                    await self.sendMsg(websocket, 'reply_inited', "Server Init OK")
                else:
                    pass
            except Exception as e:
                try:
                    err_msg = traceback.format_exc()
                    print(err_msg)
                    await self.sendMsg(websocket, 'reply_server_error', {'error': err_msg})
                except:
                    print('error')

    async def sendMsg(self, websocket, cmd, data=None):
        msg = {'cmd': cmd, 'data': data}
        filter_cmd = ['update_cur_status', 'pong', 'ignore']

        try:
            jData = json.dumps(msg)
            await websocket.send(jData)
        except Exception as e:
            err_msg = traceback.format_exc()


def main():
    try:
        sokObj = PyServerAPI()
        port = 6849
        addr = 'ws://127.0.0.1:{}'.format(port)
        print('start running on {}'.format(addr))

        start_server = websockets.serve(
            sokObj.handler, "127.0.0.1", port, ping_interval=30, write_limit=2**20)
        loop = asyncio.get_event_loop()
        loop.run_until_complete(start_server)
        loop.run_forever()
        loop.close()
    except Exception as e:
        err_msg = traceback.format_exc()
        print(f'backend fatal error when initializing: {err_msg}')


if __name__ == '__main__':
    main()
