import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from api.Game import manager


class GameConsumer(WebsocketConsumer):
    """
    Each instance is a player.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.game = None
        self.pseudo = None

    def connect(self):
        """
        Called when connected with websocket
        """
        room_id = self.scope['url_route']['kwargs']['room_id']
        self.pseudo = self.scope['url_route']['kwargs']['pseudo']

        self.room_group_name = 'chat_%s' % room_id

        # Try to add a new player
        resp = manager.add_new_player(room_id, self.pseudo)

        # If there is no error
        if resp:
            # Add the player to the group
            async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
            self.accept()

            # Keep the reference to the player's game
            self.game = resp[1]

            # Tell the browser what is the role of the player 
            if resp[0] == "Host":
                self.send(text_data=json.dumps({'isHost': "True"}))
            elif resp[0] == "NotHost":
                self.send(text_data=json.dumps({'isHost': "False"}))

    def disconnect(self, close_code):
        """
        Called when websocket is disconnected
        """
        # Leave room group
        self.game.remove_player(self.pseudo)

        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)

    def call_on_everyone(self, function_name, data):
        """
        Call the specified function name with the specified arguments to all instance in this Room
        """
        async_to_sync(self.channel_layer.group_send)(self.room_group_name, {'type': function_name, 'data': data})

    def receive(self, text_data):
        """
        Called when receiving a JSon from the Browser
        """
        data = json.loads(text_data)

        # Get a current state of the game
        if "state" in data:
            self.call_on_everyone('get_state', data)

        # Get the current teams repartition
        if "team" in data:
            self.call_on_everyone('team_pick', data)

        # Start the game and pick a question to send to everyone
        if "startGame" in data:
            send_dict = self.game.pickQuestion()
            self.call_on_everyone('start_game', send_dict)

        # Get the message to send to everyone
        if "message" in data:
            self.call_on_everyone('send_message', data)

        # Get the answer of each teams
        if "answer" in data:
            game_score = self.game.checkAnswer(data['color'], data['answer'])
            game_score["score"] = "score"

            self.call_on_everyone('check_answer', game_score)

    def get_state(self, event):
        """
        Get the state of an element of the game
        """
        data = event['data']
        state_type = data['state']

        if state_type == "team":
            self.send(text_data=json.dumps({'color': {"red": list(self.game.red_team.keys()),
                                                      "blue": list(self.game.blue_team.keys())}}))

    def team_pick(self, event):
        """
        Change the team of a player and send the new teams compo to everyone
        """
        data = event['data']

        teams_state = self.game.change_team(data['username'], data['team'])

        # Send team comp to everyone
        self.send(text_data=json.dumps({'color': teams_state}))

    def start_game(self, event):
        """
        Tell everyone to start the game
        """

        data = event["data"]
        self.send(text_data=json.dumps(data))

    def send_message(self, event):
        """
        Send the message got from the browser and send it to everyone
        """
        message = event['data']

        # Send message to WebSocket
        self.send(text_data=json.dumps({'message': message}))

    def check_answer(self, event):
        """
        Send to everyone the score
        """
        data = event['data']

        self.send(text_data=json.dumps(data))
