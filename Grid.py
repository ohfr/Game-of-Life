import random

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

class Grid:
    def __init__(self):
        self.grid = []

    def create_cells(self, rows=25, cols=25):
        for i in range(rows):
            self.grid.append([])
            for col in range (cols):
                cell = Cell()
                self.grid[i].append(cell)

    def countNeighbors(self, x, y):
        sum = 0
        for i in range(-1, 2):
            for j in range(-1, 2):
                sum += self.grid[i+x][j+y].state
        sum -= self.grid[x][y].state
        return sum