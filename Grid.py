import random

class Cell:
    def __init__(self, state=0):
        self.state = random.randint(0,1)
        self.color = None

    def get_state(self):
        return self.state

    def set_color(self):
        if self.state == 0:
            self.color = 0,0,0
        else:
            self.color = 255, 255, 255
        return self.color

class Grid:
    def __init__(self):
        self.grid = []

    def create_cells(self):
        for i in range(25):
            self.grid.append([])
            for col in range (25):
                cell = Cell()
                self.grid[i].append(cell)
