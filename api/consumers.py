# chat/consumers.py
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from api import game


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        room_id = self.scope['url_route']['kwargs']['room_id']
        pseudo = self.scope['url_route']['kwargs']['pseudo']

        self.room_name = room_id
        self.room_group_name = 'chat_%s' % self.room_name

        resp = game.add_new_player(room_id, pseudo)

        if resp:
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            self.accept()

            if resp == "Host":
                self.send(text_data=json.dumps({
                    'isHost': "True"
                }))
            elif resp == "NotHost":
                self.send(text_data=json.dumps({
                    'isHost': "False"
                }))

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        if "state" in text_data_json:
            async_to_sync(self.channel_layer.group_send)(self.room_group_name,
                                                         {
                                                             'type': 'get_state',
                                                             'data': text_data_json
                                                         })
        if "message" in text_data_json:
            message = text_data_json['message']

            async_to_sync(self.channel_layer.group_send)(self.room_group_name,
                                                         {
                                                             'type': 'chat_message',
                                                             'message': message
                                                         })

        elif "team" in text_data_json:

            async_to_sync(self.channel_layer.group_send)(self.room_group_name,
                                                         {
                                                             'type': 'team_pick',
                                                             'data': text_data_json
                                                         })
        elif "startGame" in text_data_json:

            async_to_sync(self.channel_layer.group_send)(self.room_group_name,
                                                         {
                                                             'type': 'start_game',
                                                             'data': text_data_json
                                                         })

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))

    def get_state(self, event):
        data = event['data']

        state_type = data['state']
        gameid = data['id']

        if state_type == "team":
            choosed_game = game.current_games[gameid]

            self.send(text_data=json.dumps({
                'color': {"red": list(choosed_game.red_team.keys()), "blue": list(choosed_game.blue_team.keys())}
            }))

    # Receive message from room group
    def team_pick(self, event):
        data = event['data']
        team = data['team']
        username = data['username']
        gameid = data['gameid']

        teams_state = game.current_games[gameid].change_team(username, team)

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'color': teams_state
        }))

    # Start the game
    def start_game(self, event):
        # Send message to WebSocket

        send_dict = game.pickQuestion()
        send_dict.update({'startGame': True})
        self.send(text_data=json.dumps(send_dict))
