import random
from api.models import Question
from django.db.models import Max
from django.forms.models import model_to_dict

current_games = {}


def add_new_player(room_id, pseudo):
    player = Player(pseudo)

    # Check if the game exist if not create it
    if room_id not in current_games:
        current_games[room_id] = Game(room_id)
        current_games[room_id].append_player(player)

        return "Host", current_games[room_id]

    # Check if the pseudo is already taken if not create a player with this
    if pseudo not in current_games[room_id].username_list:
        current_games[room_id].append_player(player)
        return "NotHost"
    return False


class Game:
    def __init__(self, room_id):
        self.room_id = room_id

        self.username_list = []
        self.neutral_team = {}
        self.red_team = {}
        self.blue_team = {}

        self.blue_points = 0
        self.red_points = 0

        self.last_answer = ""

    def append_player(self, player):
        self.username_list.append(player.username)
        self.neutral_team[player.username] = player

    def change_team(self, username, team):
        # Change team if wanted
        if username in self.red_team and team == "blue":
            self.blue_team[username] = self.red_team[username]
            self.red_team.pop(username)
        if username in self.blue_team and team == "red":
            self.red_team[username] = self.blue_team[username]
            self.blue_team.pop(username)

        # If not already in a team add the player to the game
        if username in self.neutral_team:
            if team == "red":
                self.red_team[username] = self.neutral_team[username]
            if team == "blue":
                self.blue_team[username] = self.neutral_team[username]
            self.neutral_team.pop(username)

        return {"red": list(self.red_team.keys()), "blue": list(self.blue_team.keys())}

    def pickQuestion(self):
        max_id = Question.objects.all().aggregate(max_id=Max("id"))['max_id']
        pk = random.randint(1, max_id)
        question_dict = model_to_dict(Question.objects.get(pk=pk))

        # Create a cleaned dict with all the correct possible answers
        answers = {"answer": question_dict["answer"]}
        if question_dict["false_answer1"] != "nan":
            answers["false_answer1"] = question_dict["false_answer1"]
        if question_dict["false_answer2"] != "nan":
            answers["false_answer2"] = question_dict["false_answer2"]
        if question_dict["false_answer3"] != "nan":
            answers["false_answer3"] = question_dict["false_answer3"]

        cleaned_dict = {"answers": answers, "question": question_dict["question"], "startGame": "true",
                        "genre": question_dict["genre"]}
        self.last_answer = cleaned_dict["answers"]["answer"]

        return cleaned_dict

    def checkAnswer(self, team, answer):
        if self.last_answer == answer:
            if team == "red":
                self.red_points += 1
            if team == "blue":
                self.blue_points += 1



class Player:
    def __init__(self, username):
        self.username = username
        self.game_ref = ""
