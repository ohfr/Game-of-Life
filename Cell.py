class Cell:
    def __init__(self, state=0):
        self.state = state
        self.color = None

    def get_state(self):
        return self.state

    def set_color(self):
        if self.state == 0:
            self.color = 0,0,0
        else:
            self.color = 255, 255, 255
        return self.color
 